const projetosreModel = require("../models/projetosreModel");
const moment = require("moment");
const { body, validationResult } = require("express-validator");
const projetosreController = {
  regrasValidacao: [
    body("tarefa")
      .isLength({ min: 5, max: 45 })
      .withMessage("Nome da Tarefa deve conter de 5 a 45 letras!"),
    body("prazo").isISO8601(),
    body("situacao").isNumeric(),
  ],

  listarprojetosrePaginadas: async (req, res) => {
    res.locals.moment = moment;a
    try {
      results = await projetosreModel.findAll();
      res.render("pages/index", { projetosre: results });
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
      return res.render("pages/adicionar", {
        dados: req.body,
        listaErros: errors,
      });
    }
     
  },

  excluirTarefa: async (req, res) => {
    let { id } = req.query;
    try {
      results = await projetosreModel.delete(id);
      res.redirect("/");
    } catch (e) {
      console.log(e);
      res.json({ erro: "Falha ao acessar dados" });
    }
  },

  finalizarTarefa: async (req, res) => {
    let { id } = req.query;
    try {
      results = await projetosreModel.sistuacaoTarefa(2, id);
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
      let tarefa = await projetosreModel.findId(id);
      res.render("pages/adicionar", {
        dados: {
          ID_PEDIDOS: id,
          CLIENTE_ID_CLIENTE: nome_projetos,
          DATA_PEDIDO: tarefa[0].data_projetos,
          VALOR_TOTAL_PEDIDO: tarefa[0].valor_projetos,
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
      results = await projetosreModel.sistuacaoTarefa(1, id);
      res.redirect("/");
    } catch (e) {
      console.log(e);
      res.json({ erro: "Falha ao acessar dados" });
    }
  },
};

module.exports = projetosreController;
