const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var salt = bcrypt.genSaltSync(12);
const clienteController = require('../controllers/clienteController');
const cliente = require("../models/clienteModel");

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
router.post('/cadastrocliente', 
    body('nome_cliente')
        .isString().withMessage('O nome de usuário deve ser uma string')
        .isLength({ min: 3, max: 45 }).withMessage('O nome de usuário deve ter entre 3 e 45 caracteres'),
    body('senha_cliente')
        .isLength({ min: 8 }).withMessage('A senha deve ter pelo menos 8 caracteres')
        .matches(/[A-Z]/).withMessage('A senha deve conter pelo menos uma letra maiúscula')
        .matches(/[a-z]/).withMessage('A senha deve conter pelo menos uma letra minúscula')
        .matches(/\d/).withMessage('A senha deve conter pelo menos um número')
        .matches(/[@$!%*?&]/).withMessage('A senha deve conter pelo menos um caractere especial'),
    body('cpf_cliente')
        .isLength({ min: 11, max: 11 }).withMessage('O CPF deve ter 11 dígitos')
        .isNumeric().withMessage('O CPF deve conter apenas números'),
    body('endereco_cliente')
        .isString().withMessage('O cep deve ser uma string')
        .isLength({ min: 8, max: 8 }).withMessage('O cep deve ter entre 10 e 100 caracteres'),
    body('contato_cliente')
        .isLength({ min: 10, max: 15 }).withMessage('O contato deve ter entre 10 e 15 dígitos')
        .isNumeric().withMessage('O contato deve conter apenas números'),
    body('email_cliente')
        .isEmail().withMessage('O e-mail deve ser válido')
        .normalizeEmail(),
    body('estado_cliente')
, async (req, res) => {
    const errors = validationResult(req);
    console.log(errors)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { nome_cliente, senha_cliente, cpf_cliente, endereco_cliente, contato_cliente, email_cliente } = req.body;
    const hashedPassword = bcrypt.hashSync(senha_cliente, salt);

    const dadosForm = {
        cpf_cliente: cpf_cliente,
        endereco_cliente: endereco_cliente,
        nome_cliente: nome_cliente,
        contato_cliente: contato_cliente,
        email_cliente: email_cliente,
        senha_cliente: senha_cliente,
        endereco_cliente: endereco_cliente,
    };

    try {
        let result = await cliente.create(dadosForm);
        console.log(result);
       // res.status(200).json({ message: 'Cadastro realizado com sucesso!' });
    } catch (e) {
        console.error(e);
       // res.status(500).json({ error: 'Erro ao registrar o cliente.' });
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

    db.query('INSERT INTO users (email_cliente, senha_cliente) VALUES (?, ?)', [username, hashedPassword], (err) => {
        if (err) {
            console.log(err);
            return res.status(400).send('Erro ao registrar o usuário. O usuário já pode existir.');
        }
        res.send('Usuário registrado com sucesso.');
    });

    const dadosForm = {
        cpf_cliente: cpf_cliente,
        endereco_cliente: endereco_cliente,
        nome_cliente: nome_cliente,
        contato_cliente: contato_cliente,
        email_cliente: email_cliente,
        senha_cliente: senha_cliente,
        endereco_cliente: endereco_cliente,
    };

});

// Rota de Login
router.post('/entrar', [
    body('user').isString().withMessage('O nome de usuário deve ser uma string'),
    body('password').isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email_cliente, senha_cliente } = req.body;

    db.query('SELECT * FROM cliente WHERE nome_cliente = ?', [email_cliente], (err, results) => {
        if (err || results.length === 0) {
            console.log(err);
            return res.status(400).send('Usuário não encontrado');
        }
        
        const user = results[0];
        const isMatch = bcrypt.compareSync(senha, senha_cliente);
        if (isMatch) {
            const token = jwt.sign({ email_cliente: email_cliente, id: cliente.id }, secretKey);
            req.session.token = token;
            res.redirect('/entrar');
        } else {
            res.status(400).send('Senha incorreta');
        }
    });
});







module.exports = router;


