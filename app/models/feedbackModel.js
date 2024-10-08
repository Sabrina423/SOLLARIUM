const moment = require("moment");
var pool = require("../../config/pool_conexoes");

const feedbackModel = {
    findAll: async (id = null) => {
        try {
            const [resultados] = await pool.query("SELECT ID_FEEDBACK,ID_CLIENTE, CLASSIF_FEEDBACK, DATA_FEEDBACK, ITEM_PEDIDO_PEDIDOS_ID_CLIENTE, ITEM_PEDIDO_SERVICOS_PROF_ID_PROF, ITEM_PEDIDO_ID_ITEM_PEDIDO " 
                , [id]);
                return resultados;
        } catch (error) {
            console.log(error);
            return error;
        }
    },
    findID: async (id) => {
        try {
            const [resultados] = await pool.query("SELECT * FROM where ID_FEEDBACK = ? ", [id]);
            return resultados;
        } catch (error) {
            console.log(error);
            return error;
        }
    },

    findID: async (id) => {
        try {
            const [resultados] = await pool.query("SELECT * FROM where ID_CLIENTE = ? ", [id]);
            return resultados;
        } catch (error) {
            console.log(error);
            return error;
        }
    },


    FindPage: async (pagina, total) => {
        try {
            const [resultados] = await pool.query("SELECT * FROM  limit ?, ?", [pagina, total]);
            return resultados;
        } catch (error) {
            console.log(error);
            return error;
        }

    },

    TotalReg: async () => {
        try {
            const [resultados] = await pool.query('SELECT count(*) total FROM hq ');
            return resultados;
        } catch (error) {
            console.log(error);
            return error;
        }

    },

    create: async (camposJson) => {
        try {
            const [resultados] = await pool.query("insert into hq set ?", camposJson);
            return resultados;
        } catch (error) {
            console.log(error);
            return error;
        }


    },

    update: async (camposJson, id) => {
        try {
            const [resultados] = await pool.query("UPDATE hq SET ? WHERE id_hq = ?", [camposJson, id])
            return resultados;
        } catch (error) {
            console.log(error);
            return error;
        }

    },

    delete: async (id) => {
        try {
            const [resultados] = await pool.query("UPDATE hq SET status_hq = 0 WHERE id_hq = ?", [id]);
            return resultados;
        } catch (error) {
            console.log(error);
            return error;
        }
    },
}

module.exports = { feedbackModel };