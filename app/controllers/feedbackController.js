const { feedbackModel } = require("../models/feedbackModel");
const { body, validationResult } = require("express-validator");

const feedbackModel = {

    listar: async (req, res) => {
        results = await feedbackModel.findAll(req.session.autenticado.id);
        carrinho.atualizarCarrinho(req);
        res.render("pages/index", {
            autenticado: req.session.autenticado,
            login: req.session.logado,
            listaHq: results,
            carrinho: req.session.carrinho
        });
    },

    favoritar: async (req, res) => {
        if (req.session.autenticado.autenticado == null) {
            res.render("pages/login", { 
                listaErros: null,
                 dadosNotificacao: {
                     titulo: "Faça seu Login!", 
                     mensagem: "Para favoritar é necessário estar logado !", 
                     tipo: "warning" 
                    } 
                });
        } else {
            await feedbackModel.favoritar({
                idfeedback: req.query.id,
                situacao: req.query.sit,
                idCliente: req.session.autenticado.id
            });
            res.redirect("/")
        }
    }

}


module.exports = { feedbackModel }



