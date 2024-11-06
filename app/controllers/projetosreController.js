const projetosreModel = require("../models/projetosreModel");
const moment = require("moment");

const projetosreController = {
  // Função para listar todos os pedidos/projetos
  listarProjetos: async (req, res) => {
    res.locals.moment = moment;

    try {
      // Buscar todos os projetos com os dados relacionados
      const projetos = await projetosreModel.findAll();

      // Renderizar a página com os dados dos projetos
      res.render("pages/projetos", {
        tarefas: projetos,  // Passando os dados dos projetos para a view
      });
    } catch (e) {
      console.log(e);
      res.json({ erro: "Falha ao acessar dados" });
    }
  },

  // Outras funções como adicionar, excluir, finalizar, etc. seguem o mesmo formato
};

module.exports = projetosreController;
