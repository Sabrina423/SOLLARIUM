const prof = require("../models/profissionaisModel");
const { body, validationResult, Result } = require("express-validator");
const bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(12);
const { removeImg } = require("../util/removeImg");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const verificarProfAutorizado = require('../models/verificarProfAutorizado'); // Corrigido o caminho para o middleware
const https = require('https');

const profController = {
    regrasValidacaoFormLogin: [
        body("email")
            .isLength({ min: 8, max: 100 })
            .withMessage("O nome de usuário/e-mail deve ser válido"),
        body("password")
            .isStrongPassword()
            .withMessage("A senha deve ter no mínimo 8 caracteres")
    ],

    regrasValidacaoFormCad: [
        body("nome_prof")
            .isString({ min: 3, max: 45 }).withMessage("Nome do usuário é obrigatório"),
        body("senha_prof")
            .isLength({ min: 8 }).withMessage('A senha deve conter pelo menos 8 caracteres'),
        body('cpf_prof')
            .isLength({ min: 14, max: 14 }).withMessage('O cpf deve ser válido, contendo 11 dígitos'),
        body('cep_prof')
            .isLength({ min: 9, max: 9 }).withMessage('O cep deve ter entre 9 caracteres'),
        body('contato_prof')
            .isLength({ min: 10, max: 15 }).withMessage('O contato deve ser válido com até 15 caracteres')
            .custom(async value => {
                const profExistente = await prof.findById(value); // Ajustado para verificar no modelo correto
                if (profExistente) {
                    throw new Error('Nome de usuário em uso!');
                }
            }),
        body("email_prof")
            .isEmail().withMessage("Digite um e-mail válido!")
            .custom(async value => {
                const profExistente = await prof.findById(value); // Ajustado para verificar no modelo correto
                if (profExistente) {
                    throw new Error('E-mail em uso!');
                }
            }),
        body("senha_prof")
            .isStrongPassword()
            .withMessage("A senha deve ter no mínimo 8 caracteres")
    ],

    regrasValidacaoPerfil: [
        body("nome_prof")
            .isLength({ min: 3, max: 45 }).withMessage("Mínimo de 3 letras e máximo de 45!"),
        body("nomeusu_prof")
            .isLength({ min: 8, max: 45 }).withMessage("Nome de usuário deve ter de 8 a 45 caracteres!"),
        body("email_prof")
            .isEmail().withMessage("Digite um e-mail válido!"),
        body("fone_prof")
            .isLength({ min: 12, max: 13 }).withMessage("Digite um telefone válido!"),

    ],

    gravarperfil: [

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
            console.log(erros)
            return res.render("pages/cadastroprof", { listaErros: erros, dadosNotificacao: null, valores: req.body });
        }

        const dadosForm = {
            nome_prof: req.body.nome_prof,
            contato_prof: req.body.contato_prof,
            email_prof: req.body.email_prof,
            cpf_prof: req.body.cpf_prof,
            cep_prof: req.body.cep_prof,
            area_prof: req.body.area_prof,  // Se tiver esse campo no form
            senha_prof: bcrypt.hashSync(req.body.senha_prof, salt)
        };
        

        try {
            await prof.create(dadosForm); // Correto método de criação
            res.render("pages/home", {
                listaErros: null, dadosNotificacao: {
                    titulo: "Cadastro realizado!", mensagem: "Novo usuário criado com sucesso!", tipo: "success"
                }, valores: req.body
            });
        } catch (e) {
            console.log(e);
            res.render("pages/cadastroprof", {
                listaErros: erros, dadosNotificacao: {
                    titulo: "Erro ao cadastrar!", mensagem: "Verifique os valores digitados!", tipo: "error"
                }, valores: req.body
            });
        }
    }
};

mostrarPerfil: async (req, res) => {
    let campos = {
        nome_prof: results[0].nome_prof,
        numero: results[0].numero_prof,
        complemento: results[0].complemento_prof, logradouro: viaCep.logradouro,
        bairro: viaCep.bairro, localidade: viaCep.localidade, uf: viaCep.uf,
        img_perfil_pasta: results[0].img_perfil_pasta,
        img_perfil_banco: results[0].img_perfil_banco != null ? `data:image/jpge;base64,${results[0].img_perfil_banco.toString('base64')}` : null,
        nomeprof_prof: results[0].user_prof, fone_prof: results[0].fone_prof, senha_prof: ""
    }

    res.render("pages/perfilprof", { listaErros: null, dadosNotificacao: null, valores: campos })
    console.log(e);
    res.render("")
}



module.exports = profController;

