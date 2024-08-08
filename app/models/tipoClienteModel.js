var pool = require("../../config/pool_conexoes");

    const tipoClienteModel = {
        findAll: async () => {
            try {
                const [resultados] = await pool.query(
                    'SELECT * FROM tipo_cliente where status_tipo_cliente = 1 '
                )
                return resultados;
            } catch (error) {
                return error;
            }
        },
        
        findId: async (id) => {
            try {
                const [resultados] = await pool.query(
                    "select * from tipo_cliente where id_tipo_cliente = ? and  status_tipo_usuario = 1",
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
                    "insert into tipo_cliente set ?",
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
                    "UPDATE tipo_cliente SET tipo_cliente = ?, descricao_cliente = ? WHERE id_tipo_cliente = ?",
                    [camposJson.tipo_cliente, camposJson.descricao_cliente, camposJson.id_tipo_cliente],
                )
                return resultados;
            } catch (error) {
                return error;
            }
        },
        delete: async (id) => {
            try {
                const [resultados] = await pool.query(
                    "UPDATE tipo_cliente SET status_tipo_cliente = 0 WHERE id_tipo_cliente = ?", [id]
                )
                return resultados;
            } catch (error) {
                return error;
            }
        }
    };

module.exports = tipoClienteModel