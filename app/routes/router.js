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

router.get('/orcamento', (req, res) => {
    res.render('pages/orcamento');
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

router.post('/recovery', async (req, res) => {
    const email = req.body.email;
    const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Recuperação de Senha',
        text: `Clique no link para redefinir sua senha: https://congenial-barnacle-5gx456xjgv7w249gr-3000.app.github.dev/resetarsenha/${token}`
    };

console.log('Tentando enviar email para:', email);
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Enviar email
try {
    console.log('Tentando enviar email para:', email);
    await transporter.sendMail(mailOptions);
    console.log('Email enviado com sucesso!');
    res.send('Email de recuperação enviado.');
} catch (error) {
    console.error('Erro ao enviar email:', error);
    return res.status(500).send('Erro ao enviar o email.');
}
});






// Rota para a página de redefinição de senha
router.get('/resetarsenha/:token', (req, res) => {
    const token = req.params.token;

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) return res.status(400).send('Token inválido.');
        res.render('resetarsenha', { email: decoded.email });
    });
});

// Rota para processar a nova senha
router.post('/resetarsenha', (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);

    // Substitua pelo seu método de atualização de senha
    db.query('UPDATE CLIENTE SET SENHA_CLIENTE = ? WHERE EMAIL_CLIENTE = ?', [hashedPassword, email], (err, results) => {
        if (err) {
            return res.status(500).send('Erro ao atualizar a senha.');
        }
        res.send('Senha atualizada com sucesso!');
    });
});

// Rota de registro cliente
router.post("/perfilcliente", uploadFile("imagemperfil_cliente"), clienteController.regrasValidacaoPerfil, verificarClienteAutorizado([1, 2, 3], "pages/cadastrocliente"), async (req, res) => {
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
const { gravarClienteAutenticado } = require('../models/autenticadormiddleware'); // ajuste o caminho conforme necessário
router.post("/entrar", clienteController.regrasValidacaoFormLogin, gravarClienteAutenticado, (req, res) => {
    clienteController.logar(req, res);
});

// Exportando o router
module.exports = router;
