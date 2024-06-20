router.get ('/',  (req, res) => {
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

router.get('/cadastrocliente', (req, res) => {
  res.render('pages/orcamento');
});

router.post('/perfilcliente',  (req, res) => {
  res.render('pages/perfilciente');
});


module.exports = router;
