const { validationResult } = require("express-validator");
const usuario = require("./usuarioModel");
const bcrypt = require("bcryptjs");

verificarClienteAutenticado = (req, res, next) => {
  if (req.session.autenticado) {
    var autenticado = req.session.autenticado;
    req.session.logado = req.session.logado + 1;
  } else {
    var autenticado = { autenticado: null, id: null, tipo: null };
    req.session.logado = 0;
  }
  req.session.autenticado = autenticado;
  next();
};

limparSessao = (req, res, next) => {
  req.session.destroy();
  next();
};

gravarClienteAutenticado = async (req, res, next) => {
  erros = validationResult(req);
  var autenticado = { autenticado: null, id: null, tipo: null };
  if (erros.isEmpty()) {
    var dadosForm = {
      user_usuario: req.body.nome_usu,
      senha_usuario: req.body.senha_usu,
    };
    var results = await usuario.findClienteEmail(dadosForm);
    var total = Object.keys(results).length;
    if (total == 1) {
      if (bcrypt.compareSync(dadosForm.senha_usuario, results[0].senha_cliente)) {
        var autenticado = {
          autenticado: results[0].nome_cliente,
          id: results[0].id_cliente,
          tipo: results[0].tipo_cliente
        };
      }
    }
  }
  req.session.autenticado = autenticado;
  req.session.logado = 0;
  next();
};

verificarClienteAutorizado = (tipoPermitido, destinoFalha) => {
  return (req, res, next) => {
    if (
      req.session.autenticado.autenticado != null &&
      tipoPermitido.find(function (element) {
        return element == req.session.autenticado.tipo;
      }) != undefined
    ) {
      next();
    } else {
      res.render(destinoFalha, req.session.autenticado);
    }
  };
};

module.exports = {
  verificarClienteAutenticado,
  limparSessao,
  gravarClienteAutenticado,
  verificarClienteAutorizado,
};
