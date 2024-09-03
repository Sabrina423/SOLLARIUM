const profissional = require("../models/profissionaisModel");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(12);
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const profissionaisController = {
    regrasValidacaoFormLogin: [
        body("nome_usu")
            .isLength({ min: 8, max: 45 })
            .withMessage("O nome de usuário/e-mail deve ter de 8 a 45 caracteres"),
        body("senha_usu")
            .isStrongPassword()
            .withMessage("A senha deve ter no mínimo 8 caracteres")
    ],

    regrasValidacaoFormCad: [
        body("nome_prof")
            .isLength({ min: 3, max: 45 }).withMessage("Nome deve ter de 3 a 45 caracteres!"),
        body("email_prof")
            .isEmail().withMessage("Digite um e-mail válido!")
            .custom(async value => {
                const profissionalExistente = await cliente.findById(value); // Ajustado para verificar no modelo correto
                if (profissionalExistente) {
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
        body("email_prof")
            .isEmail().withMessage("Digite um e-mail válido!"),
        body("telefone_prof")
            .isLength({ min: 12, max: 13 }).withMessage("Digite um telefone válido!"),
        body("senha_prof")
            .isLength({ min: 8, max: 45 }).withMessage("Nome de usuário deve ter de 8 a 45 caracteres!"),
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
        console.log("profissionaisController")
        const erros = validationResult(req);
        if (!erros.isEmpty()) {
            console.log(erros);
            return res.render("pages/cadastroprof", { listaErros: erros, dadosNotificacao: null, valores: req.body });
        }

        // const dadosForm = {
        //     NOME_PROF: req.body.nome + " " +req.body.sobrenome, 
        //     CONTATO_PROF: bcrypt.hashSync(req.body.phone, salt),
        //     EMAIL_PROF: req.body.email,
        //     ENDERECO_PROF: req.body.estado,
        //     CPF_PROF: req.body.cpf,
        //     DATA_PROF: req.body.estado_cliente,
        //     DOCUMENTO_PROF: req.body.curriculo,
        //     CEP_PROF: req.body.cep,
        //     SENHA_PROF: req.body.estado_cliente
        // };

        const dadosForm = { 
            nome_prof: req.body.nome_prof, 
            telefone_prof: req.body.telefone_prof,
            cpf_prof: req.body.cpf_prof,
            email_prof: req.body.email_prof,
            hashedsenha: bcrypt.hashSync(req.body.senha_prof, salt)
        } ;
        console.log(dadosForm);
        try {
            await profissional.create(dadosForm); // Correto método de criação
            res.render("pages/cadastroprof", {
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

module.exports = profissionaisController;
