const ClienteModel = require('../models/clienteModel');

const ClienteController = {
    getAllClients: async (req, res) => {
        try {
            const clientes = await ClienteModel.findAll();
            res.status(200).json(clientes);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar clientes' });
        }
    },

    getClientById: async (req, res) => {
        try {
            const id = req.params.id;
            const cliente = await ClienteModel.findById(id);
            if (cliente) {
                res.status(200).json(cliente);
            } else {
                res.status(404).json({ error: 'Cliente não encontrado' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar cliente' });
        }
    },

    createClient: async (req, res) => {
        try {
            const cliente = req.body;
            const result = await ClienteModel.create(cliente);
            console.log(result)
    
           // res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao criar cliente' });
        }
    },

    updateClient: async (req, res) => {
        try {
            const id = req.params.id;
            const cliente = req.body;
            const result = await ClienteModel.update(id, cliente);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar cliente' });
        }
    },

    deleteClient: async (req, res) => {
        try {
            const id = req.params.id;
            const result = await ClienteModel.delete(id);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao deletar cliente' });
        }
    }
};

module.exports = ClienteController;
