const express = require('express');
const session = require('express-session');
const router = require('routes/router.js');
const db = require('pool_conexoes.js'); 
const app = express();
const port = 3000;


app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: true }));


app.use('/', router);

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
