const verificarProfAutorizado = (permissoes, redirecionarPara) => {
    return (req, res, next) => {
        if (req.session && req.session.usuario && permissoes.includes(req.session.usuario.permissao)) {
            next();
        } else {
            res.redirect(redirecionarPara);
        }
    };
  };
  
  module.exports = verificarProfAutorizado;
  