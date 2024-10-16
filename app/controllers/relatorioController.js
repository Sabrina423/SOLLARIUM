const relatorioModel = require("../models/relatorioModel");
const moment = require("moment");
const { body, validationResult } = require("express-validator");
const relatorioController = {

  adicionarTarefa: async (req, res) => {
    res.locals.moment = moment;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.render("pages/adicionar", {
        dados: req.body,
        listaErros: errors,
      });
    }
    //banco de dados 
    var dadosForm = {
      nome_tarefa: req.body.tarefa,
      prazo_tarefa: req.body.prazo,
      situacao_tarefa: req.body.situacao,
    };
    let id_tarefa = req.body.id_tarefa;
    try {
        if(id_tarefa==""){
            results = await relatorioModel.create(dadosForm);
        }else{
            results = await relatorioModel.update(dadosForm,id_tarefa);
        }
      res.redirect("/");
    } catch (e) {
      console.log(e);
      res.json({ erro: "Falha ao acessar dados" });
    }
  },

  excluirTarefa: async (req, res) => {
    let { id } = req.query;
    try {
      results = await relatorioModel.delete(id);
      res.redirect("/");
    } catch (e) {
      console.log(e);
      res.json({ erro: "Falha ao acessar dados" });
    }
  },

  finalizarTarefa: async (req, res) => {
    let { id } = req.query;
    try {
      results = await relatorioModel.sistuacaoTarefa(2, id);
      res.redirect("/");
    } catch (e) {
      console.log(e);
      res.json({ erro: "Falha ao acessar dados" });
    }
  },

  exibirTarefaId: async (req, res) => {
    res.locals.moment = moment;
    let { id } = req.query;
    console.log(id);
    try {
      let tarefa = await relatorioModel.findId(id);
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
      console.log(e);
      res.json({ erro: "Falha ao acessar dados" });
    }
  },

  iniciarTarefa: async (req, res) => {
    let { id } = req.query;
    try {
      results = await relatorioModel.sistuacaoTarefa(1, id);
      res.redirect("/");
    } catch (e) {
      console.log(e);
      res.json({ erro: "Falha ao acessar dados" });
    }
  },
};

module.exports = relatorioController;
