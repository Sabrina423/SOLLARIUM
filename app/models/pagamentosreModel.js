var pool = require("../../config/pool_conexoes");

const tarefasModel = {
    findAll: async () => {
        try {
            const [linhas] = await pool.query('SELECT * FROM tarefas WHERE status_tarefa = 1')
            return linhas;
        } catch (error) {
            return error;
        }
    },

    findId: async (id) => {
        try {
            const [linhas,campos] = await pool.query('SELECT * FROM tarefas WHERE status_tarefa = 1 and id_tarefa = ?',[id] )
            return linhas;
        } catch (error) {
            return error;
        }
    },

   

    create: async (dadosForm) => {
        try {
            const [linhas, campos] = await pool.query('INSERT INTO tarefas SET ?', [dadosForm])
            console.log(linhas);
            console.log(campos);
            return linhas;
        } catch (error) {
            console.log(error);
            return null;
        }  
    },

    update: async (dadosForm, id) => {
        try {
            const [linhas] = await pool.query('UPDATE tarefas SET ? WHERE id_tarefa = ?', [dadosForm, id])
            return linhas;
        } catch (error) {
            return error;
        }  
    },

    delete: async (id) => {
        try {
            const [linhas] = await pool.query('UPDATE tarefas SET status_tarefa = 0  WHERE id_tarefa = ?', [id])
            return linhas;
        } catch (error) {
            return error;
        }  
    },

    sistuacaoTarefa: async (situacao, id) => {
        try {
            const [linhas] = await pool.query('UPDATE tarefas SET situacao_tarefa = ? WHERE id_tarefa = ?', [situacao, id])
            return linhas;
        } catch (error) {
            return error;
        }  
    }
  
};
    

module.exports = tarefasModel