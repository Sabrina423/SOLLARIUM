const pool = require('../../config/pool_conexoes');



const servicosModel = {
    findAll: async (id) =>{
        try {
            const [linhas] = await pool.query('SELECT * FROM SERVICOS_PROF ', [id]);
            return linhas;
        } catch (error) {
            console.error('Erro ao buscar serviço por ID:', error);
            throw error;
        }
    
    },
    findById: async (id) =>{
        try {
            const [linhas] = await pool.query('SELECT * FROM SERVICOS_PROF WHERE ID_SERVICO = ?', [id]);
            return linhas[0];
        } catch (error) {
            console.error('Erro ao buscar serviço por ID:', error);
            throw error;
        }
    
    },

    create: async (servicosprof) => {
        try {
            //coloca os dados que tem no banco de dados
            const { id_servico, valor_servico, titulo_servico} = servicosprof;
            const result = await pool.query(
                'INSERT INTO SERVICOS_PROF (ID_SERVICO, VALOR_SERVICO, TITULO_SERVICO) VALUES (?, ?, ?)',
                [id_servico, valor_servico, titulo_servico]
            );
            return result;
        } catch (error) {
            console.error('Erro ao criar serviço:', error);
            throw error;
        }
    },

    update: async (id, servicosprof) => {
        try {
            
            //coloca os dados que tem no banco de dados
            const {id_servico, valor_servico, titulo_servico } = servicosprof;
            const result = await pool.query(
                'UPDATE SEERVICOS_PROF SET VALOR_SERVICO = ?, TITULO_SERVICO = ?, WHERE ID_SERVICO = ?',
                [ id_servico, valor_servico, titulo_servico, id  ]
            );
            return result;
        } catch (error) {
            console.error('Erro ao atualizar serviço:', error);
            throw error;
        }
    },
    
    delete: async (id) => {
        try {
            
            //coloca os dados que tem no banco de dados
            const result = await pool.query('DELETE FROM SERVICOS_PROF WHERE ID_SERVICO = ?', [id]);
            return result;
        } catch (error) {
            console.error('Erro ao deletar serviço:', error);
            throw error;
        }
    }
};

module.exports = servicosModel;