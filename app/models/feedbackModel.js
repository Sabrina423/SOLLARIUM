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
            const { id_feedback, id_cliente, id_prof, classificacao, comentario, data } = feedback;
            const result = await pool.query(
                'INSERT INTO FEEDBACK (ID_FEEDBACK, ID_CLIENTE, ID_PROF, CLSSIF_FEEDBACK, COMENTARIO_FEEDBACK, COMENTARIO_FEEDBACK) VALUES (?, ?, ?, ?, ?,?)',
                [id_feedback, id_cliente, id_prof, classificacao, comentario, data]
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
            const {  classificacao, comentario, data ,id_feedback, id_cliente, id_prof,} = feedback;
            const result = await pool.query(
                'UPDATE FEEDBACK SET CLASSIF_FEEDBACK = ?, COMENTARIO_FEEDBACK = ?, DATA_FEEDBACK = ?,  ID_CLIENTE = ?, ID_PROF = ? WHERE ID_FEEDBACK = ?',
                [  classificacao, comentario, data,id_feedback, id_cliente, id_prof, id]
            );
            return result;
        } catch (error) {
            console.error('Erro ao atualizar feedback:', error);
            throw error;
        }
    },
    
    delete: async (id) => {
        try {
            
            //coloca os dados que tem no banco de dados
            const result = await pool.query('DELETE FROM FEEDBACK WHERE ID_FEEDBACK = ?', [id]);
            return result;
        } catch (error) {
            console.error('Erro ao deletar orcamento:', error);
            throw error;
        }
    }
};

module.exports = feedbackModel;