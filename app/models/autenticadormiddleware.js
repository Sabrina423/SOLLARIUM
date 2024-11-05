const { validationResult } = require("express-validator");
const cliente = require("./clienteModel");
const profissional = require("./profissionaisModel");
const adm = require("./admModel");

const bcrypt = require("bcryptjs");

const verificarClienteAutenticado = (req, res, next) => {
  if (req.session.autenticado) {
    var autenticado = req.session.autenticado;
    req.session.logado = req.session.logado + 1;
  } else {
    var autenticado = { autenticado: null, id: null, tipo: null, imagem: null };
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
  var autenticado = { autenticado: null, id: null, tipo: null, imagem: null };

  if (erros.isEmpty()) {
    const dadosForm = {
      nome_cliente: req.body.email,
      senha_cliente: req.body.password,
    };

    console.log(dadosForm); 
  
    try {
      const clienteExistente = await cliente.findByEmailTot(dadosForm.nome_cliente);
      var totalCliente = Object.keys(clienteExistente).length;
      console.log(clienteExistente);
      console.log(totalCliente);

      if (clienteExistente[0].tot == 1) {
           console.log("validou a senha 1");
        if (bcrypt.compareSync(dadosForm.senha_cliente, clienteExistente[0].SENHA_CLIENTE)) {
       

          autenticado = {
            autenticado: clienteExistente[0].NOME_CLIENTE,
            id: clienteExistente[0].ID_CLIENTE,
            tipo: 1,
            imagem: clienteExistente[0].IMAGEM_PERFIL_CLIENTE,
          };
        }
      } else {
        // Valida profissional
        const profissionalExistente = await profissional.findfindByEmailTot(dadosForm.nome_cliente);
        var totalProf = Object.keys(profissionalExistente).length;
        console.log(profissionalExistente);
        console.log(totalProf);
        if (profissionalExistente[0].tot == 1) {
          if (bcrypt.compareSync(dadosForm.senha_cliente, profissionalExistente[0].SENHA_PROF)) {
            console.log("validou a senha 2");

            autenticado = {
              autenticado: profissionalExistente[0].NOME_PROF,
              id: profissionalExistente[0].ID_PROF,
              tipo: 2,
              imagem: profissionalExistente[0].IMAGEM_PERFIL_PROFISSIONAL,
            };
          }
        } else {
          // Valida administrador
          const admExistente = await adm.findByEmail(dadosForm.nome_cliente);
          var totalAdm = Object.keys(admExistente).length;
          console.log(admExistente);
          console.log(totalAdm);

          if (totalAdm == 1 && bcrypt.compareSync(dadosForm.senha_cliente, admExistente[0].SENHA_ADM)) {
            console.log("validou a senha 3");

            autenticado = {
              autenticado: admExistente[0].EMAIL_ADM,
              id: admExistente[0].ID_ADM,
              tipo: 3,
            };
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  } else {
    console.log(erros);
  }

  req.session.autenticado = autenticado;
  req.session.logado = 0;
  console.log(req.session.autenticado);
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
      res.render(destinoFalha, { autenticado: req.session.autenticado, dadosNotificacao: null });
    }
  };
};

module.exports = {
  verificarClienteAutenticado,
  limparSessao,
  gravarClienteAutenticado,
  verificarClienteAutorizado,
};
