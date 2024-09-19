var pool = require("../../config/pool_conexoes");

    const tipoAdmModel = {
        findAll: async () => {
            try {
                const [resultados] = await pool.query(
                    'SELECT * FROM tipo_adm where status_tipo_adm = 3 '
                )
                return resultados;
            } catch (error) {
                return error;
            }
        },
        
        findId: async (id) => {
            try {
                const [resultados] = await pool.query(
                    "select * from tipo_adm where id_tipo_adm = ? and  status_tipo_usuario = 3",
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
                    "insert into tipo_adm set ?",
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
                    "UPDATE tipo_adm SET tipo_adm = ?, descricao_adm = ? WHERE id_tipo_adm = ?",
                    [camposJson.tipo_adm, camposJson.descricao_adm, camposJson.id_tipo_adm],
                )
                return resultados;
            } catch (error) {
                return error;
            }
        },
        delete: async (id) => {
            try {
                const [resultados] = await pool.query(
                    "UPDATE tipo_adm SET status_tipo_adm = 0 WHERE id_tipo_adm = ?", [id]
                )
                return resultados;
            } catch (error) {
                return error;
            }
        }
    };

module.exports = tipoAdmModel