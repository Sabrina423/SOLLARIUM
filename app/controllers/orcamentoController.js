const orcamento = require("../models/orcamentoModel");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const { removeImg } = require("../util/removeImg");
const fetch = require('node-fetch');
const https = require('https');
const jwt = require('jsonwebtoken');

const orcamentoController = {
    // Validações para o formulário de orçamento
    regrasValidacaoFormOrcamento: [
        body("nome_cliente")
            .isString({ min: 3, max: 45 }).withMessage("O nome do cliente é obrigatório."),
        body('descricao_orcamento')
            .isString({ min: 10 }).withMessage('A descrição deve conter no mínimo 10 caracteres.'),
            body('valor_orcamento')
            .isCurrency({
                allow_negatives: false, // Não permite valores negativos
                allow_blank: false,      // Não permite campos em branco
                decimal_separator: '.',   // Separa decimais com vírgula
                symbol: 'R$',            // Define o símbolo da moeda
                // Se quiser adicionar mais opções, faça aqui
            }).withMessage('O preço deve estar no formato R$ 0.00.'),
        body('data_orcamento')
            .isISO8601().withMessage('A data para execução do serviço deve ser válida.')
    ],

    cadastrarOrcamento: async (req, res) => {
        const erros = validationResult(req);
        if (!erros.isEmpty()) {
            console.log(erros);
            return res.render("pages/orcamento", { listaErros: erros, dadosNotificacao: null, valores: req.body, autenticado: req.session.autenticado });
        }

        const dadosForm = {
            nome_cliente: req.body.nome_cliente,
            descricao_orcamento: req.body.descricao_orcamento,
            valor_orcamento: req.body.valor_orcamento,
            data_orcamento: req.body.data_orcamento,
            id_cliente: req.session.autenticado.id, // Atribui o ID do cliente autenticado
        };

        try {
            await orcamento.create(dadosForm);
            res.render("pages/home", {
                listaErros: null, carrinho: null, autenticado: req.session.autenticado, dadosNotificacao: {
                    titulo: "Orçamento realizado!",
                    mensagem: "Novo orçamento cadastrado com sucesso!",
                    tipo: "success"
                }, valores: req.body
            });
        } catch (e) {
            console.log(e);
            res.render("pages/cadastroOrcamento", {
                listaErros: null, autenticado: req.session.autenticado, dadosNotificacao: {
                    titulo: "Erro ao cadastrar!",
                    mensagem: "Verifique os valores digitados!",
                    tipo: "error"
                }, valores: req.body
            });
        }
    },

    visualizarOrcamento: async (req, res) => {
        try {
            const idOrcamento = req.params.id;
            const resultado = await orcamento.findById(idOrcamento);

            if (!resultado) {
                return res.render("pages/visualizarOrcamento", {
                    listaErros: [{ msg: 'Orçamento não encontrado.' }],
                    dadosNotificacao: null,
                    valores: {}
                });
            }

            res.render("pages/visualizarOrcamento", {
                listaErros: null,
                dadosNotificacao: null,
                valores: resultado
            });
        } catch (e) {
            console.error(e);
            res.render("pages/visualizarOrcamento", {
                listaErros: [{ msg: 'Erro ao buscar o orçamento.' }],
                dadosNotificacao: null,
                valores: {}
            });
        }
    },

    // Atualizar orçamento
    atualizarOrcamento: async (req, res) => {
        const erros = validationResult(req);
        if (!erros.isEmpty()) {
            return res.render("pages/editarOrcamento", {
                listaErros: erros,
                dadosNotificacao: null,
                valores: req.body
            });
        }

        const dadosAtualizados = {
            nome_cliente: req.body.nome_cliente,
            servico: req.body.servico,
            descricao: req.body.descricao,
            valor_estimado: req.body.valor_estimado,
            prazo_execucao: req.body.prazo_execucao
        };

        try {
            const resultado = await orcamento.update(dadosAtualizados, req.params.id);

            if (resultado.affectedRows === 0) {
                return res.render("pages/editarOrcamento", {
                    listaErros: null,
                    dadosNotificacao: { titulo: "Erro!", mensagem: "Orçamento não encontrado.", tipo: "error" },
                    valores: req.body
                });
            }

            res.render("pages/visualizarOrcamento", {
                listaErros: null,
                dadosNotificacao: { titulo: "Sucesso!", mensagem: "Orçamento atualizado com sucesso.", tipo: "success" },
                valores: dadosAtualizados
            });
        } catch (e) {
            console.log(e);
            res.render("pages/editarOrcamento", {
                listaErros: [{ msg: 'Erro ao atualizar o orçamento.' }],
                dadosNotificacao: null,
                valores: req.body
            });
        }
    },

    // Excluir orçamento
    excluirOrcamento: async (req, res) => {
        try {
            const resultado = await orcamento.delete(req.params.id);

            if (resultado.affectedRows === 0) {
                return res.render("pages/listarOrcamentos", {
                    listaErros: [{ msg: 'Orçamento não encontrado.' }],
                    dadosNotificacao: null,
                    valores: {}
                });
            }

            res.render("pages/listarOrcamentos", {
                listaErros: null,
                dadosNotificacao: { titulo: "Sucesso!", mensagem: "Orçamento excluído com sucesso.", tipo: "success" },
                valores: {}
            });
        } catch (e) {
            console.log(e);
            res.render("pages/listarOrcamentos", {
                listaErros: [{ msg: 'Erro ao excluir o orçamento.' }],
                dadosNotificacao: null,
                valores: {}
            });
        }
    }
};

module.exports = orcamentoController;
