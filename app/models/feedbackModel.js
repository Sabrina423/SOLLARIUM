const moment = require("moment");
var pool = require("../../config/pool_conexoes");
const { feedbackModel } = require("../controllers/feedbackController");

const favoritoModel = {
    findAll: async () => {
        try {
            const [resultados] = await pool.query("SELECT * FROM favorito");
            return resultados;
        } catch (error) {
            console.log(error);
            return error;
        }
    },

    findID: async (Idfeedback, idUsuario) => {
        try {
            const [resultados] = await pool.query(
                "SELECT * FROM favorito where feedback_ID_FEEDBACK = ? and usuario_id_usuario = ? ",
                [Idfeedback, idUsuario]);
            return resultados;
        } catch (error) {
            console.log(error);
            return error;
        }
    },

    create: async (camposJson) => {
        try {
            const [resultados] = await pool.query("insert into favorito set ?", camposJson);
            return resultados;
        } catch (error) {
            console.log(error);
            return error;
        }
    },

    update: async (camposJson, Idfeedback, idUsuario) => {
        try {
            const [resultados] = await pool.query(
                "UPDATE favorito SET ? WHERE hq_id_hq = ? and usuario_id_usuario = ? ", 
                [camposJson, Idfeedback, idUsuario])
            return resultados;
        } catch (error) {
            console.log(error);
            return error;
        }

    },

    delete: async (id) => {
        try {
            const [resultados] = await pool.query(
                "UPDATE favorito SET status_favorito = 0 WHERE hq_id_hq = ? and usuario_id_usuario = ?", 
                [Idfeedback, idUsuario]);
            return resultados;
        } catch (error) {
            console.log(error);
            return error;
        }
    },

    favoritar: async (dadosFavorito) => {
        try {
            if (dadosFavorito.situacao == "favorito") {
                const resultados = await favoritoModel.update(
                    { status_favorito: 0 }, dadosFavorito.Idfeedback, dadosFavorito.idUsuario
                );
            } else if (dadosFavorito.situacao == "favoritar") {
                const result = await favoritoModel.findID(
                    dadosFavorito.Idfeedback, dadosFavorito.idUsuario
                );
                var total = Object.keys(result).length;
                if (total == 0) {
                    let obj = {
                        hq_id_hq: dadosFavorito.Idfeedback,
                        usuario_id_usuario: dadosFavorito.idUsuario,
                        dt_inclusao_favorito: moment().format("YYYY/MM/DD"),
                        status_favorito: 1
                    }
                    const resultados = await favoritoModel.create(obj);
                } else {
                    const resultados = await favoritoModel.update(
                        { status_favorito: 1 }, dadosFavorito.Idfeedback, dadosFavorito.idUsuario
                    );
                }

            }
        } catch (error) {
            console.log(error);
            return error;
        }
    }

}

module.exports = feedbackModel ;