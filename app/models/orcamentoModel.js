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

    create: async (orcamento) => {
        try {
            const { id_orcamento, valor_orcamento,  descricao_orcamento, data_orcamento} = orcamento;
            const result = await pool.query(
                'INSERT INTO ORCAME ( ID_ORCAMENO, VALOR_ORCAMENTO, DESCRICAO_ORCAMENTO, DATA_ORCAMENTO) VALUES (?, ?, ?,?)',
                [id_orcamento, valor_orcamento, descricao_orcamento, data_orcamento]
            );
            return result; // Retorna o resultado da inserção
        } catch (error) {
            console.error('Erro ao criar cliente:', error);
            throw error;
        }
    },

    update: async (id, orcamento) => {
        try {
            const { id_orcamento, valor_orcamento,  descricao_orcamento, data_orcamento } = orcamento;
            const result = await pool.query(
                'UPDATE ORCAMENTO SET ID_ORCAMENTO = ?, VALOR_ORCAMENTO = ?, DESCRICAO_ORCAMENTO = ?, DATA_ORCAMENTO = ? WHERE ID_ORCAMENTO = ?',
                [id_orcamento, valor_orcamento, descricao_orcamento, data_orcamento, id]
            );
            return result; // Retorna o resultado da atualização
        } catch (error) {
            console.error('Erro ao atualizar cliente:', error);
            throw error;
        }
    },

    delete: async (id) => {
        try {
            const result = await pool.query('DELETE FROM ORCAMENTO WHERE ID_ORCAMENTO = ?', [id]);
            return result; // Retorna o resultado da exclusão
        } catch (error) {
            console.error('Erro ao deletar orcamento:', error);
            throw error;
        }
    }
};

module.exports = orcamentoModel;
