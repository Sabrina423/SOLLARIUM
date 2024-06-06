const pool = require("../../config/pool_conexoes");

const ClienteModel = {
    findAll: async () => {
        try {
            const [linhas] = await pool.query('SELECT * FROM CLIENTE');
            return linhas;
        } catch (error) {
            return error;
        }
    },

    findId: async (id) => {
        try {
            const [linhas] = await pool.query('SELECT * FROM CLIENTE WHERE ID_CLIENTE = ?', [id]);
            return linhas;
        } catch (error) {
            return error;
        }
    },

    create: async (dadosForm) => {
        try {
            const [linhas] = await pool.query('INSERT INTO CLIENTE SET ?', [dadosForm]);
            return linhas;
        } catch (error) {
            console.log(error);
            return null;
        }
    },

    update: async (dadosForm, id) => {
        try {
            const [linhas] = await pool.query('UPDATE CLIENTE SET ? WHERE ID_CLIENTE = ?', [dadosForm, id]);
            return linhas;
        } catch (error) {
            return error;
        }
    },

    delete: async (id) => {
        try {
            const [linhas] = await pool.query('DELETE FROM CLIENTE WHERE ID_CLIENTE = ?', [id]);
            return linhas;
        } catch (error) {
            return error;
        }
    }
};

module.exports = ClienteModel;
const ClienteModel = require("../models/ClienteModel");
const { body, validationResult } = require("express-validator");

const ClienteController = {

    regrasValidacao: [
        body("cpf_cliente").isLength({ min: 11, max: 11 }).withMessage("CPF deve conter 11 dígitos!"),
        body("nome_cliente").isLength({ min: 5, max: 45 }).withMessage("Nome deve conter de 5 a 45 letras!"),
        body("contato_cliente").isLength({ min: 14, max: 14 }).withMessage("Contato deve conter 14 dígitos!")
    ],

    listarClientes: async (req, res) => {
        try {
            const results = await ClienteModel.findAll();
            res.render("pages/clientes", { clientes: results });
        } catch (e) {
            console.log(e);
            res.json({ erro: "Falha ao acessar dados" });
        }
    },

    adicionarCliente: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors);
            return res.render("pages/adicionarCliente", { dados: req.body, listaErros: errors });
        }
        const dadosForm = {
            cpf_cliente: req.body.cpf_cliente,
            nome_cliente: req.body.nome_cliente,
            contato_cliente: req.body.contato_cliente,
            endereco_cliente: req.body.endereco_cliente,
            email_cliente: req.body.email_cliente,
        };
        try {
            await ClienteModel.create(dadosForm);
            res.redirect("/clientes");
        } catch (e) {
            console.log(e);
            res.json({ erro: "Falha ao acessar dados" });
        }
    },

    editarCliente: async (req, res) => {
        const { id } = req.query;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors);
            return res.render("pages/editarCliente", { dados: req.body, listaErros: errors });
        }
        const dadosForm = {
            cpf_cliente: req.body.cpf_cliente,
            nome_cliente: req.body.nome_cliente,
            contato_cliente: req.body.contato_cliente,
            endereco_cliente: req.body.endereco_cliente,
            email_cliente: req.body.email_cliente,
        };
        try {
            await ClienteModel.update(dadosForm, id);
            res.redirect("/clientes");
        } catch (e) {
            console.log(e);
            res.json({ erro: "Falha ao acessar dados" });
        }
    },

    excluirCliente: async (req, res) => {
        const { id } = req.query;
        try {
            await ClienteModel.delete(id);
            res.redirect("/clientes");
        } catch (e) {
            console.log(e);
            res.json({ erro: "Falha ao acessar dados" });
        }
    }
};

module.exports = ClienteController;
