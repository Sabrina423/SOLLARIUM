const cliente = require("../models/clienteModel");
const { body, validationResult, Result } = require("express-validator");
const bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(12);
const {removeImg} = require("../util/removeImg");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const verificarClienteAutorizado = require('../models/verificarClienteAutorizado'); // Corrigido o caminho para o middleware
const https = require('https');

const clienteController = {
    regrasValidacaoFormLogin: [
        body("email")
            .isLength({ min: 8, max: 100 })
            .withMessage("O nome de usuário/e-mail deve ser válido"),
        body("password")
            .isStrongPassword()
            .withMessage("A senha deve ter no mínimo 8 caracteres")
    ],

    regrasValidacaoFormCad: [
        body("nome_cliente")
            .isString({ min: 3, max: 45 }).withMessage("Nome do usuário é obrigatório"),
        body("senha_cliente")
            .isLength({ min : 8}).withMessage('A senha deve conter pelo menos 8 caracteres'),
        body('cpf_cliente')
            .isLength({ min:14 , max: 14}).withMessage('O cpf deve ser válido, contendo 11 dígitos'),
        body('cep_cliente')
            .isLength({min: 8 , max:8}).withMessage('O cep deve ter entre 8 caracteres'),
        body('telefone_cliente')
            .isLength({min:10 , max:15}).withMessage('O contato deve ser válido')
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
        
    ],

    gravarperfil :[
          
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
            estado_cliente : req.body.estado_cliente,
            cep_cliente : req.body.cep_cliente,
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

mostrarPerfil: async (req, res) => {
    try{
    let campos = {
        nome_cliente: results[0].nome_cliente,
        numero: results[0].numero_cliente,
        complemento: results[0].complemento_cliente, logradouro: viaCep. logradouro,
        bairro: viaCep.bairro, localidade: viaCep.localidade, uf: viaCep.uf,
        img_perfil_pasta: results[0].img_perfil_pasta,
        img_perfil_banco: results[0].img_perfil_banco != null ? `data:image/jpge;base64,${results[0].img_perfil_banco.toString('base64')}`: null,
        nomeCliente_cliente: results[0].user_cliente, fone_cliente: results[0].fone_cliente, senha_cliente: ""
    }

    res.render("pages/perfilcliente", { listaErros: null, dadosNotificacao: null, valores: campos })
    console.log(e);
    res.render("")
}



module.exports = clienteController;

