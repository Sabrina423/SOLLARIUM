const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const clienteController = require('../controllers/clienteController');

const {
    verificarUsuAutenticado,
    limparSessao,
    gravarUsuAutenticado,
    verificarUsuAutorizado,
  } = require("../models/autenticador_middleware");

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
    res.render('pages/entrar');
});

router.get('/cadastrocliente', (req, res) => {
    res.render('pages/cadastrocliente');
});

router.get('/cadastroprof', (req, res) => {
    res.render('pages/cadastroprof');
});

router.get('/orcamento', (req, res) => {
    res.render('pages/orcamento');
});

router.get('/perfilcliente', authenticateToken, (req, res) => {
    res.render('pages/perfilcliente');
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
router.post('/cadastrocliente', [
    body('username')
        .isString().withMessage('O nome de usuário deve ser uma string')
        .isLength({ min: 3, max: 45 }).withMessage('O nome de usuário deve ter entre 3 e 45 caracteres'),
    body('password')
        .isLength({ min: 8 }).withMessage('A senha deve ter pelo menos 8 caracteres')
        .matches(/[A-Z]/).withMessage('A senha deve conter pelo menos uma letra maiúscula')
        .matches(/[a-z]/).withMessage('A senha deve conter pelo menos uma letra minúscula')
        .matches(/\d/).withMessage('A senha deve conter pelo menos um número')
        .matches(/[@$!%*?&]/).withMessage('A senha deve conter pelo menos um caractere especial'),
    body('cpf')
        .isLength({ min: 11, max: 11 }).withMessage('O CPF deve ter 11 dígitos')
        .isNumeric().withMessage('O CPF deve conter apenas números'),
    body('endereco')
        .isString().withMessage('O endereço deve ser uma string')
        .isLength({ min: 10, max: 100 }).withMessage('O endereço deve ter entre 10 e 100 caracteres'),
    body('contato')
        .isLength({ min: 10, max: 15 }).withMessage('O contato deve ter entre 10 e 15 dígitos')
        .isNumeric().withMessage('O contato deve conter apenas números'),
    body('email')
        .isEmail().withMessage('O e-mail deve ser válido')
        .normalizeEmail()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, cpf, endereco, contato, email } = req.body;
    const hashedPassword = bcrypt.hashSync(password, salt);

    const dadosForm = {
        cpf_cliente: cpf,
        endereco_cliente: endereco,
        nome_cliente: username,
        contato_cliente: contato,
        email_cliente: email
    };

    try {
        await cliente.create(dadosForm);
        res.status(200).json({ message: 'Cadastro realizado com sucesso!' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Erro ao registrar o cliente.' });
    }
});


//Rota de registro profissional
    router.post('/cadastroprof', [
        body('username').isString().withMessage('O nome de usuário deve ser uma string'),
        body('password').isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres')
    ], (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
           // return res.status(400).json({ errors: errors.array() });
        }

    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err) => {
        if (err) {
            console.log(err);
            return res.status(400).send('Erro ao registrar o usuário. O usuário já pode existir.');
        }
        res.send('Usuário registrado com sucesso.');
    });
});

// Rota de Login
router.post('/entrar', [
    body('username').isString().withMessage('O nome de usuário deve ser uma string'),
    body('password').isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err || results.length === 0) {
            console.log(err);
            return res.status(400).send('Usuário não encontrado');
        }

        const user = results[0];
        const isMatch = bcrypt.compareSync(password, user.password);
        if (isMatch) {
            const token = jwt.sign({ username: user.username, id: user.id }, secretKey);
            req.session.token = token;
            res.redirect('/perfilcliente');
        } else {
            res.status(400).send('Senha incorreta');
        }
    });
});

// Rota Protegida do Perfil
router.get('/perfilcliente', authenticateToken, (req, res) => {
    res.render('pages/perfilcliente');
});

router.get('/cadastrocliente', (req, res) => {
    res.render('cadastrocliente');
});


module.exports = router;


