const express = require('express');
const { body, validationResult } = require('express-validator');
const app = express();

app.use(express.urlencoded({ extended: false }));

app.post('/perfilcliente', [
    body('username').notEmpty().withMessage('Nome é obrigatório'),
    body('email').isEmail().withMessage('E-mail inválido'),
    body('telefone').notEmpty().withMessage('Telefone é obrigatório'),
    body('password').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorObj = errors.array().reduce((acc, error) => {
            acc[error.param] = error.msg;
            return acc;
        }, {});
        return res.render('cadastrocliente', { errors: errorObj });
    }
   
    res.send('Cadastro realizado com sucesso');
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
