require('dotenv').config(); // Carregar variáveis de ambiente
const express = require('express');
const session = require('express-session');
const pool = require('./config/pool_conexoes'); // Certifique-se de que este caminho está correto
const rotas = require('./app/routes/router'); // Certifique-se de que este caminho está correto

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

// Rota de cadastro de cliente com validação
app.post('/cadastrocliente', (req, res) => {
    const { nome_cliente, cpf_cliente, endereco_cliente, email_cliente, contato_cliente, senha_cliente, confirmar_senha_cliente } = req.body;
    
    // Validações
    let errors = [];

    if (!nome_cliente) {
        errors.push({ field: 'nome_cliente', message: 'Nome Completo é obrigatório.' });
    }

    if (!cpf_cliente) {
        errors.push({ field: 'cpf_cliente', message: 'CPF é obrigatório.' });
    }

    if (!endereco_cliente) {
        errors.push({ field: 'endereco_cliente', message: 'Endereço é obrigatório.' });
    }

    if (!email_cliente) {
        errors.push({ field: 'email_cliente', message: 'Email é obrigatório.' });
    }

    if (!contato_cliente) {
        errors.push({ field: 'contato_cliente', message: 'Contato é obrigatório.' });
    }

    if (!senha_cliente || senha_cliente.length < 8) {
        errors.push({ field: 'senha_cliente', message: 'A senha deve ter no mínimo 8 caracteres.' });
    }

    if (senha_cliente !== confirmar_senha_cliente) {
        errors.push({ field: 'confirmar_senha_cliente', message: 'As senhas não coincidem.' });
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    // Aqui você pode adicionar o código para salvar os dados no banco de dados

    res.status(200).json({ mensagem: 'Cadastro realizado com sucesso!' });
});

app.listen(port, () => {
    console.log('Servidor rodando na porta ${port}\nhttp://localhost:${port}');
});

