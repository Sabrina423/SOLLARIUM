const tarefasModel = require("");
const moment = require("moment");
const { body, validationResult } = require("express-validator");
const tarefasController = {

    regrasValidacao:[
        body("").isLength({ min: 5, max: 45 }).withMessage(""),
        body("").isISO8601(),
        body("").isNumeric()
    ],

    listarTarefasPaginadas: async (req, res) => {
        res.locals.moment = moment;
        try {
            let pagina = req.query.pagina == undefined ? 1 : req.query.pagina;
            let results = null
            let regPagina = 5
            let inicio = parseInt(pagina - 1) * regPagina
            let totReg = await tarefasModel.totalReg();
            let totPaginas = Math.ceil(totReg[0].total / regPagina);
            results = await tarefasModel.findPage(inicio, regPagina);
            let paginador = totReg[0].total <= regPagina 
                ? null 
                : { "pagina_atual": pagina, "total_reg": totReg[0].total, "total_paginas": totPaginas };
            res.render("pages/index", { tarefas: results, paginador: paginador });
        } catch (e) {
            console.log(e); // exibir os erros no console do vs code
            res.json({ erro: "Falha ao acessar dados" });
        }
    },

    adicionarTarefa: async (req, res) => {
        res.locals.moment = moment;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors);
            return  res.render("pages/adicionar", { dados: req.body, listaErros: errors });
        }
        var dadosForm = {
            nome_tarefa: req.body.tarefa,
            prazo_tarefa: req.body.prazo,
            situacao_tarefa: req.body.situacao,
        };
        let id_tarefa = req.body.id_tarefa;
        try {
            if(id_tarefa==""){
                results = await tarefasModel.create(dadosForm);
                totReg = await tarefasModel.totalReg();
                paginaAtual = Math.ceil(totReg[0].total/5)
                res.redirect("/?pagina="+paginaAtual);    
            }else{
                results = await tarefasModel.update(dadosForm,id_tarefa);
                let posicao = await tarefasModel.posicaoReg(id_tarefa);
                let url = "/?pagina=" + Math.ceil(posicao[0].numero_ordem/5);
                res.redirect(url);
            }
        } catch (e) {
            console.log(e);
            res.json({ erro: "Falha ao acessar dados" });
        }
    },

    excluirTarefa: async (req, res) => {
        let { id } = req.query;
        try {
            results = await tarefasModel.delete(id);
            totReg = await tarefasModel.totalReg();
            paginaAtual = Math.ceil(totReg[0].total/5)
            res.redirect("/?pagina="+paginaAtual);
    
        } catch (e) {
            console.log(e);
            res.json({ erro: "Falha ao acessar dados" });
        }
    },

    finalizarTarefa: async (req, res) => {
        let { id } = req.query;
        try {
            results = await tarefasModel.sistuacaoTarefa(2, id);
        } catch (e) {
            console.log(e);
            res.json({ erro: "Falha ao acessar dados" });
        }
        let url = req.rawHeaders[25];
        let urlChamadora = url.replace("http://localhost:3000", "");
        res.redirect(urlChamadora);
    },

    exibirTarefaId: async(req,res) => {
        res.locals.moment = moment;
        let { id } = req.query;
        console.log(id);
        try{
            let tarefa = await tarefasModel.findId(id)
            res.render("pages/adicionar", { dados:{
                 id_tarefa:id, tarefa:tarefa[0].nome_tarefa, 
                 prazo:tarefa[0].prazo_tarefa, situacao:tarefa[0].situacao_tarefa},  listaErros: null });
        }catch(e) {
            console.log(e);
            res.json({ erro: "Falha ao acessar dados" });
        }
    },

    iniciarTarefa: async (req, res) => {
        let { id } = req.query;
        try {
            results = await tarefasModel.sistuacaoTarefa(1, id);
        } catch (e) {
            console.log(e);
            res.json({ erro: "Falha ao acessar dados" });
        }
        let url = req.rawHeaders[25];
        let urlChamadora = url.replace("http://localhost:3000", "");
        res.redirect(urlChamadora);
    }
}

module.exports = tarefasController
