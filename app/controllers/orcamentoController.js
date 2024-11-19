const orcamentoModel = require("../models/orcamentoModel");
const servicoModel = require("../models/servicosModel");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const { removeImg } = require("../util/removeImg");
const fetch = require('node-fetch');
const https = require('https');
const jwt = require('jsonwebtoken');
const moment = require('moment')
const orcamentoController = {
    // Validações para o formulário de orçamento
    regrasValidacaoFormOrcamento: [
        body("nome_cliente")
            .isString({ min: 3, max: 45 }).withMessage("O nome do cliente é obrigatório."),
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
    
    
    solicitarOrcamento: async (req, res)=>{
        try{
        // usar o model para listar os serviços
        const results = await servicoModel.findAll();
          

        res.render('pages/orcamento',{listaServicos:results});
        }catch(e){
            console.log(e);

        }
},


    cadastrarOrcamento: async (req, res) => {
        const erros = validationResult(req);
       
        if (!erros.isEmpty()) {
            console.log(erros);
            return res.render("pages/orcamento", { listaErros: erros, dadosNotificacao: null, valores: req.body, autenticado: req.session.autenticado });
        }

        const dadosForm = {
            nome_cliente: req.body.nome_cliente,
            valor_orcamento: req.body.valor_orcamento,
            servicos_prof_id_servico: req.body.id_servico,
            data_orcamento: req.body.data_orcamento,
            id_cliente: req.session.autenticado.id, // Atribui o ID do cliente autenticado
        };

        try {
        var results =  await orcamentoModel.create(dadosForm);
        console.log(results);
            res.render("pages/home", {
                listaErros: null, carrinho: null, autenticado: req.session.autenticado, dadosNotificacao: {
                    titulo: "Orçamento realizado!",
                    mensagem: "Novo orçamento cadastrado com sucesso!",
                    tipo: "success"
                }, valores: req.body
            });
        } catch (e) {
            console.log(e);
            res.render("pages/orcamento", {
                listaErros: null, autenticado: req.session.autenticado, dadosNotificacao: {
                    titulo: "Erro ao cadastrar!",
                    mensagem: "Verifique os valores digitados!",
                    tipo: "error"
                }, valores: req.body
            });
        }
    },

    orcamento: async (req, res) => {
        try {
            const idOrcamento = req.params.id;
            const resultado = await orcamento.findById(idOrcamento);

            if (!resultado) {
                return res.render("pages/orcamento", {
                    listaErros: [{ msg: 'Orçamento não encontrado.' }],
                    dadosNotificacao: null,
                    valores: {}
                });
            }

            res.render("pages/orcamento", {
                listaErros: null,
                dadosNotificacao: null,
                valores: resultado
            });
        } catch (e) {
            console.error(e);
            res.render("pages/orcamento", {
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
            console.log(erros)
            return res.render("pages/updateorc", {
                listaErros: erros,
                dadosNotificacao: null,
                valores: req.body
            });
        }

        const dadosAtualizados = {
           
            valor_orcamento: req.body.valor,
            data_orcamento: req.body.data,
            status_orcamento: 2,
            profissionais_id_prof: req.session.autenticado.id
        }
        try {
            const resultado = await orcamentoModel.update(dadosAtualizados, req.body.id_orcamento);
               console.log(resultado)
            if (resultado.affectedRows === 0) {
                return res.redirect("/orcprof")
            }
            results = await orcamentoModel.findAll();
            res.render("pages/orcprof", {listaOrcamentos: results,
                listaErros: null,
                dadosNotificacao: { titulo: "Sucesso!", mensagem: "Orçamento atualizado com sucesso.", tipo: "success" },
                valores: dadosAtualizados
            });
        }catch (e){
         console.log(e);
            // res.render("pages/updateorc", {
            //     listaErros: [{ msg: 'Erro ao atualizar o orçamento.' }],
            //     dadosNotificacao: null,
            //     valores: req.body
            // });
        }
    },

    listaOrcamentoCliente : async (req, res) => {
        res.locals.moment = moment;
        try {
          results = await orcamentoModel.findAllById(req.session.autenticado.id);
          res.render("pages/listaClienteorc", { listaOrcamentos: results });
    } catch (e) {
          console.log(e); // exibir os erros no console do vs code
          res.json({ erro: "Falha ao acessar dados" });
        }
      },


      listaOrcamentoProf: async (req, res) => {
        res.locals.moment = moment;
        try {
          results = await orcamentoModel.findAll();
          res.render("pages/orcprof", { listaOrcamentos: results });
    } catch (e) {
          console.log(e); // exibir os erros no console do vs code
          res.json({ erro: "Falha ao acessar dados" });
        }
      },
      

     aceitarOrcamento: async(req,res) => {
        res.local.moment = moment;
        const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.render("pages/verdetalhe", {
        dados: req.body,
        listaErros: errors,
      });
     }
     var dadosForm = {
        valor_orcamento: req.body.valor_orcamento,
        data_orcamento: req.body.data_orcamento,
        
      };
      let id_orcamento = req.body.id_orcamento;
      try {
       

            results = await orcamentoModel.update(dadosForm,id_orcamento);
        
      res.redirect("/");
    } catch (e) {
      console.log(e);
      res.json({ erro: "Falha ao acessar dados" });
    }
},

recusarOrcamento: async (req, res) => {
    let { id } = req.query;
    try {
      results = await orcamentoModel.delete(id);
      res.redirect("/");
    } catch (e) {
      console.log(e);
      res.json({ erro: "Falha ao acessar dados" });
    }
  },
 


    // Excluir orçamento
    excluirOrcamento: async (req, res) => {
        try {
            const resultado = await orcamento.delete(req.params.id);

            if (resultado.affectedRows === 0) {
                return res.render("pages/listarO", {
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
            res.render("pagesa/listarOrcamentos", {
                listaErros: [{ msg: 'Erro ao excluir o orçamento.' }],
                dadosNotificacao: null,
                valores: {}
            });
        }
    },

    buscarOrcamentoPorId: async (req, res) => {
        const idOrcamento = req.params.id_orcamento;  // Usando o id do orçamento da URL

        try {
            // Usando o modelo para buscar o orçamento pelo ID
            const resultado = await orcamentoModel.findById(idOrcamento);

            // Verificando se o orçamento existe
            if (!resultado) {
                return res.render("pages/orcamento", {
                    listaErros: [{ msg: 'Orçamento não encontrado.' }],
                    dadosNotificacao: null,
                    valores: {}
                });
            }

            // Caso encontre o orçamento, renderiza com os dados
            res.render("pages/orcamento", {
                listaErros: null,
                dadosNotificacao: null,
                valores: resultado
            });

        } catch (e) {
            console.error(e);
            // Caso ocorra erro na consulta ao banco, retorna erro
            res.render("pages/orcamento", {
                listaErros: [{ msg: 'Erro ao buscar o orçamento.' }],
                dadosNotificacao: null,
                valores: {}
            });
        }
    }

    
};

module.exports = orcamentoController;
