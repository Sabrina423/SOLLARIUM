var pool = require("../../config/pool_conexoes");

const pagamentosreModel = {
    findAll: async () => {
        try {
            const [linhas] = await pool.query('SELECT * FROM pagamentosre WHERE status_tarefa = 1')
            return linhas;
        } catch (error) {
            return error;
        }
    },

    findId: async (id) => {
        try {
            const [linhas,campos] = await pool.query('SELECT * FROM pagamentosre WHERE status_tarefa = 1 and id_tarefa = ?',[id] )
            return linhas;
        } catch (error) {
            return error;
        }
    },

   

    create: async (dadospagamentos) => {
        try {
            const [linhas, campos] = await pool.query('INSERT INTO pagamentosre SET ?', [dadospagamentos])
            console.log(linhas);
            console.log(campos);
            return linhas;
        } catch (error) {
            console.log(error);
            return null;
        }  
    },

    update: async (dadospagamentos, id) => {
        try {
            const [linhas] = await pool.query('UPDATE pagamentosre SET ? WHERE ID_PROF AND ID_CLIENTE = ?', [dadospagamentos, id])
            return linhas;
        } catch (error) {
            return error;
        }  
    },

    delete: async (id) => {
        try {
            const [linhas] = await pool.query('UPDATE pagamentosre SET status_tarefa = 0  WHERE id_tarefa = ?', [id])
            return linhas;
        } catch (error) {
            return error;
        }  
    },

    sistuacaoTarefa: async (situacao, id) => {
        try {
            const [linhas] = await pool.query('UPDATE pagamentosre SET situacao_tarefa = ? WHERE id_tarefa = ?', [situacao, id])
            return linhas;
        } catch (error) {
            return error;
        }  
    }
  
};
    

module.exports = pagamentosreModel