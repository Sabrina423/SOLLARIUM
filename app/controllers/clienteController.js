const cliente = require("../models/clienteModel");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(12);
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const verificarClienteAutorizado = require('../models/verificarClienteAutorizado'); // Corrigido o caminho para o middleware

const clienteController = {
    regrasValidacaoFormLogin: [
        body("nome_usu")
            .isLength({ min: 8, max: 45 })
            .withMessage("O nome de usuário/e-mail deve ter de 8 a 45 caracteres"),
        body("senha_usu")
            .isStrongPassword()
            .withMessage("A senha deve ter no mínimo 8 caracteres")
    ],

    regrasValidacaoFormCad: [
        body("nome_usu")
            .isLength({ min: 3, max: 45 }).withMessage("Nome deve ter de 3 a 45 caracteres!"),
        body("nomeusu_usu")
            .isLength({ min: 8, max: 45 }).withMessage("Nome de usuário deve ter de 8 a 45 caracteres! Incluindo uma letra maiúscula, um caractere especial e um número ")
            .custom(async value => {
                const clienteExistente = await cliente.findById(value); // Ajustado para verificar no modelo correto
                if (clienteExistente) {
                    throw new Error('Nome de usuário em uso!');
                }
            }),
        body("email_cliente")
            .isEmail().withMessage("Digite um e-mail válido!")
            .custom(async value => {
                const clienteExistente = await cliente.findById(value); // Ajustado para verificar no modelo correto
                if (clienteExistente) {
                    throw new Error('E-mail em uso!');
                }
            }),
        body("senha_cliente")
            .isStrongPassword()
            .withMessage("A senha deve ter no mínimo 8 caracteres")
    ],

    regrasValidacaoPerfil: [
        body("nome_cliente")
            .isLength({ min: 3, max: 45 }).withMessage("Mínimo de 3 letras e máximo de 45!"),
        body("nomeusu_cliente")
            .isLength({ min: 8, max: 45 }).withMessage("Nome de usuário deve ter de 8 a 45 caracteres!"),
        body("email_cliente")
            .isEmail().withMessage("Digite um e-mail válido!"),
        body("fone_cliente")
            .isLength({ min: 12, max: 13 }).withMessage("Digite um telefone válido!"),
        verificarClienteAutorizado([1, 2, 3], "pages/cadastrocliente"),
    ],

    logar: (req, res) => {
        const erros = validationResult(req);
        if (!erros.isEmpty()) {
            return res.render("pages/entrar", { listaErros: erros, dadosNotificacao: null });
        }
        if (req.session.autenticado.autenticado != null) {
            res.redirect("/");
        } else {
            res.render("pages/entrar", { listaErros: null, dadosNotificacao: { titulo: "Falha ao logar!", mensagem: "Usuário e/ou senha inválidos!", tipo: "error" } });
        }
    },

    cadastrar: async (req, res) => {
        const erros = validationResult(req);
        if (!erros.isEmpty()) {
            return res.render("pages/cadastrocliente", { listaErros: erros, dadosNotificacao: null, valores: req.body });
        }

        const dadosForm = {
            user_cliente: req.body.nomeusu_cliente, 
            senha_cliente: bcrypt.hashSync(req.body.senha_cliente, salt),
            nome_cliente: req.body.nome_cliente,
            email_cliente: req.body.email_cliente,
        };

        try {
            await cliente.create(dadosForm); // Correto método de criação
            res.render("pages/cadastrocliente", {
                listaErros: null, dadosNotificacao: {
                  titulo: "Cadastro realizado!", mensagem: "Novo usuário criado com sucesso!", tipo: "success"
                }, valores: req.body
            });
        } catch (e) {
            console.log(e);
            res.render("pages/cadastrocliente", {
                listaErros: erros, dadosNotificacao: {
                    titulo: "Erro ao cadastrar!", mensagem: "Verifique os valores digitados!", tipo: "error"
                }, valores: req.body
            });
        }
    }
};

module.exports = clienteController;
