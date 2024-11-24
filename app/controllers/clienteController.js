const clienteModel = require("../models/clienteModel");
const profissionaisModel = require("../models/profissionaisModel");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(12);
const { removeImg } = require("../util/removeImg");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const verificarClienteAutorizado = require('../models/verificarClienteAutorizado');
const jwt = require('jsonwebtoken');
const https = require('https');
const tipoClienteModel = require("../models/tipoClienteModel");
const { enviarEmail } = require("../util/email");

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
            .isLength({ min: 11, max: 14 }).withMessage('Campo obrigatório'),
            body('cep_cliente')
            .isLength({ min: 9, max: 9 }).withMessage('O cep deve ter entre 9 caracteres'),
        body('contato_cliente')
            .isLength({ min: 10, max: 15 }).withMessage('O contato deve ser válido com até 15 caracteres'),
        body("email_cliente")
            .isEmail().withMessage("Digite um e-mail válido!")
            .custom(async value => {
                const clienteExistente = await clienteModel.findByEmail(value);
                console.log(clienteExistente.lengtht)
                if (clienteExistente.lenght != undefined) {
                    throw new Error('E-mail em uso!');
                }
            }),

        body("senha_cliente")
            .isStrongPassword()
            .withMessage("A senha deve ter no mínimo 8 caracteres"),
        body("confirmarsenha_cliente")
            .custom((value, { req }) => value === req.body.senha_cliente)
            .withMessage("As senhas não coincidem")

    ],


    regrasValidacaoPerfil: [
        body("nome")
            .isLength({ min: 3, max: 45 }).withMessage("Mínimo de 3 letras e máximo de 45!"),
        body("email")
            .isEmail().withMessage("Digite um e-mail válido!"),
        body('cep')
            .isLength({ min: 9, max: 9 }).withMessage('O cep deve ter entre 9 caracteres'),
        body("fone")
            .isLength({ min: 12, max: 15 }).withMessage("Digite um telefone válido!"),
        body("complemento")
            .isLength().withMessage("Digite um complemento!"),
        body("numero")
            .isLength().withMessage("Digite o numero de sua residência!"),


    ],
    regrasValidacaoFormRecSenha: [

        body("email")
            .isEmail().withMessage("Digite um e-mail válido!"),

    ],

    logar: (req, res) => {
        const erros = validationResult(req);
        if (!erros.isEmpty()) {
            return res.render("pages/entrar", { listaErros: erros, dadosNotificacao: null });
        }
        if (req.session.autenticado && req.session.autenticado.autenticado != null) {
            res.render('pages/home', { autenticado: req.session.autenticado, carrinho: null, login: req.session.logado });
        } else {
            res.render("pages/entrar", { listaErros: null, dadosNotificacao: { titulo: "Falha ao logar!", mensagem: "Usuário e/ou senha inválidos!", tipo: "error" } });
        }
    },

    cadastrar: async (req, res) => {
        const erros = validationResult(req);
        console.log(req.body);
        if (!erros.isEmpty()) {
            console.log(erros);
            return res.render("pages/cadastrocliente", { listaErros: erros, dadosNotificacao: null, valores: req.body, autenticado: req.session.autenticado });
        }

        const dadosForm = {
            user_cliente: req.body.nomeusu_cliente,
            senha_cliente: bcrypt.hashSync(req.body.senha_cliente, salt),
            nome_cliente: req.body.nome_cliente,
            email_cliente: req.body.email_cliente,
            cep_cliente:req.body.cep_cliente,
            estado_cliente: req.body.estado_cliente,
            contato_cliente: req.body.contato_cliente,
            cpf_cliente: req.body.cpf_cliente
        };

        try {
            await clienteModel.create(dadosForm);
            res.render("pages/home", {
                listaErros: null, carrinho: null, autenticado: req.session.autenticado, dadosNotificacao: {
                    titulo: "Cadastro realizado!", mensagem: "Novo usuário criado com sucesso!", tipo: "success"
                }, valores: req.body
            });
        } catch (e) {
            console.log(e);
            res.render("pages/cadastrocliente", {
                listaErros: null, carrinho: null, autenticado: req.session.autenticado, dadosNotificacao: {
                    titulo: "Erro ao cadastrar!", mensagem: "Verifique os valores digitados!", tipo: "error"
                }, valores: req.body
            });
        }
    },

    // Additional methods...

    mostrarPerfil: async (req, res) => {
        try {
            if (req.session.autenticado.tipo == 1) {
                var results = await clienteModel.findById(req.session.autenticado.id);

                if (results[0].cep_cliente != null) {
                    const httpsAgent = new https.Agent({ rejectUnauthorized: false, });

                    const response = await fetch(`https://viacep.com.br/ws/${results[0].CEP_CLIENTE}/json/`, {
                        method: 'GET', headers: null, body: null, agent: httpsAgent
                    });
                    viaCep = await response.json();
                    cep = results[0].CEP_CLIENTE.slice(0, 5) + "-" + results[0].CEP_CLIENTE.slice(5);
                } else {
                    var viaCep = { logradouro: "", bairro: "", localidade: "", uf: "", }
                    var cep = null;
                }

                var campos = {
                    nome: results[0].NOME_CLIENTE,
                    numero: results[0].NUMERO_CASA_CLIENTE,
                    cep: cep,
                    complemento: results[0].COMPLEMENTO_CLIENTE,
                    bairro: viaCep.bairro, localidade: viaCep.localidade, uf: viaCep.uf,
                    img_perfil_banco: results[0].IMAGEM_PERFIL_CLIENTE != null
                        ? `data:image/jpeg;base64,${results[0].IMAGEM_PERFIL_CLIENTE.toString('base64')}` : null,
                    fone: results[0].CONTATO_CLIENTE,
                    email: results[0].EMAIL_CLIENTE

                }
                console.log(campos)
                res.render("pages/perfilcliente", { autenticado: req.session.autenticado, listaErros: null, dadosNotificacao: null, valores: campos })
            } else if (req.session.autenticado.tipo == 2) {
                var results = await profissionaisModel.findById(req.session.autenticado.id);
                console.log(results)
                if (results[0].CEP_PROF != null) {
                    const httpsAgent = new https.Agent({ rejectUnauthorized: false, });

                    const response = await fetch(`https://viacep.com.br/ws/${results[0].CEP_PROF}/json/`, {
                        method: 'GET', headers: null, body: null, agent: httpsAgent
                    });
                    viaCep = await response.json();
                    cep = results[0].CEP_PROF.slice(0, 5) + "-" + results[0].CEP_PROF.slice(5);
                } else {
                    var viaCep = { logradouro: "", bairro: "", localidade: "", uf: "", }
                    var cep = null;
                }

                var campos = {
                    nome: results[0].NOME_PROF,
                    numero: results[0].NUMERO_CASA_PROF,
                    cep: cep,
                    complemento: results[0].COMPLEMENTO_PROF,
                    bairro: viaCep.bairro, localidade: viaCep.localidade, uf: viaCep.uf,
                    img_perfil_banco: results[0].IMAGEM_PERFIL_CLIENTE != null
                        ? `data:image/jpeg;base64,${results[0].IMAGEM_PERFIL_CLIENTE.toString('base64')}` : null,
                    fone: results[0].CONTATO_PROF,
                    email: results[0].EMAIL_PROF


                }
                
           
                
                
           

                console.log(campos)
                res.render("pages/perfilprof", { autenticado: req.session.autenticado, listaErros: null, dadosNotificacao: null, valores: campos })
            }


        } catch (e) {
            console.log(e);
            res.render("pages/perfilcliente", {
                listaErros: null,
                autenticado: req.session.autenticado,
                dadosNotificacao: null,
                valores: {
                    img_perfil_banco: "",
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

    
    recuperarSenha: async (req, res) => {
        const erros = validationResult(req);
        console.log(erros);
        if (!erros.isEmpty()) {
            return res.render("pages/recsenha", {
                listaErros: erros,
                dadosNotificacao: null,
                valores: req.body,
            });
        }
        try {
            //logica do token
            // user = await clienteModel.findUserCustom({
            //    email_cliente: req.body.email,
            // });

            // console.log(user)

            user = await profissionaisModel.findUserCustom({
                email_prof: req.body.email,
            });

            console.log(user)

            const token = jwt.sign(
                { userId: user[0].ID_CLIENTE, expiresIn: "40m" },
                process.env.SECRET_KEY
            );
            //enviar e-mail com link usando o token
            html = require("../util/email-reset-senha")(process.env.URL_BASE, token)
            enviarEmail(req.body.email, "Pedido de recuperação de senha", null, html, () => {
                return res.render("/", {
                    listaErros: null,
                    autenticado: req.session.autenticado,
                    dadosNotificacao: {
                        titulo: "Recuperação de senha",
                        mensagem: "Enviamos um e-mail com instruções para resetar sua senha",
                        tipo: "success",
                    },
                });
            });

        } catch (e) {
            console.log(e);
        }
    },

    validarTokenNovaSenha: async (req, res) => {

        const token = req.query.token;
        console.log(token);
        //validar token
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                res.render("pages/recsenha", {
                    listaErros: null,
                    dadosNotificacao: { titulo: "Link expirado!", mensagem: "Insira seu e-mail para iniciar o reset de senha.", tipo: "error", },
                    valores: req.body
                });
            } else {
                res.render("pages/resetarsenha", {
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
            return res.render("pages/resetarsenha", {
                listaErros: erros,
                dadosNotificacao: null,
                valores: req.body,
            });
        }
        try {
            //gravar nova senha
            senha = bcrypt.hashSync(req.body.senha_cliente);
            const resetar = await clienteModel.update({ senha_cliente: senha }, req.body.id_cliente);
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
    // Lógica para gravar o perfil
    gravarPerfil: async (req, res) => {
        const erros = validationResult(req);
        const erroMulter = req.session.erroMulter;

        if (!erros.isEmpty() || erroMulter != null) {
            const lista = !erros.isEmpty() ? erros : { formatter: null, errors: [] };
            if (erroMulter != null) {
                lista.errors.push(erroMulter);
            }
            console.log(lista)
            return res.render("pages/perfilcliente", {
                autenticado: req.session.autenticado,
                listaErros: lista,
                dadosNotificacao: null,
                valores: req.body
            });
        }

        try {
            // Preparando os dados do formulário para atualizar o perfil
            const dadosForm = {
                user_cliente: req.body.nomeCliente_cliente,
                nome_cliente: req.body.nome,
                email_cliente: req.body.email,
                contato_cliente: req.body.fone,
                cep_cliente: req.body.cep.replace("-", ""),
                numero_casa_cliente: req.body.numero,
                complemento_cliente: req.body.complemento,
                img_perfil_cliente: req.session.autenticado.imagem,
            };

            // if (req.body.senha_cliente != "") {
            //     dadosForm.senha_cliente = bcrypt.hashSync(req.body.senha, salt);
            // }

            if (!req.file) {
                console.log("Falha no carregamento");
            } else {
                //Armazenando o caminho do arquivo salvo na pasta do projeto
                caminhoArquivo = "imagem/perfil/" + req.file.filename;
                //Se houve alteração de imagem de perfil apaga a imagem anterior
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
            let resultUpdate = await cliente.update(dadosForm, req.session.autenticado.id);
            if (!resultUpdate.isEmpty) {
                if (resultUpdate.changedRows == 1) {
                    var result = await cliente.findId(req.session.autenticado.id);
                    var Autenticado = {
                        autenticado: result[0].nome_cliente,
                        id: result[0].id_cliente,
                        tipo: result[0].id_tipo_cliente,
                        img_perfil_banco: result[0].img_perfil_banco ? `data:image/jpeg;base64,${result[0].img_perfil_banco.toString('base64')}` : null,
                        img_perfil_pasta: result[0].img_perfil_pasta
                    };
                }
            
                    req.session.autenticado = Autenticado;

                    var campos = {
                        nome: result[0].nome_cliente,
                        email: result[0].email_cliente,
                        img_perfil_pasta: result[0].img_perfil_pasta,
                        img_perfil_banco: result[0].img_perfil_banco,
                        nomeCliente_cliente: result[0].user_cliente,
                        fone: result[0].contato_cliente,
                        cep: result[0].cep_cliente,
                        complemento: result[0].complemento_cliente,
                        numero: result[0].numero_casa_cliente_cliente,
                    };

                    res.render("pages/perfilcliente", {
                        listaErros: null,
                        dadosNotificacao: {
                            titulo: "Perfil atualizado com sucesso",
                            mensagem: "Alterações gravadas",
                            tipo: "success"
                        },
                        valores: campos,
                        autenticado: Autenticado
                    });
                } else {
                    res.render("pages/perfilcliente", {
                        listaErros: null,
                        dadosNotificacao: {
                            titulo: "Perfil atualizado com sucesso",
                            mensagem: "Sem alterações",
                            tipo: "success"
                        },
                        valores: req.body,
                        autenticado: req.session.autenticado
                    });
                }
            } catch (e) {
                console.error("Erro ao atualizar o perfil:", e);
                res.render("pages/perfilcliente", {
                    listaErros: erros,
                    dadosNotificacao: {
                        titulo: "Erro ao atualizar o perfil!",
                        mensagem: "Verifique os valores digitados!",
                        tipo: "error"
                    },
                    valores: req.body,
                    autenticado: req.session.autenticado
                });
            }
        }

};

    module.exports = clienteController;
