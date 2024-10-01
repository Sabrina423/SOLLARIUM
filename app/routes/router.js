const express = require("express");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer'); // Importar o nodemailer
require('dotenv').config(); // Carregar variáveis de ambiente

const clienteController = require('../controllers/clienteController.js');
const profissionaisController = require('../controllers/profissionaisController.js');
const admController = require('../controllers/admController.js');
const cliente = require("../models/clienteModel");
const profissional = require("../models/profissionaisModel");
const adm = require("../models/admModel");
const relatorioController = require("../controllers/relatorioController");
const uploadFile = require("../util/uploader.js")("./app/public/imagem/perfil");

const {
    verificarClienteAutenticado,
    verificarClienteAutorizado
} = require("../models/autenticadormiddleware.js");

const router = express.Router();

require('dotenv').config(); // Carregar variáveis de ambiente

console.log("Chave Secreta:", process.env.JWT_SECRET); // Debug

const secretKey = process.env.JWT_SECRET || 'default_secret_key'; // Usar chave padrão

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
router.get('/', verificarClienteAutenticado, (req, res) => {
    res.render('pages/home', { autenticado: req.session.autenticado });
});

router.get('/entrar', (req, res) => {
    res.render('pages/entrar', { dadosNotificacao: null });
});

router.get('/cadastrocliente', (req, res) => {
    res.render('pages/cadastrocliente');
});

router.get('/cadastroinicial', (req, res) => {
    res.render('pages/cadastroinicial');
});

router.get('/relatorio', (req, res) => {
    res.render('pages/relatorio');
});

router.get('/sobre', (req, res) => {
    res.render('pages/sobre');
});

router.get('/perfilcliente', authenticateToken, (req, res) => {
    clienteController.mostrarPerfil(req, res);
});

router.get('/cadastroprof', (req, res) => {
    res.render('pages/cadastroprof');
});

// Rota para recuperação de senha
router.get('/recsenha', (req, res) => {
    res.render('pages/recsenha');
});

router.get('/resetarsenha', (req, res) => {
    res.render('pages/resetarsenha');
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

router.get('/adm', authenticateToken, (req, res) => {
    res.render('pages/adm');
});









//Rota de registro cliente
router.post (
    "/perfilcliente",
    uploadFile("imagem-perfil_cliente"),
    clienteController.regrasValidacaoPerfil,
    verificarClienteAutorizado( [1, 2, 3], "pages/cadastrocliente"),
    async function (req, res) {
        clienteController.gravarperfil(req, res);
    });

// Rota de registro cliente
router.post("/cadastrocliente", clienteController.regrasValidacaoFormCad, async (req, res) => {
    clienteController.cadastrar(req, res);
});

// Rota de registro profissional
router.post("/cadastroprof", profissionaisController.regrasValidacaoFormCad, async (req, res) => {
    profissionaisController.cadastrar(req, res);
});

// Rota de registro admin
router.post("/adm", admController.regrasValidacaoFormCad, async (req, res) => {
    admController.cadastrar(req, res);
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



//rota de registro do relatório 

router.get("/",  function (req, res) {
    relatorioController.listarrelatorioPaginadas(req, res);
 });
 
 router.get("/editar", function (req, res) {
   relatorioController.exibirTarefaId(req, res);
 });
 
 router.get("/excluir", function (req, res) {
   relatorioController.excluirTarefa(req, res);
 });
 
 router.get("/finalizar", function (req, res) {
   relatorioController.finalizarTarefa(req, res);
 });
 
 router.get("/iniciar", function (req, res) {
   relatorioController.iniciarTarefa(req, res);
 });
 
 router.get("/adicionar", function (req, res) {
   res.locals.moment = moment;
   res.render("pages/adicionar", { dados: null, listaErros: null });
 });
 
 router.post("/adicionar", relatorioController.regrasValidacao, function (req, res) {
     relatorioController.adicionarTarefa(req, res);
   }
 );
 
module.exports = router;
