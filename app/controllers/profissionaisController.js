const prof = require("../models/profissionaisModel");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(12);
const verificarProfAutorizado = require('../models/verificarProfAutorizado'); // Corrigido o caminho para o middleware

const profController = {
    // Regras de validação para login
    regrasValidacaoFormLogin: [
        body("email")
            .isLength({ min: 8, max: 100 })
            .withMessage("O nome de usuário/e-mail deve ser válido"),
        body("password")
            .isStrongPassword()
            .withMessage("A senha deve ter no mínimo 8 caracteres")
    ],

    // Regras de validação para cadastro
    // Regras de validação para cadastro
regrasValidacaoFormCad: [
    body('nome_prof').isLength({ min: 3, max: 45 }).withMessage('Nome deve ter entre 3 e 45 caracteres.'),
    body('cep_prof')
    .isLength({ min: 9, max: 9 }).withMessage('O cep deve ter entre 9 caracteres'),
    // Sanitizar o CPF antes de validar
    body('cpf_prof')
        .isLength({ min: 11, max: 14 }).withMessage('CPF deve ter 11 dígitos.')
        .customSanitizer(value => value.replace(/[^\d]/g, '')) // Remove pontos e traços
        .isNumeric().withMessage('CPF deve conter apenas números.'),
    body('email_prof').isEmail().withMessage('Digite um e-mail válido.'),

    
    body('contato_prof')
        .isLength({ min: 10, max: 15 }).withMessage('Telefone deve ter entre 10 e 11 dígitos.')
        .customSanitizer(value => value.replace(/[^\d]/g, '')) // Remove caracteres não numéricos
        .isNumeric().withMessage('Telefone deve conter apenas números.'),

    // Validação de senha mais forte
    body('senha_prof').custom(value => {
        const senhaValida = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/.test(value);
        if (!senhaValida) {
            throw new Error('A senha deve ter pelo menos 8 caracteres, uma letra maiúscula e um caractere especial.');
        }
        return true;
    }),

    // Corrigindo o nome do campo de confirmação de senha
    body('confirmasenha_prof')
        .custom((value, { req }) => {
            if (value !== req.body.senha_prof) {
                throw new Error('As senhas não coincidem.');
            }
            return true;
        }),

    body('area_prof').isLength({ min: 3, max: 30 }).withMessage('Área de atuação deve ter entre 3 e 30 caracteres.'),
    body('experiencia_prof').notEmpty().withMessage('Este campo é obrigatório.')
],

    // Regras de validação para perfil
    regrasValidacaoPerfil: [
        body("nome_prof")
            .isLength({ min: 3, max: 45 }).withMessage("Mínimo de 3 letras e máximo de 45!"),
        body("nome_prof")
            .isLength({ min: 8, max: 45 }).withMessage("Nome de usuário deve ter de 8 a 45 caracteres!"),
        body("email_prof")
            .isEmail().withMessage("Digite um e-mail válido!"),
        body("contato_prof")
            .isLength({ min: 12, max: 13 }).withMessage("Digite um telefone válido!"),
    ],
     
    // Função de login
    logar: (req, res) => {
        const erros = validationResult(req);
        if (!erros.isEmpty()) {
            return res.render("pages/entrar", { listaErros: erros.array(), dadosNotificacao: null });
        }

        if (req.session.autenticado) {
            res.redirect("/");
        } else {
            res.render("pages/entrar", { listaErros: null, dadosNotificacao: { titulo: "Falha ao logar!", mensagem: "Usuário e/ou senha inválidos!", tipo: "error" } });
        }
    },

    // Função de cadastro
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
            area_prof: req.body.area_prof, // Se tiver esse campo no form
            senha_prof: bcrypt.hashSync(req.body.senha_prof, salt)
        };

        try {
            await prof.create(dadosForm); // Método de criação
            res.render("pages/home", {
                listaErros: null,
                dadosNotificacao: {
                    titulo: "Cadastro realizado!",
                    mensagem: "Novo usuário criado com sucesso!",
                    tipo: "success"
                },
                valores: req.body
            });
        } catch (e) {
            console.error('Erro ao cadastrar:', e);
            res.render("pages/cadastroprof", {
                listaErros: null, // Não use 'erros' aqui, pois já capturamos os erros anteriormente
                dadosNotificacao: {
                    titulo: "Erro ao cadastrar!",
                    mensagem: "Verifique os valores digitados!",
                    tipo: "error"
                },
                valores: req.body
            });
        }
    },

    // Mostrar perfil
    mostrarPerfil: async (req, res) => {
        try {
            const results = await prof.findById(req.session.profissionalId); // Obter ID do profissional da sessão
            if (!results) {
                return res.status(404).render("pages/404", { dadosNotificacao: { titulo: "Perfil não encontrado", mensagem: "Profissional não encontrado.", tipo: "error" } });
            }

            let campos = {
                nome_prof: results.nome_prof,
                numero: results.numero_prof,
                complemento: results.complemento_prof,
                logradouro: results.logradouro, // Verifique se a variável está correta
                bairro: results.bairro,
                localidade: results.localidade,
                uf: results.uf,
                img_perfil_pasta: results.img_perfil_pasta,
                img_perfil_banco: results.img_perfil_banco != null ? `data:image/jpeg;base64,${results.img_perfil_banco.toString('base64')}` : null,
                nomeprof_prof: results.user_prof,
                fone_prof: results.fone_prof,
                senha_prof: ""
            };

            res.render("pages/perfilprof", { listaErros: null, dadosNotificacao: null, valores: campos });
        } catch (error) {
            console.error('Erro ao mostrar perfil:', error);
            res.status(500).render("pages/error", { dadosNotificacao: { titulo: "Erro Interno", mensagem: "Ocorreu um erro ao carregar o perfil.", tipo: "error" } });
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
            return res.render("pages/perfilprof", { listaErros: lista, dadosNotificacao: null, valores: req.body });
        }
        try {
            var dadosForm = {
                user_prof: req.body.nomeprof_prof,
                nome_prof: req.body.nome_prof,
                email_prof: req.body.email_prof,
                fone_prof: req.body.fone_prof,
                cep_prof: req.body.cep.replace("-", ""),
                numero_prof: req.body.numero,
                complemento_prof: req.body.complemento,
                img_perfilprof_banco: req.session.autenticado.img_perfilprof_banco,
                img_perfilprof_pasta: req.session.autenticado.img_perfilprof_pasta,
            };
            if (req.body.senha_prof != "") {
                dadosForm.senha_prof = bcrypt.hashSync(req.body.senha_prof, salt);
            }
            if (!req.file) {
                console.log("falha no carregamento");
            } else {
                const caminhoArquivo = "imagem/perfilprof/" + req.file.filename;
                if (dadosForm.img_perfilprof_pasta != caminhoArquivo) {
                    removeImg(dadosForm.img_perfilprof_pasta);
                }
                dadosForm.img_perfilprof_pasta = caminhoArquivo;
                dadosForm.img_perfilprof_banco = null;
            }
            let resultUpdate = await prof.update(dadosForm, req.session.autenticado.id);
            if (!resultUpdate.isEmpty) {
                if (resultUpdate.changedRows == 1) {
                    var result = await cliente.findId(req.session.autenticado.id);
                    var autenticado = {
                        autenticado: result[0].nome_prof,
                        id: result[0].id_prof,
                        tipo: result[0].id_tipo_prof,
                        img_perfilprof_banco: result[0].img_perfilprof_banco != null ? `data:image/jpeg;base64,${result[0].img_perfilprof_banco.toString('base64')}` : null,
                        img_perfilprof_pasta: result[0].img_perfilprof_pasta
                    };
                    req.session.autenticado = autenticado;
                    var campos = {
                        nome_prof: result[0].nome_prof,
                        email_prof: result[0].email_prof,
                        img_perfilprof_pasta: result[0].img_perfilprof_pasta,
                        img_perfilprof_banco: result[0].img_perfilprof_banco,
                        nomeprof_prof: result[0].user_prof,
                        fone_prof: result[0].fone_prof,
                        senha_prof: ""
                    };
                    res.render("pages/perfilprof", { listaErros: null, dadosNotificacao: { titulo: "Perfil atualizado com sucesso", mensagem: "Alterações gravadas", tipo: "success" }, valores: campos });
                } else {
                    res.render("pages/perfilprof", { listaErros: null, dadosNotificacao: { titulo: "Perfil atualizado com sucesso", mensagem: "Sem alterações", tipo: "success" }, valores: dadosForm });
                }
            }
        } catch (e) {
            console.log(e);
            res.render("pages/perfilprof", { listaErros: erros, dadosNotificacao: { titulo: "Erro ao atualizar o perfil!", mensagem: "Verifique os valores digitados!", tipo: "error" }, valores: req.body });
        }
    }
};




module.exports = profController;
