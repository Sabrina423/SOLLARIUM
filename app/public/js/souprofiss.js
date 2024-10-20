const express = require('express');
const { body, validationResult } = require('express-validator');
const app = express();

app.use(express.urlencoded({ extended: false }));

app.post('/perfilprof', [
    body('email').isEmail().withMessage('E-mail inválido'),
    body('password').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 8 caracteres')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorObj = errors.array().reduce((acc, error) => {
            acc[error.param] = error.msg;
            return acc;
        }, {});
        return res.render('soucliente', { errors: errorObj });
    }

    res.send('Login realizado com sucesso');
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});

