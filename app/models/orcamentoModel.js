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
            const {  data_orcamento, valor_orcamento, id_cliente, servicos_prof_id_servico } = orcamento;
            const result = await pool.query(
                'INSERT INTO ORCAMENTO ( DATA_ORCAMENTO,VALOR_ORCAMENTO,STATUS_ORCAMENTO, ID_CLIENTE,SERVICOS_PROF_ID_SERVICO) VALUES (?, 1, ?,?, ?)',
                [ data_orcamento,valor_orcamento, id_cliente, servicos_prof_id_servico]
            );
            return result;
        } catch (error) {
            console.error('Erro ao criar orcamento:', error);
            throw error;
        }
    },

    update: async (id, orcamento) => {
        try {
            const { valor_orcamento, profissionais_id_prof, data_orcamento, status_orcamento, id_cliente } = orcamento;
            const result = await pool.query(
                'UPDATE ORCAMENTO SET VALOR_ORCAMENTO = ?, PROFISSIONAIS_ID_PROF = ?, DATA_ORCAMENTO = ?, STATUS_ORCAMENTO = ?, ID_CLIENTE = ? WHERE ID_ORCAMENTO = ?',
                [valor_orcamento, profissionais_id_prof, data_orcamento, status_orcamento, id_cliente, id]
            );
            return result;
        } catch (error) {
            console.error('Erro ao atualizar orcamento:', error);
            throw error;
        }
    },

    update: async (dadosForm, id) => {
        try {
            const [linhas] = await pool.query('UPDATE orcamento SET ? WHERE id_orcamento = ?', [dadosForm, id])
            return linhas;
        } catch (error) {
            return error;
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
