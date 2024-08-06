const pool = require('../../config/pool_conexoes'); // Caminho relativo correto

const ClienteModel = {
    findAll: async () => {
        try {
            const [linhas] = await pool.query('SELECT * FROM CLIENTE');
            return linhas;
        } catch (error) {
            console.error('Erro ao buscar clientes:', error);
            throw error;
        }
    },

    findById: async (id) => {
        try {
            const [linhas] = await pool.query('SELECT * FROM CLIENTE WHERE ID_CLIENTE = ?', [id_cliente]);
            return 
            
    inhas[0];
        } catch (error) {
            console.error('Erro ao buscar cliente por ID:', error);
            throw error;
        }
    },

    create: async (cliente) => {
        try {
            const { cpf_cliente, endereco_cliente, nome_cliente, contato_cliente, email_cliente } = cliente;
            const result = await pool.query(
                'INSERT INTO CLIENTE (CPF_CLIENTE, ENDERECO_CLIENTE, NOME_CLIENTE, CONTATO_CLIENTE, EMAIL_CLIENTE) VALUES (?, ?, ?, ?, ?)',
                [cpf_cliente, endereco_cliente, nome_cliente, contato_cliente, email_cliente]
            );
            return result;
        } catch (error) {
            console.error('Erro ao criar cliente:', error);
            throw error;
        }
    },

    update: async (id, cliente) => {
        try {
            const { cpf_cliente, endereco_cliente, nome_cliente, contato_cliente, email_cliente } = cliente;
            const result = await pool.query(
                'UPDATE CLIENTE SET CPF_CLIENTE = ?, ENDERECO_CLIENTE = ?, NOME_CLIENTE = ?, CONTATO_CLIENTE = ?, EMAIL_CLIENTE = ? WHERE ID_CLIENTE = ?',
                [cpf_cliente, endereco_cliente, nome_cliente, contato_cliente, email_cliente, id]
            );
            return result;
        } catch (error) {
            console.error('Erro ao atualizar cliente:', error);
            throw error;
        }
    },

    delete: async (id) => {
        try {
            const result = await pool.query('DELETE FROM CLIENTE WHERE ID_CLIENTE = ?', [id]);
            return result;
        } catch (error) {
            console.error('Erro ao deletar cliente:', error);
            throw error;
        }
    }
};

module.exports = ClienteModel;
