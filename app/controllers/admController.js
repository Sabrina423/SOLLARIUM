const adm = require("../models/admModel");
const { body, validationResult, Result } = require("express-validator");
const bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(12);
const { removeImg } = require("../util/removeImg");
const fetch = require('node-fetch');
const verificaradmAutorizado = require('../models/verificarAdmAutorizado'); // Corrigido o caminho para o middleware
const https = require('https');

const admController = {
    regrasValidacaoFormLogin: [
        body("email")
            .isLength({ min: 8, max: 100 })
            .withMessage("O nome de usuário/e-mail deve ser válido"),
        body("password")
            .isStrongPassword()
            .withMessage("A senha deve ter no mínimo 8 caracteres")
    ],

    regrasValidacaoFormCad: [
        body("nome_adm")
            .isString({ min: 3, max: 45 }).withMessage("Nome do usuário é obrigatório"),
        body("senha_adm")
            .isLength({ min: 8 }).withMessage('A senha deve conter pelo menos 8 caracteres'),
        body('cpf_adm')
            .isLength({ min: 14, max: 14 }).withMessage('O cpf deve ser válido, contendo 11 dígitos'),
        body('cep_adm')
            .isLength({ min: 9, max: 9 }).withMessage('O cep deve ter entre 9 caracteres'),
        body('contato_adm')
            .isLength({ min: 10, max: 15 }).withMessage('O contato deve ser válido com até 15 caracteres')
            .custom(async value => {
                const admExistente = await adm.findById(value); // Ajustado para verificar no modelo correto
                if (admExistente) {
                    throw new Error('Nome de usuário em uso!');
                }
            }),
        body("email_adm")
            .isEmail().withMessage("Digite um e-mail válido!")
            .custom(async value => {
                const admExistente = await adm.findById(value); // Ajustado para verificar no modelo correto
                if (admExistente) {
                    throw new Error('E-mail em uso!');
                }
            }),
        body("senha_adm")
            .isStrongPassword()
            .withMessage("A senha deve ter no mínimo 8 caracteres")
    ],

    regrasValidacaoPerfil: [
        body("nome_adm")
            .isLength({ min: 3, max: 45 }).withMessage("Mínimo de 3 letras e máximo de 45!"),
        body("nomeusu_adm")
            .isLength({ min: 8, max: 45 }).withMessage("Nome de usuário deve ter de 8 a 45 caracteres!"),
        body("email_adm")
            .isEmail().withMessage("Digite um e-mail válido!"),
        body("fone_adm")
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
            return res.render("pages/cadastroadm", { listaErros: erros, dadosNotificacao: null, valores: req.body });
        }

        const dadosForm = {
            user_adm: req.body.nomeusu_adm,
            senha_adm: bcrypt.hashSync(req.body.senha_adm, salt),
            nome_adm: req.body.nome_adm,
            email_adm: req.body.email_adm,
            estado_adm: req.body.estado_adm,
            cep_adm: req.body.cep_adm,
            contato_adm: req.body.contato_adm,
            cpf_adm: req.body.cpf_adm
        };

        try {
            await adm.create(dadosForm); // Correto método de criação
            res.render("pages/home", {
                listaErros: null, dadosNotificacao: {
                    titulo: "Cadastro realizado!", mensagem: "Novo usuário criado com sucesso!", tipo: "success"
                }, valores: req.body
            });
        } catch (e) {
            console.log(e);
            res.render("pages/cadastroadm", {
                listaErros: erros, dadosNotificacao: {
                    titulo: "Erro ao cadastrar!", mensagem: "Verifique os valores digitados!", tipo: "error"
                }, valores: req.body
            });
        }
    },

    mostrarPerfil: async (req, res) => {
        try {
            let results = await adm.findId(req.session.autenticado.id);
            let viaCep = { logradouro: "", bairro: "", localidade: "", uf: "" };
            let cep = null;
    
            if (results[0].cep_adm != null) {
                const httpsAgent = new https.Agent({
                    rejectUnauthorized: false,
                });
    
                const response = await fetch(`https://viacep.com.br/ws/${results[0].cep_adm}/json/`, {
                    method: 'GET',
                    agent: httpsAgent
                });
    
                if (!response.ok) {
                    throw new Error(`Failed to fetch CEP data: ${response.statusText}`);
                }
    
                viaCep = await response.json();
                cep = results[0].cep_adm.slice(0, 5) + "-" + results[0].cep_adm.slice(5);
            }
    
            let campos = {
                nome_adm: results[0].nome_adm,
                numero: results[0].numero_adm,
                complemento: results[0].complemento_adm,
                logradouro: viaCep.logradouro,
                bairro: viaCep.bairro,
                localidade: viaCep.localidade,
                uf: viaCep.uf,
                img_perfil_pasta: results[0].img_perfil_pasta,
                img_perfil_banco: results[0].img_perfil_banco != null 
                    ? `data:image/jpeg;base64,${results[0].img_perfil_banco.toString('base64')}`
                    : null,
                nomeadm_adm: results[0].user_adm,
                fone_adm: results[0].fone_adm,
                senha_adm: ""
            };
    
            res.render("pages/perfiladm", {
                listaErros: null,
                dadosNotificacao: null,
                valores: campos
            });
    
        } catch (e) {
            console.error(e);
            res.render("pages/perfiladm", {
                listaErros: [e.message],
                dadosNotificacao: null,
                valores: {
                    img_perfil_banco: "",
                    img_perfil_pasta: "",
                    nome_adm: "",
                    email_adm: "",
                    nomeadm_adm: "",
                    fone_adm: "",
                    senha_adm: "",
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
            lista = !erros.isEmpty() ? erros : { formatter: null, errors: [] };
            if (erroMulter != null) {
                lista.errors.push(erroMulter);
            }
            return res.render("pages/perfiladm", { listaErros: lista, dadosNotificacao: null, valores: req.body })
        }
        try {
            var dadosForm = {
                user_adm: req.body.nomeadm_adm,
                nome_adm: req.body.nome_adm,
                email_adm: req.body.email_adm,
                fone_adm: req.body.fone_adm,
                numero_adm: req.body.numero,
                complemento_adm: req.body.complemento,
                img_perfil_banco: req.session.autenticado.img_perfil_banco,
                img_perfil_pasta: req.session.autenticado.img_perfil_pasta,
            };
            if (req.body.senha_adm != "") {
                dadosForm.senha_adm = bcrypt.hashSync(req.body.senha_adm, salt);
            }
            if (!req.file) {
                console.log("falha no carregamento");
            } else {
                //armazenando o caminho do arquivo salvo na pasta do projeto
                caminhoArquivo = "imagem/perfiladm/" + req.file.filename;
                //se houve alteração de imagem de perfil apaga a imagem anterior
                if (dadosForm.img_perfil_pasta != caminhoArquivo) {
                    removeImg(dadosForm.img_perfil_pasta);
                }
                dadosForm.img_perfil_pasta = caminhoArquivo;
                dadosForm.img_perfil_banco = null;

                // //Armazenando o buffer de dados binários do arquivo
                // dadosForm.img_perfil_banco = req.file.buffer;
                // //Apagando a imagem armazenada na pasta
                // removeImg(dadosForm.img_perfil_pasta)
                // dadosForm.img_perfil_pasta = null;
            }
            let resultUpdate = await adm.update(dadosForm, req.session.autenticado.id);
            if (!resultUpdate.isEmpty) {
                if (resultUpdate.changedRows == 1) {
                    var result = await adm.findId(req.session.autenticado.id);
                    var autenticado = {
                        autenticado: result[0].nome_adm,
                        id: result[0].id_adm,
                        tipo: result[0].id_tipo_adm,
                        img_perfil_banco: result[0].img_perfil_banco != null ? `data:image/jpeg;base64,${result[0].img_perfil_banco.toString('base64')}` : null,
                        img_perfil_pasta: result[0].img_perfil_pasta
                    };
                    req.session.autenticado = autenticado;
                    var campos = {
                        nome_adm: result[0].nome_adm, email_adm: result[0].email_adm,
                        img_perfil_pasta: result[0].img_perfil_pasta, img_perfil_banco: result[0].img_perfil_banco,
                        nomeadm_adm: result[0].user_adm, fone_adm: result[0].fone_adm, senha_adm: ""
                    }
                    res.render("pages/adm", { listaErros: null, dadosNotificacao: { titulo: "Perfil! atualizado com sucesso", mensagem: "Alterações Gravadas", tipo: "success" }, valores: campos });
                } else {
                    res.render("pages/adm", { listaErros: null, dadosNotificacao: { titulo: "Perfil! atualizado com sucesso", mensagem: "Sem alterações", tipo: "success" }, valores: dadosForm });
                }
            }
        } catch (e) {
            console.log(e)
            res.render("pages/adm", { listaErros: erros, dadosNotificacao: { titulo: "Erro ao atualizar o perfil!", mensagem: "verifique os valores digitados!", tipo: "error" }, valores: req.body })
        }
    }
};


module.exports = admController;
