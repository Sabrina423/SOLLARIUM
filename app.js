require('dotenv').config(); // Carregar variáveis de ambiente

const express = require('express');
const session = require('express-session');
const pool = require('./config/pool_conexoes'); // cerifique-se de que o caminho está correto
const rotas = require('./app/routes/router'); // cerifique-se de que este caminho está correto
const { isObject } = require('util');



const app = express();
const port = process.env.APP_PORT || 3000;

// Configuração do middleware
app.use(express.static("app/public/"));
app.set('view engine', 'ejs');
app.set('views', "./app/views");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuração da sessão
app.use(session({ 
  secret: process.env.SESSION_SECRET || 'site',
  resave: false,
  saveUninitialized: true 
}));

// Configuração das rotas
app.use('/', rotas);



// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}\nhttp://localhost:${port}`);
});

