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
const feedbackController = require('../controllers/feedbackController');
const {
    verificarClienteAutenticado,
    verificarClienteAutorizado,
    gravarClienteAutenticado
} = require("../models/autenticadormiddleware.js");

const router = express.Router();

require('dotenv').config(); // Carregar variáveis de ambiente

console.log("Chave Secreta:", process.env.JWT_SECRET); // Debug

const secretKey = process.env.JWT_SECRET || 'site'; // Usar chave padrão

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

router.get('/orcamento', (req, res) => {
    res.render('pages/orcamento');
});

router.get('/recsenha', (req, res) => {
    res.render('pages/recsenha');
});

router.get('/resetarsenha', (req, res) => {
    res.render('pages/resetarsenha');
});

router.get('/perfilprof', (req, res) => {
    res.render('pages/perfilprof');
});

router.get('/relatorio',  (req, res) => {
    res.render('pages/relatorio');
});

router.get('/feedback',  (req, res) => {
    res.render('pages/feedback');
});

router.get('/adm',  (req, res) => {
    res.render('pages/adm');
});
<<<<<<< HEAD

// Mercado Pago
const { MercadoPagoConfig, Preference } = require('Mercadopago');
const { PedidoController } = require("../controllers/PedidoController");


// credenciais
const MercadoPagoCliente = new MercadoPagoConfig({
    accessToken: process.env.acessToken
});

router.post("/createpreference", function (req, res) {
    const preference = new Preference(MercadoPagoCliente);
    console.log(req.body.items);
    preference.create({
        body: {
            items: req.body.items,
            back_urls: {
                "success": process.env.URL_BASE + "/feedback",
                "failure": process.env.URL_BASE + "/feedback",
                "pending": process.env.URL_BASE + "/feedback"
            },
            auto_return: "approved",
        }
    })
    .then((value) => {
        res.json(value);
    })
    .catch(console.log);
});

router.get("/feedback", function (req, res) {
    PedidoController.gravarpedido(req, res);
});

// Rota para recuperação de senha
router.post('/recovery', async (req, res) => {
    const email = req.body.email;

    // Verifica se o e-mail está cadastrado no banco de dados
    pool.query('SELECT * FROM CLIENTE WHERE EMAIL_CLIENTE = ?', [email], async (err, results) => {
        if (err) {
            console.error('Erro ao consultar o banco de dados:', err);
            return res.status(500).send('Erro ao consultar o banco de dados.');
        }

        // Se não encontrar resultados, retorna um erro
        if (results.length === 0) {
            return res.status(404).send('E-mail não cadastrado.');
        }

        // Se o e-mail estiver cadastrado, gera o token
        const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Recuperação de Senha',
            html: `Clique no link para redefinir sua senha: https://congenial-barnacle-5gx456xjgv7w249gr-3000.app.github.dev/resetarsenha/${token}`
        };

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Enviar email
        try {
            await transporter.sendMail(mailOptions);
            console.log('Email enviado com sucesso para:', email);
            res.send('Email de recuperação enviado.');
        } catch (error) {
            console.error('Erro ao enviar email:', error);
            return res.status(500).send('Erro ao enviar o email.');
        }
=======
//Rota de registro cliente
router.post (
    "/perfilcliente",
    uploadFile("imagem-perfil_cliente"),
    clienteController.regrasValidacaoPerfil,
    verificarClienteAutorizado( [1, 2, 3], "pages/cadastrocliente"),
    async function (req, res) {
        clienteController.gravarperfil(req, res);
>>>>>>> ad267de (atualizaaa)
    });
});

// Rota de registro cliente
router.post("/perfilcliente", uploadFile("imagemperfil_cliente"), clienteController.regrasValidacaoPerfil, verificarClienteAutorizado([1, 2, 3], "pages/cadastrocliente"), async (req, res) => {
    clienteController.gravarperfil(req, res);
});

router.post("/cadastrocliente", clienteController.regrasValidacaoFormCad, async (req, res) => {
    clienteController.cadastrar(req, res);
});

// Rota de registro profissional
router.post("/cadastroprofissional", profissionaisController.regrasValidacaoFormCad, async (req, res) => {
    profissionaisController.cadastrar(req, res);
});

// Rota de registro admin
router.post("/adm", admController.regrasValidacaoFormCad, async (req, res) => {
    admController.cadastrar(req, res);
});

// Rota de Login
const { gravarClienteAutenticado } = require('../models/autenticadormiddleware'); // ajuste o caminho conforme necessário
const { pool } = require("../../config/pool_conexoes.js");

router.post("/entrar", clienteController.regrasValidacaoFormLogin, gravarClienteAutenticado, (req, res) => {
    // Presumindo que o login foi bem-sucedido e as informações do usuário estão na req.user
    req.session.autenticado = true; // Define a variável de autenticação na sessão
    req.session.user = req.user; // Opcional: armazena informações do usuário na sessão
    res.redirect('/'); // Redireciona para a página inicial
});

// Exportando o router
module.exports = router;
