const { validationResult } = require("express-validator");
const cliente = require("../models/clienteModel");
const profissional = require("../models/profissionaisModel");
const adm = require("../models/admModel");

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
      
      console.log(dadosForm);
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
          }else{
            // if  validar profissional        
              const profissionalExistente = await profissional.findByEmail(dadosForm.email_profissional);
              console.log(profissionalExistente)
              if (profissionalExistente && bcrypt.compareSync( dadosForm.senha_cliente, profissionalExistente[0].SENHA_PROF)) {
                    console.log("validou a senha")
        
                autenticado = {
                  autenticado: profissionalExistente[0].NOME_PROF,
                  id: profissionalExistente[0].ID_PROF,
                  tipo: 2
                };
            //else validar adm
              }else{
              const admExistente = await adm.findByEmail(dadosForm.email_adm);
              console.log(admExistente)
              if (admExistente && bcrypt.compareSync( dadosForm.senha_adm, admExistente[0].SENHA_ADM)) {
                    console.log("validou a senha")
        
                autenticado = {
                  autenticado: admExistente[0].EMAIL_ADM,
                  id: admExistente[0].ID_ADM,
                  tipo: 3
                    };
              }
            }
        }
    }catch (e) {
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
