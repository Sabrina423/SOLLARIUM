const express = require("express");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer'); // Importar o nodemailer
require('dotenv').config(); // Carregar variáveis de ambiente

const clienteController = require('../controllers/clienteController.js');
const profissionaisController = require('../controllers/profissionaisController.js');
const admController = require('../controllers/admController.js');
const cliente = require("../models/clienteModel");
const profissional = require("../models/profissionaisModel");
const admModel = require("../models/admModel");
const uploadFile = require("../util/uploader.js")("./app/public/imagens/imgperfil");
const orcamentoController = require('../controllers/orcamentoController.js');
function validateEmail(email) {
    const errors = [];
    if (!email) {
        errors.push({ path: "email_cliente", msg: "O e-mail é obrigatório." });
    }
    return errors.length > 0 ? { errors } : {};
}

const {
    verificarClienteAutenticado,
    verificarClienteAutorizado,
    gravarClienteAutenticado
} = require("../models/autenticadormiddleware.js");

const router = express.Router();
// Mercado Pago
const { MercadoPagoConfig, Preference } = require('mercadopago');
const { PedidoController } = require("../controllers/PedidoController");


// credenciais
const MercadoPagoCliente = new MercadoPagoConfig({
    accessToken: process.env.acessToken
});


require('dotenv').config(); // Carregar variáveis de ambiente

console.log("Chave Secreta:", process.env.JWT_SECRET); // Debug

const secretKey = process.env.JWT_SECRET || 'site'; // Usar chave padrão


// middleware de Autenticação
const authenticateToken = (req, res, next) => {
    const token = req.session.token;
    if (!token) return res.redirect('/');
    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.redirect('/');
        req.user = user;
        next();
    });
};

// Rotas
router.get('/', verificarClienteAutenticado, (req, res) => {
    res.render('pages/home', { autenticado: req.session.autenticado });
});

router.get('/entrar', (req, res) => {
    res.render('pages/entrar', { dadosNotificacao: null });
});

router.get('/cadastrocliente', verificarClienteAutenticado, (req, res) => {
    res.render('pages/cadastrocliente' , { autenticado: req.session.autenticado });
});

router.get('/cadastroinicial',  (req, res) => {
    res.render('pages/cadastroinicial');
});

router.get('/projetosre',  (req, res) => {
    res.render('pages/projetosre');
});


router.get("/excluir", function (req, res) {
    projetosreController.excluirprojeto(req, res);
  });
  
  router.get("/finalizar", function (req, res) {
    projetosreController.finalizarprojeto(req, res);
  });

router.get('/pagamentosre',  (req, res) => {
    res.render('pages/pagamentosre');
});

router.get('/comissaore',  (req, res) => {
    res.render('pages/comissaore');
});


router.get('/cadastrocartao',  (req, res) => {
    res.render('pages/cadastrocartao');
});


router.get('/sobre', (req, res) => {
    res.render('pages/sobre');
});

router.get('/perfilcliente', verificarClienteAutenticado, (req, res) => {

    clienteController.mostrarPerfil(req, res);
});

router.get('/cadastroprof', (req, res) => {
    res.render('pages/cadastroprof');
});

router.get('/orcamento', verificarClienteAutorizado([1],'pages/entrar'), (req, res) => {
    res.render('pages/orcamento');
});

router.get('/recsenha', (req, res) => {
    res.render('pages/recsenha', {listaErros: null,dadosNotificacao: null, msgErro: null});
});

router.get('/resetarsenha', (req, res) => {
    res.render('pages/resetarsenha', {listaErros: null,dadosNotificacao: null, msgErro: null});
});

<<<<<<< HEAD
router.get('/perfilprof', verificarClienteAutorizado, (req, res) => {
    res.render('pages/perfilprof');
});
=======
>>>>>>> 7d7a44d (cimm)


router.get('/feedback',  (req, res) => {
    res.render('pages/feedback');
});

router.get('/adm',  (req, res) => {
    res.render('pages/adm');
});


// credenciais
const mercadoPagoCliente = new MercadoPagoConfig({
    accessToken: process.env.acessToken
});

router.post("/createpreference", function (req, res) {
    const preference = new Preference(mercadoPagoCliente);
    console.log(req.body.items);
    preference.create({
        body: {
            items: req.body.items,
            back_urls: {
                "success": process.env.URL_BASE + "/feedback",
                "failure": process.env.URL_BASE + "/feedback",
                "pending": process.env.URL_BASE + "/feedback"
            },
            auto_return: "approved",
        }
    })
    .then((value) => {
        res.json(value);
    })
    .catch(console.log);
});

router.get("/feedback", function (req, res) {
    PedidoController.gravarpedido(req, res);
});

const pool = require('/workspaces/SOLLARIUM/config/pool_conexoes');
const projetosreController = require("../controllers/projetosreController.js");

router.post('/recsenha', async (req, res) => {
    const email = req.body.email;

    // Validação do e-mail
    const listaErros = validateEmail(email);
    if (listaErros.errors) {
        console.log(listaErros);
        return res.render('pages/recsenha', {
            listaErros: listaErros,
            dadosNotificacao: null // ou qualquer outra variável necessária
        }); 
    }

    // Verifica se o e-mail está cadastrado no banco de dados
    pool.query('SELECT * FROM CLIENTE WHERE EMAIL_CLIENTE = ?', [email], async (err, results) => {
        if (err) {
            console.error('Erro ao consultar o banco de dados:', err);
            return res.status(500).send('Erro ao consultar o banco de dados.');
        }
        
        // Se não encontrar resultados, retorna um erro
        if (results.length === 0) {
            
            console.error('E-mail não cadastrado');
            return res.status(404).send('E-mail não cadastrado.');
        }

        // Se o e-mail estiver cadastrado, gera o token
        const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Recuperação de Senha',
            html: `Clique no link para redefinir sua senha: https://congenial-barnacle-5gx456xjgv7w249gr-3000.app.github.dev/resetarsenha${token}`
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },  tls: {
                secure: false,
                ignoreTLS: true,
                rejectUnauthorized: false, // ignorar certificado digital - APENAS EM DESENVOLVIMENTO
            }
        });

        // Enviar email
        try {
            await transporter.sendMail(mailOptions);
            console.log('Email enviado com sucesso para:', email);
            // res.send('Email de recuperação enviado.');
            console.log("enviou")
        } catch (error) {
            console.error('Erro ao enviar email:', error);
            // return res.status(500).send('Erro ao enviar o email.');
            console.log("não enviou")
        
        }
    });
       
    });


router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Erro ao fazer logout');
        }
        res.sendStatus(200); // Sucesso
    });
});


//Rota de registro cliente
router.post (
    "/perfilcliente",
    uploadFile("imagem-perfil_cliente"),
    clienteController.regrasValidacaoPerfil,
    verificarClienteAutorizado( [1, 2, 3], "pages/cadastrocliente"),
    async function (req, res) {
        clienteController.gravarPerfil(req, res);
    });
router.get (
    "/perfilcliente",
    verificarClienteAutorizado( [1, 2, 3], "pages/cadastrocliente"),
    async function (req, res) {
        clienteController.mostrarPerfil(req, res);
    }
)        

router.post("/cadastrocliente", clienteController.regrasValidacaoFormCad, async (req, res) => {
    console.log('erro')
    clienteController.cadastrar(req, res);
});

// Rota de registro profissional
router.post("/cadastroprof", profissionaisController.regrasValidacaoFormCad, async (req, res) => {
    profissionaisController.cadastrar(req, res);
});

// Rota de registro admin
router.post("/adm", admController.regrasValidacaoFormCad, async (req, res) => {
    admController.cadastrar(req, res);
});

// Rota de Login
router.post("/entrar", clienteController.regrasValidacaoFormLogin, gravarClienteAutenticado, (req, res) => {
    // Presumindo que o login foi bem-sucedido e as informações do usuário estão na req.user
  clienteController.logar(req,res)
});

router.post("/orcamento", orcamentoController.regrasValidacaoFormOrcamento, (req, res) => {
    // Presumindo que o login foi bem-sucedido e as informações do usuário estão na req.user
  orcamentoController.cadastrarOrcamento(req,res)

  
});

router.post (
    "/perfilprof",
    uploadFile("imagem-perfil_prof"),
    profissionaisController.regrasValidacaoPerfil,
<<<<<<< HEAD
    verificarClienteAutorizado( [1, 2, 3], "pages/cadastroprof"),
=======
    verificarProfAutorizado( [1, 2, 3], "pages/cadastroprof"),
>>>>>>> 7d7a44d (cimm)
    async function (req, res) {
        profissionaisController.gravarPerfil(req, res);
    });
router.get (
    "/perfilprof",
    verificarClienteAutorizado( [1, 2, 3], "pages/cadastroprof"),
    async function (req, res) {
        profissionaisController.mostrarPerfil(req, res);
    }
)        

// Exportando o router

module.exports = router;
