const pool = require('../../config/pool_conexoes');

const orcamentoModel = {
    findById: async (id) => {
        try {
            const [linhas] = await pool.query('SELECT * FROM ORCAMENTO WHERE ID_ORCAMENTO = ?', [id]);
            return linhas[0];
        } catch (error) {
            console.error('Erro ao buscar orcamento por ID:', error);
            throw error;
        }
    },
    
    create: async (orcamento) => {
        try {
            const { id_orcamento, valor_orcamento, descricao_orcamento, data_orcamento, status_orcamento } = orcamento;
            const result = await pool.query(
                'INSERT INTO ORCAMENTO (ID_ORCAMENTO, VALOR_ORCAMENTO, DESCRICAO_ORCAMENTO, DATA_ORCAMENTO, STATUS_ORCAMENTO) VALUES (?, ?, ?, ?, ?)',
                [id_orcamento, valor_orcamento, descricao_orcamento, data_orcamento, status_orcamento]
            );
            return result;
        } catch (error) {
            console.error('Erro ao criar orcamento:', error);
            throw error;
        }
    },

    update: async (id, orcamento) => {
        try {
            const { valor_orcamento, descricao_orcamento, data_orcamento, status_orcamento } = orcamento;
            const result = await pool.query(
                'UPDATE ORCAMENTO SET VALOR_ORCAMENTO = ?, DESCRICAO_ORCAMENTO = ?, DATA_ORCAMENTO = ?, STATUS_ORCAMENTO = ? WHERE ID_ORCAMENTO = ?',
                [valor_orcamento, descricao_orcamento, data_orcamento, status_orcamento, id]
            );
            return result;
        } catch (error) {
            console.error('Erro ao atualizar orcamento:', error);
            throw error;
        }
    },

    delete: async (id) => {
        try {
            const result = await pool.query('DELETE FROM ORCAMENTO WHERE ID_ORCAMENTO = ?', [id]);
            return result;
        } catch (error) {
            console.error('Erro ao deletar orcamento:', error);
            throw error;
        }
    }
};

module.exports = orcamentoModel;
