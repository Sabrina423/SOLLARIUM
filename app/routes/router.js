const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../database');
const router = express.Router();

const secretKey = 'your-secret-key';

// autenticação
const authenticateToken = (req, res, next) => {
    const token = req.session.token;
    if (!token) return res.redirect('/');

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.redirect('/');
        req.user = user;
        next();
    });
};

router.get('/', (req, res) => {
    res.render('pages/home');
});

router.get('/soucliente', (req, res) => {
    res.render('pages/soucliente');
});

router.get('/souprofissional', (req, res) => {
    res.render('pages/souprofissional');
});

router.get('/cadastroprof', (req, res) => {
    res.render('pages/cadastroprof');
});

router.get('/cadastrocliente', (req, res) => {
    res.render('pages/cadastrocliente');
});

router.get('/orcamento', (req, res) => {
    res.render('pages/orcamento');
});

// Registro
router.post('/cadastrocliente', [
    body('username').isString().withMessage('Username deve ser uma string'),
    body('password').isLength({ min: 6 }).withMessage('Password deve ter no mínimo 6 caracteres')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err) => {
        if (err) {
            return res.status(400).send('Erro ao registrar usuário. Usuário já existe.');
        }
        res.send('Usuário registrado com sucesso.');
    });
});

// Login
router.post('/login', [
    body('username').isString().withMessage('Username deve ser uma string'),
    body('password').isLength({ min: 6 }).withMessage('Password deve ter no mínimo 6 caracteres')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err || results.length === 0) {
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

router.get('/perfilcliente', authenticateToken, (req, res) => {
    res.render('pages/perfilcliente');
});

router.get('/soucliente', (req, res) => {
  res.render('pages/soucliente');
});


module.exports = router;
