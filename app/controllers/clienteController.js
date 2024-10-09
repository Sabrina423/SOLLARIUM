const cliente = require("../models/clienteModel");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(12);
const { removeImg } = require("../util/removeImg");
const fetch = require('node-fetch');
const verificarClienteAutorizado = require('../models/verificarClienteAutorizado');
const jwt = require('jsonwebtoken'); // Certifique-se de incluir isso
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
            .isLength({ min: 8 }).withMessage('A senha deve conter pelo menos 8 caracteres'),
        body('cpf_cliente')
            .isLength({ min: 14, max: 14 }).withMessage('Campo obrigatório'),
        body('cep_cliente')
            .isLength({ min: 9, max: 9 }).withMessage('O cep deve ter entre 9 caracteres'),
        body('contato_cliente')
            .isLength({ min: 10, max: 15 }).withMessage('O contato deve ser válido com até 15 caracteres')
            .custom(async value => {
                const clienteExistente = await cliente.findById(value);
                if (clienteExistente) {
                    throw new Error('Nome de usuário em uso!');
                }
            }),

        body("email_cliente")
            .isEmail().withMessage("Digite um e-mail válido!")
            .custom(async value => {
                const clienteExistente = await cliente.findById(value);
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

    logar: (req, res) => {
        const erros = validationResult(req);
        if (!erros.isEmpty()) {
            return res.render("pages/entrar", { listaErros: erros, dadosNotificacao: null });
        }
        if (req.session.autenticado.autenticado != null) {
            res.render('pages/home', { autenticado: req.session.autenticado ,login:req.session.logado}); 
        } else {
            res.render("pages/entrar", { listaErros: null, dadosNotificacao: { titulo: "Falha ao logar!", mensagem: "Usuário e/ou senha inválidos!", tipo: "error" } });
        }
    },

    cadastrar: async (req, res) => {
        const erros = validationResult(req);
        if (!erros.isEmpty()) {
            console.log(erros);
            return res.render("pages/cadastrocliente", { listaErros: erros, dadosNotificacao: null, valores: req.body , autenticado: req.session.autenticado});
        }

        const dadosForm = {
            user_cliente: req.body.nomeusu_cliente,
            senha_cliente: bcrypt.hashSync(req.body.senha_cliente, salt),
            nome_cliente: req.body.nome_cliente,
            email_cliente: req.body.email_cliente,
            estado_cliente: req.body.estado_cliente,
            cep_cliente: req.body.cep_cliente,
            contato_cliente: req.body.contato_cliente,
            cpf_cliente: req.body.cpf_cliente
        };

        try {
            await cliente.create(dadosForm);
            res.render("pages/home", {
                listaErros: null, autenticado: req.session.autenticado, dadosNotificacao: {
                    titulo: "Cadastro realizado!", mensagem: "Novo usuário criado com sucesso!", tipo: "success"
                }, valores: req.body
            });
        } catch (e) {
            console.log(e);
            res.render("pages/cadastrocliente", {
                listaErros: null, autenticado: req.session.autenticado, dadosNotificacao: {
                    titulo: "Erro ao cadastrar!", mensagem: "Verifique os valores digitados!", tipo: "error"
                }, valores: req.body
            });
        }
    },
    validarTokenNovaSenha: async (req, res) => {
        const token = req.query.token;
        console.log(token);
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.render("pages/rec-senha", {
                    listaErros: null,
                    dadosNotificacao: { 
                        titulo: "Link expirado!", 
                        mensagem: "Insira seu e-mail para iniciar o reset de senha.", 
                        tipo: "error" 
                    },
                    valores: req.body
                });
            } else {
                return res.render("pages/resetar-senha", {
                    listaErros: null,
                    autenticado: req.session.autenticado,
                    id_cliente: decoded.userId,
                    dadosNotificacao: null
                });
            }
        });
    },

    resetarSenha: async (req, res) => {
        const erros = validationResult(req);
        console.log(erros);
        if (!erros.isEmpty()) {
            return res.render("pages/resetar-senha", {
                listaErros: erros,
                dadosNotificacao: null,
                valores: req.body,
            });
        }
        try {
            const senha = bcrypt.hashSync(req.body.senha_cliente);
            const resetar = await cliente.update({ senha_cliente: senha }, req.body.id_cliente);
            console.log(resetar);
            res.render("pages/entrar", {
                listaErros: null,
                dadosNotificacao: {
                    titulo: "Perfil alterado",
                    mensagem: "Nova senha registrada",
                    tipo: "success",
                },
            });
        } catch (e) {
            console.log(e);
        }
    },

    mostrarPerfil: async (req, res) => {
        try {
            let results = await cliente.findId(req.session.autenticado.id);
            let viaCep = { logradouro: "", bairro: "", localidade: "", uf: "" };
            let cep = null;

            if (results[0].cep_cliente != null) {
                const httpsAgent = new https.Agent({ rejectUnauthorized: false });
                const response = await fetch(`https://viacep.com.br/ws/${results[0].cep_cliente}/json/`, {
                    method: 'GET',
                    agent: httpsAgent
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch CEP data: ${response.statusText}`);
                }

                viaCep = await response.json();
                cep = results[0].cep_cliente.slice(0, 5) + "-" + results[0].cep_cliente.slice(5);
            }

            let campos = {
                nome_cliente: results[0].nome_cliente,
                numero: results[0].numero_cliente,
                complemento: results[0].complemento_cliente,
                logradouro: viaCep.logradouro,
                bairro: viaCep.bairro,
                localidade: viaCep.localidade,
                uf: viaCep.uf,
                img_perfil_pasta: results[0].img_perfil_pasta,
                img_perfil_banco: results[0].img_perfil_banco != null 
                    ? `data:image/jpeg;base64,${results[0].img_perfil_banco.toString('base64')}`
                    : null,
                nomeCliente_cliente: results[0].user_cliente,
                fone_cliente: results[0].fone_cliente,
                senha_cliente: ""
            };

            res.render("pages/perfilcliente", {
                listaErros: null,
                dadosNotificacao: null,
                valores: campos
            });
        } catch (e) {
            console.error(e);
            res.render("pages/perfilcliente", {
                listaErros: [e.message],
                dadosNotificacao: null,
                valores: {
                    img_perfil_banco: "",
                    img_perfil_pasta: "",
                    nome_cliente: "",
                    email_cliente: "",
                    nomeCliente_cliente: "",
                    fone_cliente: "",
                    senha_cliente: "",
                    numero: "",
                    complemento: "",
                    logradouro: "",
                    bairro: "",
                    localidade: "",
                    uf: ""
                }
            });
        }
    },

    

    gravarPerfil: async (req, res) => {
        const erros = validationResult(req);
        const erroMulter = req.session.erroMulter;
        if (!erros.isEmpty() || erroMulter != null) {
            const lista = !erros.isEmpty() ? erros : { formatter: null, errors: [] };
            if (erroMulter != null) {
                lista.errors.push(erroMulter);
            }
            return res.render("pages/perfilcliente", { listaErros: lista, dadosNotificacao: null, valores: req.body });
        }
        try {
            var dadosForm = {
                user_cliente: req.body.nomeCliente_cliente,
                nome_cliente: req.body.nome_cliente,
                email_cliente: req.body.email_cliente,
                fone_cliente: req.body.fone_cliente,
                numero_cliente: req.body.numero,
                complemento_cliente: req.body.complemento,
                img_perfil_banco: req.session.autenticado.img_perfil_banco,
                img_perfil_pasta: req.session.autenticado.img_perfil_pasta,
            };
            if (req.body.senha_cliente != "") {
                dadosForm.senha_cliente = bcrypt.hashSync(req.body.senha_cliente, salt);
            }
            if (!req.file) {
                console.log("falha no carregamento");
            } else {
                const caminhoArquivo = "imagem/perfilcliente/" + req.file.filename;
                if (dadosForm.img_perfil_pasta != caminhoArquivo) {
                    removeImg(dadosForm.img_perfil_pasta);
                }
                dadosForm.img_perfil_pasta = caminhoArquivo;
                dadosForm.img_perfil_banco = null;
            }
            let resultUpdate = await cliente.update(dadosForm, req.session.autenticado.id);
            if (!resultUpdate.isEmpty) {
                if (resultUpdate.changedRows == 1) {
                    var result = await cliente.findId(req.session.autenticado.id);
                    var autenticado = {
                        autenticado: result[0].nome_cliente,
                        id: result[0].id_cliente,
                        tipo: result[0].id_tipo_cliente,
                        img_perfil_banco: result[0].img_perfil_banco != null ? `data:image/jpeg;base64,${result[0].img_perfil_banco.toString('base64')}` : null,
                        img_perfil_pasta: result[0].img_perfil_pasta
                    };
                    req.session.autenticado = autenticado;
                    var campos = {
                        nome_cliente: result[0].nome_cliente,
                        email_cliente: result[0].email_cliente,
                        img_perfil_pasta: result[0].img_perfil_pasta,
                        img_perfil_banco: result[0].img_perfil_banco,
                        nomeCliente_cliente: result[0].user_cliente,
                        fone_cliente: result[0].fone_cliente,
                        senha_cliente: ""
                    };
                    res.render("pages/perfilcliente", { listaErros: null, dadosNotificacao: { titulo: "Perfil! atualizado com sucesso", mensagem: "Alterações Gravadas", tipo: "success" }, valores: campos });
                } else {
                    res.render("pages/perfilcliente", { listaErros: null, dadosNotificacao: { titulo: "Perfil! atualizado com sucesso", mensagem: "Sem alterações", tipo: "success" }, valores: dadosForm });
                }
            }
        } catch (e) {
            console.log(e);
            res.render("pages/perfilcliente", { listaErros: erros, dadosNotificacao: { titulo: "Erro ao atualizar o perfil!", mensagem: "verifique os valores digitados!", tipo: "error" }, valores: req.body });
        }
    }
};

module.exports = clienteController;
