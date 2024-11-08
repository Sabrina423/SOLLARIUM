const pool = require("../../config/pool_conexoes");
const { create } = require("./orcamentoModel");

const projetosreModel = {
  // Buscar todos os projetos (pedidos)
  findAll: async () => {
    try {
      const [linhas] = await pool.query(`
        SELECT 
          p.ID_PEDIDOS AS id_projetos,
          p.CLIENTE_ID_CLIENTE,
          p.DATA_PEDIDO AS data_projetos,
          p.VALOR_TOTAL_PEDIDO AS valor_projetos,
          c.nome_cliente AS nome_projetos
        FROM PEDIDOS p
        JOIN CLIENTE c ON c.ID_CLIENTE = p.CLIENTE_ID_CLIENTE
      `);
      return linhas;
    } catch (error) {
      console.error("Erro ao buscar projetos:", error);
      throw new Error("Falha ao buscar projetos");
    }
  },

  // Buscar projeto (pedido) por ID
  findId: async (id) => {
    try {
      const [linhas] = await pool.query(`
        SELECT 
          p.ID_PEDIDOS AS id_projetos,
          p.CLIENTE_ID_CLIENTE,
          p.DATA_PEDIDO AS data_projetos,
          p.VALOR_TOTAL_PEDIDO AS valor_projetos,
          c.nome_cliente AS nome_projetos
        FROM PEDIDOS p
        JOIN CLIENTE c ON c.ID_CLIENTE = p.CLIENTE_ID_CLIENTE
        WHERE p.ID_PEDIDOS = ?
      `, [id]);
      return linhas;
    } catch (error) {
      console.error("Erro ao buscar projeto:", error);
      throw new Error("Falha ao buscar projeto");
    }
  },

 
  // Outras funções como criar, atualizar, excluir, etc. seguem o mesmo formato

};



module.exports = projetosreModel;
