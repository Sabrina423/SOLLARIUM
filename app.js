const express = require('express');
const session = require('express-session');
const app = express();
const port = 3000;


app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: true }));

let rotas = require('./app/routes/router')
app.use('/', rotas);

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
