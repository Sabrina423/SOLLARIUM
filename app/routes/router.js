var express = require('express');
var router = express.Router();


function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login');
}


router.get('/login', (req, res) => {
  res.render('pages/login'); 
});


router.post('/login', (req, res) => {
  const { username, password } = req.body;

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


router.get('/',  (req, res) => {
  res.render('pages/home');
});

router.get('/soucliente',  (req, res) => {
  res.render('pages/soucliente');
});

router.get('/souprofissional',(req, res) => {
  res.render('pages/souprofissional');
});

router.get('/cadastroprof', (req, res) => {
  res.render('pages/cadastroprof');
});

router.get('/cadastrocliente',  (req, res) => {
  res.render('pages/cadastrocliente');
});

router.get('/cadastrocliente' (req, res) => {
  res.render('pages/orcamento');
});

router.post('/perfilcliente',  (req, res) => {
  res.render('pages/perfilciente');
});


module.exports = router;
