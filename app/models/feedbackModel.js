const pool = require('../../config/pool_conexoes');


const feedbackModel = {
    findById: async (id) =>{
        try {
            const [linhas] = await pool.query('SELECT * FROM FEEDBACK WHERE ID_FEEDBACK = ?', [id]);
            return linhas[0];
        } catch (error) {
            console.error('Erro ao buscar feedbak por ID:', error);
            throw error;
        }
    
    },

    create: async (feedback) => {
        try {
            //coloca os dados que tem no banco de dados
            const { ID_FEEDBACK, valor_orcamento, descricao_orcamento, data_orcamento, status_orcamento, id_cliente } = orcamento;
            const result = await pool.query(
                'INSERT INTO ORCAMENTO (ID_FEEDBACK, VALOR_ORCAMENTO, DESCRICAO_ORCAMENTO, DATA_ORCAMENTO, STATUS_ORCAMENTO, ID_CLIENTE) VALUES (?, ?, ?, ?, ?,?)',
                [id_orcamento, valor_orcamento, descricao_orcamento, data_orcamento, status_orcamento, id_cliente]
            );
            return result;
        } catch (error) {
            console.error('Erro ao criar orcamento:', error);
            throw error;
        }
    },

    update: async (id, feedback) => {
        try {
            
            //coloca os dados que tem no banco de dados
            const { valor_orcamento, descricao_orcamento, data_orcamento, status_orcamento, id_cliente } = orcamento;
            const result = await pool.query(
                'UPDATE ORCAMENTO SET VALOR_ORCAMENTO = ?, DESCRICAO_ORCAMENTO = ?, DATA_ORCAMENTO = ?, STATUS_ORCAMENTO = ?, ID_CLIENTE = ? WHERE ID_ORCAMENTO = ?',
                [valor_orcamento, descricao_orcamento, data_orcamento, status_orcamento, id_cliente, id]
            );
            return result;
        } catch (error) {
            console.error('Erro ao atualizar orcamento:', error);
            throw error;
        }
    },
    
    delete: async (id) => {
        try {
            
            //coloca os dados que tem no banco de dados
            const result = await pool.query('DELETE FROM ORCAMENTO WHERE ID_FEEDBACK = ?', [id]);
            return result;
        } catch (error) {
            console.error('Erro ao deletar orcamento:', error);
            throw error;
        }
    }
};

module.exports = feedbackModel;