var pool = require("../../config/pool_conexoes");

    const tipoprofModel = {
        findAll: async () => {
            try {
                const [resultados] = await pool.query(
                    'SELECT * FROM tipo_prof where status_tipo_prof = 1 '
                )
                return resultados;
            } catch (error) {
                return error;
            }
        },
        
        findId: async (id) => {
            try {
                const [resultados] = await pool.query(
                    "select * from tipo_prof where id_tipo_prof = ? and  status_tipo_usuario = 1",
                    [id]
                )
                return resultados;
            } catch (error) {
                return error;
            }
        },
        create: async (camposJson) => {
            try {
                const [resultados] = await pool.query(
                    "insert into tipo_prof set ?",
                    [camposJson]
                )
                return resultados;
            } catch (error) {
                return error;
            }
        },
        update: async (camposJson) => {
            try {
                const [resultados] = await pool.query(
                    "UPDATE tipo_prof SET tipo_prof = ?, descricao_prof = ? WHERE id_tipo_prof = ?",
                    [camposJson.tipo_prof, camposJson.descricao_prof, camposJson.id_tipo_prof],
                )
                return resultados;
            } catch (error) {
                return error;
            }
        },
        delete: async (id) => {
            try {
                const [resultados] = await pool.query(
                    "UPDATE tipo_prof SET status_tipo_prof = 0 WHERE id_tipo_prof = ?", [id]
                )
                return resultados;
            } catch (error) {
                return error;
            }
        }
    };

module.exports = tipoprofModel