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
      nome_cliente: req.body.email,
      senha_cliente: req.body.password,
    };
    console.log(dadosForm)
    try {
      const clienteExistente = await cliente.findByEmail(dadosForm.nome_cliente);
     console.log(clienteExistente)
      if (clienteExistente && bcrypt.compareSync( dadosForm.senha_cliente, clienteExistente[0].SENHA_CLIENTE)) {
            console.log("validou a senha")

        autenticado = {
          autenticado: clienteExistente[0].NOME_CLIENTE,
          id: clienteExistente[0].ID_CLIENTE,
          tipo: 1
        };
      }
    } catch (e) {
      console.log(e);
    }
  }else{
    console.log(erros);
    
  }
  req.session.autenticado = autenticado;
  req.session.logado = 0;
  console.log(req.session.autenticado)
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
