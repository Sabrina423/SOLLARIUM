const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');  // Make sure to include this if it's used
const router = express.Router();

const secretKey = 'your-secret-key';

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const token = req.session.token;
    if (!token) return res.redirect('/');

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.redirect('/');
        req.user = user;
        next();
    });
};

// Routes
router.get('/', (req, res) => {
    res.render('pages/home');
});

router.get('/soucliente', (req, res) => {
    res.render('pages/soucliente');
});

router.get('/cadastro_cliente', (req, res) => {
    res.render('pages/cadastro_cliente');
});

router.get('/orcamento', (req, res) => {
    res.render('pages/orcamento');
});

router.get('/perfilcliente', (req, res) => {
    res.render('pages/perfilcliente');
});

// Registration Route
router.post('/cadastrocliente', [
    body('username').isString().withMessage('Username must be a string'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err) => {
        if (err) {
            console.log(err);
            return res.status(400).send('Error registering user. User might already exist.');
        }
        res.send('User registered successfully.');
    });
});

// Login Route
router.post('/login', [
    body('username').isString().withMessage('Username must be a string'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err || results.length === 0) {
            console.log(err);
            return res.status(400).send('User not found');
        }

        const user = results[0];
        const isMatch = bcrypt.compareSync(password, user.password);
        if (isMatch) {
            const token = jwt.sign({ username: user.username, id: user.id }, secretKey);
            req.session.token = token;
            res.redirect('/perfilcliente');
        } else {
            res.status(400).send('Incorrect password');
        }
    });
});

// Protected Profile Route
router.get('/perfilcliente', authenticateToken, (req, res) => {
    res.render('pages/perfilcliente');
});

module.exports = router;
