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
app.post('/cadastrocliente', async (req, res) => {
    const { nome_cliente, cpf_cliente, cidade_cliente, estados, email_cliente, contato_cliente, senha_cliente, confirmar_senha_cliente } = req.body;
    
    // Validações
    let errors = [];

    if (!nome_cliente) {
        errors.push({ field: 'nome_cliente', message: 'Nome Completo é obrigatório.' });
    }

    if (!cpf_cliente) {
        errors.push({ field: 'cpf_cliente', message: 'CPF é obrigatório.' });
    }

    if (!cidade_cliente) {
        errors.push({ field: 'cidade_cliente', message: 'Cidade é obrigatória.' });
    }

    if (!estados) {
        errors.push({ field: 'estados', message: 'Estado é obrigatório.' });
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

    try {
        const [rows] = await pool.query(
            'INSERT INTO clientes (nome, cpf, cidade, estado, email, contato, senha) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [nome_cliente, cpf_cliente, cidade_cliente, estados, email_cliente, contato_cliente, senha_cliente]
        );
        res.status(200).json({ mensagem: 'Cadastro realizado com sucesso!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ errors: [{ field: 'general', message: 'Erro ao salvar os dados no banco de dados.' }] });
    }
});

app.post('/cadastroprof', async (req, res) => {
    const { nome_cliente, cpf_cliente, cidade_cliente, estados, email_cliente, contato_cliente, senha_cliente, confirmar_senha_cliente } = req.body;
    
    // Validações
    let errors = [];

    if (!nome_cliente) {
        errors.push({ field: 'nome_cliente', message: 'Nome Completo é obrigatório.' });
    }

    if (!cpf_cliente) {
        errors.push({ field: 'cpf_cliente', message: 'CPF é obrigatório.' });
    }

    if (!cidade_cliente) {
        errors.push({ field: 'cidade_cliente', message: 'Cidade é obrigatória.' });
    }

    if (!estados) {
        errors.push({ field: 'estados', message: 'Estado é obrigatório.' });
    }

    if (!email_cliente) {
        errors.push({ field: 'email_cliente', message: 'Email é obrigatório.' });
    }

    if (!contato_cliente) {
        errors.push({ field: 'contato_cliente', message: 'Contato é obrigatório.' });
    }

    if (!contato_cliente) {
        errors.push({ field: 'contato_cliente', message: 'Campo obrigatório.' });
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

    try {
        const [rows] = await pool.query(
            'INSERT INTO clientes (nome, cpf, cidade, estado, email, contato, senha) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [nome_cliente, cpf_cliente, cidade_cliente, estados, email_cliente, contato_cliente, senha_cliente]
        );
        res.status(200).json({ mensagem: 'Cadastro realizado com sucesso!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ errors: [{ field: 'general', message: 'Erro ao salvar os dados no banco de dados.' }] });
    }
});

const validarOrcamento = (dados) => {
    const { estado, cidade, servico, detalhe, valor } = dados;
    let errors = [];

    if (!estado) {
        errors.push({ field: 'estado', message: 'Estado é obrigatório.' });
    }

    if (!cidade) {
        errors.push({ field: 'cidade', message: 'Cidade/CEP é obrigatório.' });
    }

    if (!servico) {
        errors.push({ field: 'servico', message: 'Serviço é obrigatório.' });
    }

    if (!detalhe) {
        errors.push({ field: 'detalhe', message: 'Detalhe do serviço é obrigatório.' });
    }

    if (!valor) {
        errors.push({ field: 'valor', message: 'Valor esperado é obrigatório.' });
    }

    return errors;
}

app.post('/orcamento', async (req, res) => {
    const { estado, cidade, servico, detalhe, valor } = req.body;

    const errors = validarOrcamento(req.body);

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    try {
        const [rows] = await pool.query(
            'INSERT INTO orcamentos (estado, cidade, servico, detalhe, valor) VALUES (?, ?, ?, ?, ?)',
            [estado, cidade, servico, detalhe, valor]
        );
        res.status(200).json({ mensagem: 'Orçamento enviado com sucesso!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ errors: [{ field: 'general', message: 'Erro ao salvar os dados no banco de dados.' }] });
    }
});


app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}\nhttp://localhost:${port}`);
});
