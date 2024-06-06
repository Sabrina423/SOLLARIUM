const tarefasModel = require("../models/tarefas");
const moment = require("moment");
const { body, validationResult } = require("express-validator");

const tarefasController = {

    regrasValidacao: [
        body("tarefa").isLength({ min: 5, max: 45 }).withMessage("Nome da Tarefa deve conter de 5 a 45 letras!"),
        body("prazo").isISO8601().withMessage("Prazo deve ser uma data válida"),
        body("situacao").isNumeric().withMessage("Situação deve ser um número")
    ],

    listarTarefasPaginadas: async (req, res) => {
        res.locals.moment = moment;
        try {
            const pagina = req.query.pagina ? parseInt(req.query.pagina) : 1;
            const regPagina = 5;
            const inicio = (pagina - 1) * regPagina;
            const totReg = await tarefasModel.totalReg();
            const totPaginas = Math.ceil(totReg[0].total / regPagina);
            const results = await tarefasModel.findPage(inicio, regPagina);
            const paginador = totReg[0].total <= regPagina ? null : {
                "pagina_atual": pagina,
                "total_reg": totReg[0].total,
                "total_paginas": totPaginas
            };
            res.render("pages/index", { tarefas: results, paginador });
        } catch (e) {
            console.error(e);
            res.json({ erro: "Falha ao acessar dados" });
        }
    },

    adicionarTarefa: async (req, res) => {
        res.locals.moment = moment;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors);
            return res.render("pages/adicionar", { dados: req.body, listaErros: errors });
        }

        const dadosForm = {
            nome_tarefa: req.body.tarefa,
            prazo_tarefa: req.body.prazo,
            situacao_tarefa: req.body.situacao,
        };

        const id_tarefa = req.body.id_tarefa;
        try {
            if (!id_tarefa) {
                await tarefasModel.create(dadosForm);
                const totReg = await tarefasModel.totalReg();
                const paginaAtual = Math.ceil(totReg[0].total / 5);
                res.redirect("/?pagina=" + paginaAtual);
            } else {
                await tarefasModel.update(dadosForm, id_tarefa);
                const posicao = await tarefasModel.posicaoReg(id_tarefa);
                const url = "/?pagina=" + Math.ceil(posicao[0].numero_ordem / 5);
                res.redirect(url);
            }
        } catch (e) {
            console.error(e);
            res.json({ erro: "Falha ao acessar dados" });
        }
    },

    excluirTarefa: async (req, res) => {
        const { id } = req.query;
        try {
            await tarefasModel.delete(id);
            res.redirect("/");
        } catch (e) {
            console.error(e);
            res.json({ erro: "Falha ao acessar dados" });
        }
    },

    finalizarTarefa: async (req, res) => {
        const { id } = req.query;
        try {
            await tarefasModel.situacaoTarefa(2, id);
            res.redirect("/");
        } catch (e) {
            console.error(e);
            res.json({ erro: "Falha ao acessar dados" });
        }
    },

    exibirTarefaId: async (req, res) => {
        res.locals.moment = moment;
        const { id } = req.query;
        try {
            const tarefa = await tarefasModel.findId(id);
            res.render("pages/adicionar", {
                dados: {
                    id_tarefa: id,
                    tarefa: tarefa[0].nome_tarefa,
                    prazo: tarefa[0].prazo_tarefa,
                    situacao: tarefa[0].situacao_tarefa,
                },
                listaErros: null,
            });
        } catch (e) {
            console.error(e);
            res.json({ erro: "Falha ao acessar dados" });
        }
    },

    iniciarTarefa: async (req, res) => {
        const { id } = req.query;
        try {
            await tarefasModel.situacaoTarefa(1, id);
            res.redirect("/");
        } catch (e) {
            console.error(e);
            res.json({ erro: "Falha ao acessar dados" });
        }
    },
};

module.exports = tarefasController;
