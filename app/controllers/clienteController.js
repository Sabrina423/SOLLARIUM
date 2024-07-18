const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const Cliente = require('../models/modelCliente'); // Certifique-se de que o caminho para o modelo está correto

const router = express.Router();

router.post('/cadastrocliente', [
    body('nome').isString().withMessage('O nome deve ser uma string').notEmpty().withMessage('O nome é obrigatório'),
    body('sobrenome').isString().withMessage('O sobrenome deve ser uma string').notEmpty().withMessage('O sobrenome é obrigatório'),
    body('phone').isMobilePhone().withMessage('Telefone inválido').notEmpty().withMessage('O telefone é obrigatório'),
    body('cpf').isLength({ min: 11, max: 11 }).withMessage('CPF deve ter 11 caracteres').notEmpty().withMessage('O CPF é obrigatório'),
    body('estado').isString().withMessage('O estado deve ser uma string').notEmpty().withMessage('O estado é obrigatório'),
    body('cidade').isString().withMessage('A cidade deve ser uma string').notEmpty().withMessage('A cidade é obrigatória'),
    body('cep').isPostalCode('BR').withMessage('CEP inválido').notEmpty().withMessage('O CEP é obrigatório'),
    body('email').isEmail().withMessage('Email inválido').notEmpty().withMessage('O email é obrigatório'),
    body('senha').isLength({ min: 8 }).withMessage('A senha deve ter pelo menos 8 caracteres').notEmpty().withMessage('A senha é obrigatória'),
    body('confirmar-senha').custom((value, { req }) => {
        if (value !== req.body.senha) {
            throw new Error('As senhas não coincidem');
        }
        return true;
    }).notEmpty().withMessage('A confirmação de senha é obrigatória')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { nome, sobrenome, phone, cpf, estado, cidade, cep, email, senha } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(senha, 10);

        const novoCliente = await Cliente.create({
            nome,
            sobrenome,
            phone,
            cpf,
            estado,
            cidade,
            cep,
            email,
            senha: hashedPassword
        });

        res.status(201).send('Usuário registrado com sucesso.');
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).send('Email ou CPF já está em uso.');
        }
        console.error(err);
        res.status(500).send('Erro ao registrar o usuário.');
    }
});

module.exports = router;
