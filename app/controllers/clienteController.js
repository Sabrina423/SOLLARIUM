const ClienteModel = require('../models/clienteModel');
const { body, validationResult } = require('express-validator');

const ClienteController = {
    listarClientes: async (req, res) => {
        try {
            const clientes = await ClienteModel.findAll();
            res.json(clientes);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao listar clientes' });
        }
    },

    adicionarCliente: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const novoCliente = req.body;
            await ClienteModel.create(novoCliente);
            res.status(201).json({ mensagem: 'Cliente criado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao criar cliente' });
        }
    },

    editarCliente: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const clienteId = req.body.id_cliente;
            const clienteAtualizado = req.body;
            await ClienteModel.update(clienteId, clienteAtualizado);
            res.status(200).json({ mensagem: 'Cliente atualizado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar cliente' });
        }
    },

    excluirCliente: async (req, res) => {
        try {
            const clienteId = req.query.id;
            await ClienteModel.delete(clienteId);
            res.status(200).json({ mensagem: 'Cliente excluído com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao excluir cliente' });
        }
    },

    regrasValidacao: [
        body('cpf_cliente').isLength({ min: 11, max: 11 }).withMessage('CPF deve ter 11 dígitos'),
        body('email_cliente').isEmail().withMessage('Email inválido'),
        body('nome_cliente').notEmpty().withMessage('Nome não pode ser vazio')
    ]
};

module.exports = ClienteController;
