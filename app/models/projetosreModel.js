var pool = require("../../config/pool_conexoes");

const projetosModel = {

    findId: async (id) => {
        try {
            const [linhas,campos] = await pool.query('SELECT * FROM projetosre WHERE status_tarefa = 1 and id_tarefa = ?',[id] )
            return linhas;
        } catch (error) {
            return error;
        }
    },

   

    create: async (id) => {
        try {
            const [linhas, campos] = await pool.query('INSERT INTO projetosre SET ?')
            console.log(linhas);
            console.log(campos);
            return linhas;
        } catch (error) {
            console.log(error);
            return null;
        }  
    },

    update: async (id) => {
        try {
            const [linhas] = await pool.query('UPDATE projetosre SET ? WHERE ID_PEDIDOS = ?', [id])
            return linhas;
        } catch (error) {
            return error;
        }  
    },

    delete: async (id) => {
        try {
            const [linhas] = await pool.query('UPDATE projetosre SET ? WHERE id_tarefa = ?', [id])
            return linhas;
        } catch (error) {
            return error;
        }  
    },

    sistuacaoTarefa: async (situacao, id) => {
        try {
            const [linhas] = await pool.query('UPDATE projetosre SET situacao_tarefa = ? WHERE id_tarefa = ?', [situacao, id])
            return linhas;
        } catch (error) {
            return error;
        }  
    }
  
};
    

module.exports = projetosModel;