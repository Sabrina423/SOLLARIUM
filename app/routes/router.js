const express = require("express");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var salt = bcrypt.genSaltSync(12);
const clienteController = require('../controllers/clienteController');
const profissionalController = require('../controllers/profissionaisController.js');
const cliente = require("../models/clienteModel");

const uploadFile = require("../util/uploader")("./app/public/imagem/perfil");
//const uploadFile = require("../util/uploader")();
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
<<<<<<< HEAD
    res.render('pages/home');
=======
    res.render('pages/home.ejs');
>>>>>>> 7a4b715 (atualização :3)
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
    clienteController.mostrarPerfil(req, res);
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
router.post(
    "/perfilcliente",
    uploadFile("imagem-perfil_cliente"),
    clienteController.regrasValidacaoPerfil,
    verificarClienteAutorizado([1,2,3], "pages/registro"),
    async function (req, res) {
        clienteController.gravarperfil(req, res);
    });


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


