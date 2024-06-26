const usuario = require("../models/clienteModel.ejs");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(12);
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const https = require('https');

const usuarioController = {

    regrasValidacaoFormLogin: [
        body("nome_usu")
            .isLength({ min: 8, max: 45 })
            .withMessage("O nome de usuário/e-mail deve ter de 8 a 45 caracteres"),
        body("senha_usu")
            .isStrongPassword()
            .withMessage("A senha deve ter no mínimo 8 caracteres (mínimo 1 letra maiúscula, 1 caractere especial e 1 número)")
    ],

    regrasValidacaoFormCad: [
        body("nome_usu")
            .isLength({ min: 3, max: 45 }).withMessage("Nome deve ter de 3 a 45 caracteres!"),
        body("nomeusu_usu")
            .isLength({ min: 8, max: 45 }).withMessage("Nome de usuário deve ter de 8 a 45 caracteres!")
            .custom(async value => {
                const anomeUsu = await usuario.findCampoCustom({'user_usuario':value});
                if (nomeUsu > 0) {
                  throw new Error('Nome de usuário em uso!');
                }
              }),  
        body("email_usu")
            .isEmail().withMessage("Digite um e-mail válido!")
            .custom(async value => {
                const nomeUsu = await usuario.findCampoCustom({'email_usuario':value});
                if (nomeUsu > 0) {
                  throw new Error('E-mail em uso!');
                }
              }), 
        body("senha_usu")
            .isStrongPassword()
            .withMessage("A senha deve ter no mínimo 8 caracteres (mínimo 1 letra maiúscula, 1 caractere especial e 1 número)")
    ],


    regrasValidacaoPerfil: [
        body("nome_usu")
            .isLength({ min: 3, max: 45 }).withMessage("Mínimo de 3 letras e máximo de 45!"),
        body("nomeusu_usu")
            .isLength({ min: 8, max: 45 }).withMessage("Nome de usuário deve ter de 8 a 45 caracteres!"),
        body("email_usu")
            .isEmail().withMessage("Digite um e-mail válido!"),
        body("fone_usu")
            .isLength({ min: 12, max: 13 }).withMessage("Digite um telefone válido!"),
        verificarUsuAutorizado([1, 2, 3], "pages/restrito"),
    ],

    logar: (req, res) => {
        const erros = validationResult(req);
        if (!erros.isEmpty()) {
            return res.render("pages/login", { listaErros: erros, dadosNotificacao: null  })
        }
        if (req.session.autenticado.autenticado != null) {
            res.redirect("/");
        } else {
            res.render("pages/login", { listaErros: null,
                 dadosNotificacao: { titulo: "Falha ao logar!", mensagem: "Usuário e/ou senha inválidos!", tipo: "error" } })
        }
    },


    cadastrar: (req, res) => {
        const erros = validationResult(req);
        var dadosForm = {
            user_usuario: req.body.nomeusu_usu, 
            senha_usuario: bcrypt.hashSync(req.body.senha_usu, salt),
            nome_usuario: req.body.nome_usu,
            email_usuario: req.body.email_usu,
        };
        if (!erros.isEmpty()) {
            return res.render("pages/cadastro", { listaErros: erros, dadosNotificacao: null, valores: req.body })
        }
        try {
            let create = usuario.create(dadosForm);
            res.render("pages/cadastro", {
                listaErros: null, dadosNotificacao: {
                  titulo: "Cadastro realizado!", mensagem: "Novo usuário criado com sucesso!", tipo: "success"
                }, valores: req.body
              })
        } catch (e) {
            console.log(e);
            res.render("pages/cadastro", {
                listaErros: erros, dadosNotificacao: {
                    titulo: "Erro ao cadastrar!", mensagem: "Verifique os valores digitados!", tipo: "error"
                }, valores: req.body
            })
        }
    }

}

module.exports = usuarioController