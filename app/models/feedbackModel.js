const moment = require("moment");
var pool = require("../../config/pool_conexoes");
const { feedbackModel } = require("../controllers/feedbackController");

const feedbackModel = {
    findAll: async () => {
        try {
            const [resultados] = await pool.query("SELECT * FROM FEEDBACK");
            return resultados;
        } catch (error) {
            console.log(error);
            return error;
        }
    },

    findID: async (idFeedback, idCliente,idprofissionais) => {
        try {
            const [resultados] = await pool.query(
                "SELECT * FROM FEEDBACK where ID_FEEDBACK = ? ID_CLIENTE = ? ID_PROFISSIONAIS = ? ",
                [idFeedback, idCliente,idprofissionais]);
            return resultados;
        } catch (error) {
            console.log(error);
            return error;
        }
    },

    create: async (camposJson) => {
        try {
            const [resultados] = await pool.query("insert into feedback set ?", camposJson);
            return resultados;
        } catch (error) {
            console.log(error);
            return error;
        }
    },

    update: async (camposJson, idFeedback, idCliente,idprofissionais) => {
        try {
            const [resultados] = await pool.query(
                "UPDATE FEEDBACK SET ? WHERE ID_FEEDBACK = ? and ID_CLIENTE = ? and ID_PROFISSIONAL = ?", 
                [camposJson, idFeedback, idCliente])
            return resultados;
        } catch (error) {
            console.log(error);
            return error;
        }

    },

    delete: async (id) => {
        try {
            const [resultados] = await pool.query(
                "UPDATE FEEDBACK SET CLASSIF_FEEDBACK = 0  WHERE ID_FEEDBACK = ? and COMENTARIO_FEEDBACK = ?", 
                [idFeedback, idCliente]);
            return resultados;
        } catch (error) {
            console.log(error);
            return error;
        }
    },

    feedback: async (dadosfeedback) => {
        try {
            if (dadosfeedback.situacao == "FEEDBACK") {
                const resultados = await feedbackModel.update(
                    { status_feedback: 0 }, dadosfeedback.idFeedback, dadosfeedback.idCliente
                );
            } else if (dadosfeedback.situacao == "feedback") {
                const result = await feedbackModel.findID(
                    dadosfeedback.idFeedback, dadosfeedback.idCliente
                );
                var total = Object.keys(result).length;
                if (total == 0) {
                    let obj = {
                        ID_FEEDBACK: dadosfeedback.idFeedback,
                        ID_CLIENTE:dadosfeedback.idCliente,
                        ID_PROF: dadosfeedback.idprofissionais,
                        CLASSIF_FEEDBACK:dadosfeedback.rating,
                        COMENTARIO_FEEDBACK: dadosfeedback.rating,
                        DATA_FEEDBACK: moment().format("YYYY/MM/DD"),
                        ITEM_PEDIDO_PEDIDOS_ID_CLIENTE: 1,
                        ITEM_PEDIDO_SERVICOS_PROF_ID_PROFISSIONAIS: 2,
                        ITEM_PEDIDO_ID_ITEM_PEDIDO: 3,
                    }
                    const resultados = await feedbackModel.create(obj);
                } else {
                    const resultados = await feedbackModel.update(
                        { ITEM_PEDIDO_PEDIDOS_ID_CLIENTE: 1 }, dadosfeedback.idFeedback, dadosfeedback.idCliente, dadosfeedback.idprofissionais,
                        {ITEM_PEDIDO_SERVICOS_PROF_ID_PROFISSIONAIS: 2 }, dadosfeedback.idFeedback, dadosfeedback.idCliente, dadosfeedback.idprofissionais,
                        {ITEM_PEDIDO_ID_ITEM_PEDIDO: 3 }, dadosfeedback.idFeedback, dadosfeedback.idCliente, dadosfeedback.idprofissionais
                    );
                }

            }
        } catch (error) {
            console.log(error);
            return error;
        }
    }

}

module.exports = feedbackModel;