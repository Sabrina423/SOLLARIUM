const express = require("express");
const session = require("express-session");
const dotenv = require("dotenv");

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

const app = express();
const port = 3001; // Porta alterada para 3001

app.use(express.static("./app/public"));

app.set("view engine", "ejs");
app.set("views", "./app/views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração da sessão
app.use(session({
  secret: process.env.SESSION_SECRET, // Use uma variável de ambiente para o segredo da sessão
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Defina como true se estiver usando HTTPS
}));

var rotas = require("./app/routes/router");
app.use("/", rotas);

app.listen(port, () => {
  console.log(`Servidor online: http://localhost:3000` );
});
