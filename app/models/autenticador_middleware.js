const { validationResult } = require("express-validator");
const cliente = require("../models/clienteModel");
const bcrypt = require("bcryptjs");

const verificarClienteAutenticado = (req, res, next) => {
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

const limparSessao = (req, res, next) => {
  req.session.destroy();
  next();
};

const gravarClienteAutenticado = async (req, res, next) => {
  const erros = validationResult(req);
  var autenticado = { autenticado: null, id: null, tipo: null };
  if (erros.isEmpty()) {
    const dadosForm = {
      user_cliente: req.body.nome_usu,
      senha_cliente: req.body.senha_usu,
    };
    try {
      const clienteExistente = await cliente.findById(dadosForm.user_cliente);
      if (clienteExistente && bcrypt.compareSync(dadosForm.senha_cliente, clienteExistente.senha_cliente)) {
        autenticado = {
          autenticado: clienteExistente.nome_cliente,
          id: clienteExistente.id_cliente,
          tipo: clienteExistente.tipo_cliente
        };
      }
    } catch (e) {
      console.error(e);
    }
  }
  req.session.autenticado = autenticado;
  req.session.logado = 0;
  next();
};

const verificarClienteAutorizado = (tipoPermitido, destinoFalha) => {
  return (req, res, next) => {
    if (
      req.session.autenticado.autenticado != null &&
      tipoPermitido.includes(req.session.autenticado.tipo)
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
