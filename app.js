require('dotenv').config(); // Load environment variables
const express = require('express');
const session = require('express-session');
const pool = require('./config/pool_conexoes'); // Ensure this path is correct
const rotas = require('./app/routes/router'); // Ensure this path is correct

const app = express();
const port = process.env.APP_PORT || 3000;

app.use(express.static("app/public/"));
app.set('view engine', 'ejs');
app.set('views', "./app/views");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({ 
  secret: process.env.SESSION_SECRET, 
  resave: false, 
  saveUninitialized: true 
}));

app.use('/', rotas);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}\nhttp://localhost:${port}`);
});
