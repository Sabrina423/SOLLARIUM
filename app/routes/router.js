const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var salt = bcrypt.genSaltSync(12);
const clienteController = require('../controllers/clienteController');
const profissionalController = require('../controllers/profissionaisController.js');
const cliente = require("../models/clienteModel");

const  {  
    verificarClienteAutenticado,
    limparSessao,
    gravarClienteAutenticado,
    verificarClienteAutorizado,
  } = require("../models/autenticador_middleware.js");

const router = express.Router();

const secretKey = 'your-secret-key'; 

// Middleware de Autenticação
const authenticateToken = (req, res, next) => {
    const token = req.session.token;
    if (!token) return res.redirect('/');

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.redirect('/');
        req.user = user;
        next();
    });
};

// Rotas
router.get('/', (req, res) => {
    res.render('pages/home');
});

router.get('/entrar', (req, res) => {
    res.render('pages/entrar',{dadosNotificacao:null});
});

router.get('/cadastrocliente', (req, res) => {
    res.render('pages/cadastrocliente');
});

router.get('/cadastroinicial', (req, res) => {
    res.render('pages/cadastroinicial');
});

router.get('/orcamento', (req, res) => {
    res.render('pages/orcamento');
});

router.get('/sobre', (req, res) => {
    res.render('pages/sobre');
});

router.get('/perfilcliente', authenticateToken, (req, res) => {
    res.render('pages/perfilcliente');
});

router.get('/cadastroprof', (req, res) => {
    res.render('pages/cadastroprof');
});

router.get('/perfilprof', authenticateToken, (req, res) => {
    res.render('pages/perfilprof');
});

router.get('/relatorio', authenticateToken, (req, res) => {
    res.render('pages/relatorio');
});

router.get('/feedback', authenticateToken, (req, res) => {
    res.render('pages/feedback');
});

//Rota de registro cliente
router.post('/cadastrocliente', 
  clienteController.regrasValidacaoFormCad,
 async (req, res) => {
    
clienteController.cadastrar(req, res);
});
// //Rota de registro cliente
// router.post('/cadastrocliente', 
//     body('nome_cliente')
//         .isString().withMessage('O nome de usuário deve ser uma string')
//         .isLength({ min: 3, max: 45 }).withMessage('O nome de usuário deve ter entre 3 e 45 caracteres'),
//     body('senha_cliente')
//         .isLength({ min: 8 }).withMessage('A senha deve ter pelo menos 8 caracteres')
//         .matches(/[A-Z]/).withMessage('A senha deve conter pelo menos uma letra maiúscula')
//         .matches(/[a-z]/).withMessage('A senha deve conter pelo menos uma letra minúscula')
//         .matches(/\d/).withMessage('A senha deve conter pelo menos um número')
//         .matches(/[@$!%*?&]/).withMessage('A senha deve conter pelo menos um caractere especial'),
//     body('cpf_cliente')
//         .isLength({ min: 14, max: 14 }).withMessage('O CPF deve ter 11 dígitos'),
//     body('cep_cliente')
//         .isLength({ min: 8, max: 8 }).withMessage('O endereço deve ter entre 8 caracteres'),
//     body('contato_cliente')
//         .isLength({ min: 10, max: 15 }).withMessage('O contato deve ter entre 10 e 15 dígitos'),

//     body('email_cliente')
//         .isEmail().withMessage('O e-mail deve ser válido')
//         .normalizeEmail(),
//     body('estado_cliente')
// , async (req, res) => {
//     const errors = validationResult(req);
//     console.log(errors)
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const { nome_cliente, senha_cliente, cpf_cliente, cep_cliente, contato_cliente, email_cliente } = req.body;
//     const hashedPassword = bcrypt.hashSync(senha_cliente, salt);

//     const dadosForm = {
//         cpf_cliente: cpf_cliente,
//         cep_cliente: cep_cliente,
//         nome_cliente: nome_cliente,
//         contato_cliente: contato_cliente, 
//         email_cliente: email_cliente,
//         senha_cliente: senha_cliente,
//     };

//     try {
//         let result = await cliente.create(dadosForm);
//         console.log(result);
//         res.render('pages/home');
//        // res.status(200).json({ message: 'Cadastro realizado com sucesso!' });
//     } catch (e) {
//         console.error(e);
//         res.render("pages/cadastrocliente", {
//             listaErros: erros, dadosNotificacao: {
//                 titulo: "Erro ao cadastrar!", mensagem: "Verifique os valores digitados!", tipo: "error"
//             }, valores: req.body
//         });
//     }
// });




//Rota de registro profissional
    router.post(
        '/cadastroprof', 
        body("nome")
            .isLength({ min: 3, max: 45 }).withMessage("Mínimo de 3 letras e máximo de 45!"),
        body("sobrenome")
            .isLength({ min: 8, max: 45 }).withMessage("Nome de usuário deve ter de 8 a 45 caracteres!"),
        body("email")
            .isEmail().withMessage("Digite um e-mail válido!"),
        body("phone")
            .isLength({ min: 12, max: 13 }).withMessage("Digite um telefone válido!"), 
    (req, res) => {
    

        profissionalController.cadastrar(req, res);
    

    // db.query('INSERT INTO PROFISSIONAL (NOME_PROF,CONTATO_PROF,EMAIL_PROF,CPF_PROF,CEP_PROF,SENHA_PROF) VALUES (?,?,?,?,?,?)', [ nome+ " "+ sobrenome,phone, email,cpf,cep,hashedsenha], (err) => {
    //     if (err) {
    //         console.log(err);
    //         return res.status(400).send('Erro ao registrar o usuário. O usuário já pode existir.');
    //     }
    //     res.send('Usuário registrado com sucesso.');
    // });

    // const dadosForm = {
    //     cpf_cliente: cpf_cliente,
    //     endereco_cliente: endereco_cliente,
    //     nome_cliente: nome_cliente,
    //     contato_cliente: contato_cliente,
    //     email_cliente: email_cliente,
    //     senha_cliente: senha_cliente,
    //     endereco_cliente: endereco_cliente,
    // };

});

// Rota de Login

    router.post(
        "/entrar",
        clienteController.regrasValidacaoFormLogin,
        gravarClienteAutenticado,
        function (req, res) {
          clienteController.logar(req, res);
        }
      );







module.exports = router;


