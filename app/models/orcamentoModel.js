const pool = require('../../config/pool_conexoes'); 

const orcamentoModel = {
    findById: async (id) => {
        try {
            const [linhas] = await pool.query('SELECT * FROM ORCAMENTO WHERE ID_ORCAMENTO = ?', [id]);
            return linhas[0];
        } catch (error) {
            console.error('Erro ao buscar orçamento por ID:', error);
            throw error;
        }
    },

    findByEmail: async (id) => {
        try {
            const [linhas] = await pool.query('SELECT * FROM ORCAMENTO WHERE ID_ORCAMENTO = ?', [id]);
            return linhas;
        } catch (error) {
            console.error('Erro ao buscar orçamento por ID:', error);
            throw error;
        }
    },

    create: async (cliente) => {
        try {
            const { cpf_cliente, endereco_cliente, nome_cliente, contato_cliente, email_cliente, senha_cliente, estado_cliente } = cliente;
            const result = await pool.query(
                'INSERT INTO CLIENTE ( NOME_CLIENTE, CONTATO_CLIENTE, EMAIL_CLIENTE, SENHA_CLIENTE, ESTADO_CLIENTE) VALUES (?, ?, ?, ?, ?,?, ?)',
                [cpf_cliente, endereco_cliente, nome_cliente, contato_cliente, email_cliente, senha_cliente, estado_cliente]
            );
            return result; // Retorna o resultado da inserção
        } catch (error) {
            console.error('Erro ao criar cliente:', error);
            throw error;
        }
    },

    update: async (id, cliente) => {
        try {
            const { cpf_cliente, endereco_cliente, nome_cliente, contato_cliente, email_cliente, senha_cliente } = cliente;
            const result = await pool.query(
                'UPDATE CLIENTE SET CPF_CLIENTE = ?, ENDERECO_CLIENTE = ?, NOME_CLIENTE = ?, CONTATO_CLIENTE = ?, EMAIL_CLIENTE = ?, SENHA_CLIENTE, ESTADO_CLIENTE = ? WHERE ID_CLIENTE = ?',
                [cpf_cliente, endereco_cliente, nome_cliente, contato_cliente, email_cliente,senha_cliente, id]
            );
            return result; // Retorna o resultado da atualização
        } catch (error) {
            console.error('Erro ao atualizar cliente:', error);
            throw error;
        }
    },

    delete: async (id) => {
        try {
            const result = await pool.query('DELETE FROM CLIENTE WHERE ID_CLIENTE = ?', [id]);
            return result; // Retorna o resultado da exclusão
        } catch (error) {
            console.error('Erro ao deletar cliente:', error);
            throw error;
        }
    }
};

module.exports = orcamentoModel;
