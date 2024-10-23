const comissaoreModel = require("../models/comissaoreModel");
const moment = require("moment");
const { body, validationResult } = require("express-validator");
const comissaoreController = {
  regrasValidacao: [
       body("situacao").isNumeric()
        ],

  listarcomissaorePaginadas: async (req, res) => {
    res.locals.moment = moment;
    try {
      results = await comissaoreModel.findAll();
      res.render("pages/index", { comissaore: results });
    } catch (e) {
      console.log(e); // exibir os erros no console do vs code
      res.json({ erro: "Falha ao acessar dados" });
    }
  },

  adicionarcomissaore: async (req, res) => {
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

  excluircomissaore: async (req, res) => {
    let { id } = req.query;
    try {
      results = await comissaoreModel.delete(id);
      res.redirect("/");
    } catch (e) {
      console.log(e);
      res.json({ erro: "Falha ao acessar dados" });
    }
  },

  finalizarcomissaore: async (req, res) => {
    let { id } = req.query;
    try {
      results = await comissaoreModel.sistuacaocomissaore(2, id);
      res.redirect("/");
    } catch (e) {
      console.log(e);
      res.json({ erro: "Falha ao acessar dados" });
    }
  },

  exibircomissaoreId: async (req, res) => {
    res.locals.moment = moment;
    let { id } = req.query;
    console.log(id);
    try {
      let comissaore = await comissaoreModel.findId(id);
      res.render("pages/adicionar", {
        dados: {
            ID_PROF: id,
          VALOR_PAGAMENTO: comissaore[0].prof_nome,
          COMISSÃO: comissaore[0].valor_comiss,
          situacao: comissaore[0].comissão ,        
        },
        listaErros: null,
      });
    } catch (e) {
      console.log(e);
      res.json({ erro: "Falha ao acessar dados" });
    }
  },

  iniciarcomissaore: async (req, res) => {
    let { id } = req.query;
    try {
      results = await comissaoreModel.sistuacaocomissaore(1, id);
      res.redirect("/");
    } catch (e) {
      console.log(e);
      res.json({ erro: "Falha ao acessar dados" });
    }
  },
};

module.exports = comissaoreController;
