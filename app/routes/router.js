var express = require('express');
var router = express.Router();

// Middleware de autenticação
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login');
}

// Página de login
router.get('/login', (req, res) => {
  res.render('pages/login'); // Certifique-se de ter a página de login
});

// Processar login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Substitua por sua lógica de autenticação
  if (username === 'admin' && password === 'admin') {
    req.session.user = { username };
    res.redirect('/');
  } else {
    res.redirect('/login');
  }
});


router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.redirect('/');
    }
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
});


router.get('/', isAuthenticated, (req, res) => {
  res.render('pages/home');
});

router.get('/soucliente', isAuthenticated, (req, res) => {
  res.render('pages/soucliente');
});

router.get('/souprofissional', isAuthenticated, (req, res) => {
  res.render('pages/souprofissional');
});

router.get('/cadastroprof', isAuthenticated, (req, res) => {
  res.render('pages/cadastroprof');
});

router.get('/cadastrocliente', isAuthenticated, (req, res) => {
  res.render('pages/cadastrocliente');
});

module.exports = router;
