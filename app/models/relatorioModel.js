var pool = require("../../config/pool_conexoes");

const relatórioModel = {
//encontra todos
    findAll: async () => {
 
        try {
            const [linhas] = await pool.query('SELECT * FROM relatorio WHERE PEDIDOS = 1')
            return linhas;
        } catch (error) {
            return error;
        }
    },
//encontra id 
    findId: async (id) => {
        try {
            const [linhas,campos] = await pool.query('SELECT * FROM relatorio WHERE ID_PEDIDOS = ? and CLIENTE_ID_CLIENTE = ? and DATA_PEDIDO = ? and VALOR_TOTAL_PEDIDO = ?',[id] )
            return linhas;
        } catch (error) {
            return error;
        }

    },

   
//criar relatorio novo
    create: async (dadosForm) => {
        try {
            const [linhas, campos] = await pool.query('INSERT INTO relatorio SET ?', [dadosForm])
            console.log(linhas);
            console.log(campos);
            return linhas;
        } catch (error) {
            console.log(error);
            return null;
        }  
    },
//atualizar relatorio
    update: async (dadosForm, id) => {
        try {
            const [linhas] = await pool.query('UPDATE relatorio SET ? WHERE id_tarefa = ?', [dadosForm, id])
            return linhas;
        } catch (error) {
            return error;
        }  
    },
//deletar relatorio
    delete: async (id) => {
        try {
            const [linhas] = await pool.query('UPDATE relatorio SET status_tarefa = 0  WHERE id_tarefa = ?', [id])
            return linhas;
        } catch (error) {
            return error;
        }  
    },
//
    sistuacaoTarefa: async (situacao, id) => {
        try {
            const [linhas] = await pool.query('UPDATE relatorio SET situacao_tarefa = ? WHERE id_tarefa = ?', [situacao, id])
            return linhas;
        } catch (error) {
            return error;
        }  
    }
  
};
    

module.exports = relatórioModel