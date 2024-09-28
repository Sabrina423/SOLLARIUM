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
    regrasValidacaoFormCad: [
        body('nome_prof').isLength({ min: 3, max: 45 }).withMessage('Nome deve ter entre 3 e 45 caracteres.'),
        body('cpf_prof').isLength({ min: 11, max: 11 }).withMessage('CPF deve ter 11 dígitos.').isNumeric().withMessage('CPF deve conter apenas números.'),
        body('estado_prof').notEmpty().withMessage('Selecione um estado.'),
        body('email_prof').isEmail().withMessage('Digite um e-mail válido.'),
        body('contato_prof').isLength({ min: 10, max: 11 }).withMessage('Telefone deve ter entre 10 e 11 dígitos.').isNumeric().withMessage('Telefone deve conter apenas números.'),
        body('senha_prof').custom(value => {
            const senhaValida = validatePasswordCriteria(value);
            if (!senhaValida) {
                throw new Error('A senha deve ter pelo menos 8 caracteres, uma letra maiúscula e um caractere especial.');
            }
            return true;
        }),
        body('confimasenha_prof').custom((value, { req }) => {
            if (value !== req.body.senha_prof) {
                throw new Error('As senhas não coincidem.');
            }
            return true;
        }),
        body('area_prof').isLength({ min: 3, max: 30 }).withMessage('Área de atuação deve ter entre 3 e 30 caracteres.'),
        body('experiencia_prof').isNumeric().withMessage('Anos de experiência devem ser um número positivo.').isFloat({ min: 0 }).withMessage('Anos de experiência devem ser um número positivo.')
    ],

    // Regras de validação para perfil
    regrasValidacaoPerfil: [
        body("nome_prof")
            .isLength({ min: 3, max: 45 }).withMessage("Mínimo de 3 letras e máximo de 45!"),
        body("nome_prof")
            .isLength({ min: 8, max: 45 }).withMessage("Nome de usuário deve ter de 8 a 45 caracteres!"),
        body("email_prof")
            .isEmail().withMessage("Digite um e-mail válido!"),
        body("telefone_prof")
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
            return res.render("pages/cadastroprof", { listaErros: erros.array(), dadosNotificacao: null, valores: req.body });
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
    }
};

module.exports = profController;
