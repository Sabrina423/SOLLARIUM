const feedback = require("../models/feedbackModel");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const { removeImg } = require("../util/removeImg");
const fetch = require('node-fetch');
const https = require('https');
const jwt = require('jsonwebtoken');
const { visualizarfeedback } = require("./feedbackController");

const feedbackController = {
    
    regrasValidacaoFormFeedback:[
        //Nome do id 
        body("")
        //o que colocar entre numeros de caracteres é mensagens de erros
           .isString({min: , max: }).withMessage("")
    ]

    cadastradadosFeedback: async (req, res) => {
        const erros = validationResult(req);
        if (!erros.isEmpty()){
            console.log(erros);
            return res.render("pages/feedback", { listaErros: erros, dadosNotificacao: null, valores: req.body, autenticado: req.session.autenticado })
        }

        const dadosFormFormu = {
            //nome do id : req.body. id 
            //Identificador da tabela exemplo idprofissional é id cliente: req.session.autenticado.id,
        };

        try{
            await feedback.create(dadosFormFormu);
            res.render("pages/home",{
                listaErros: null, carrinho: null, autenticado: req.session.autenticado, dadosNotificacao: {
                    titulo: "Feedback Realizado!",
                    mensagem: "Novo feedback adicionado com sucesso!",
                    tipo: "success"
                }, valores: req.body
            });
        } catch (e) {
            console.log(e);
            res.render("pages/feedback", {
                listaErros: null, autenticado: req.session.autenticado, dadosNotificacao: {
                    titulo: "Erro ao enviar o feedback!",
                    mensagem: "Verifique os dados digitados!",
                    tipo: "error"
                }, valores: req.body
            })
        }
    },
    
    visualizarFeedback: async (req, res) =>{
        try{
            const idFeedback = req.params.idFeedback
            const resultado = await feedback.findById(feedback);

            (!resultado){
                return res.render("pages/visualizarFeedback", {
                    listaErros: [{ msg: 'Feedback não encontrado.' }],
                    dadosNotificacao: null,
                    valores: {}
                });

            }
             res.render("pages/visualizarFeedback", {
                listaErros: null,
                dadosNotificacao: null,
                valores: resultado
                });
        } catch (e){
            console.error(e);
            res.render("pages/visualizarFeedback", {
                listaErros: [{ msg: 'Erro ao buscar o Feedback.' }],
                dadosNotificacao: null,
                valores: {}
            });
        }
    },
    atualizarFeedback: async (req , res) =>{
        const erros =validationResult(req);
        if (!erros.isEmpty()) {
            return res.render("pages/editarFeedback",{
                listaErros: erros,
                dadosNotificacao: null,
                valores: req.body
            }),
        }
        const dadosAtualizadosfed = {
            //nome do id : req.body. id 
            //Identificador da tabela exemplo idprofissional é id cliente: req.session.autenticado.id,
        };
        try {
            const resultado = await feedback.update(dadosAtualizadosfed, req.params.id);

            if (resultado.affectedRows === 0) {
                return res.render("pages/editarfeedback", {
                    listaErros: null,
                    dadosNotificacao: { titulo: "Erro!", mensagem: "feedback não encontrado.", tipo: "error" },
                    valores: req.body
                });
            }
            res.render("pages/visualizarfeedback", {
                listaErros: null,
                dadosNotificacao: { titulo: "Sucesso!", mensagem: "feedback atualizado com sucesso.", tipo: "success" },
                valores: dadosAtualizadosfed
            });
    }catch (e) {
        console.log(e);
        res.render("pages/editarfeedback", {
            listaErros: [{ msg: 'Erro ao atualizar o feedback.' }],
            dadosNotificacao: null,
            valores: req.body
        });
    }
},
excluirfeedback: async (req, res) => {
    try {
        const resultado = await feedback.delete(req.params.id);

        if (resultado.affectedRows === 0) {
            return res.render("pages/listarfeedbacks", {
                listaErros: [{ msg: 'feedback não encontrado.' }],
                dadosNotificacao: null,
                valores: {}
            });
        }

        res.render("pages/listarfeedbacks", {
            listaErros: null,
            dadosNotificacao: { titulo: "Sucesso!", mensagem: "feedback excluído com sucesso.", tipo: "success" },
            valores: {}
        });
    } catch (e) {
        console.log(e);
        res.render("pages/listarfeedbacks", {
            listaErros: [{ msg: 'Erro ao excluir o feedback.' }],
            dadosNotificacao: null,
            valores: {}
        });
    }
}

};

module.exports = feedbackController;