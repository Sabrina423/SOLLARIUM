const express = require("express");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer'); // Importar o nodemailer
require('dotenv').config(); // Carregar variáveis de ambiente

const clienteController = require('../controllers/clienteController.js');
const profissionaisController = require('../controllers/profissionaisController.js');
const admController = require('../controllers/admController.js');
const cliente = require("../models/clienteModel.js");
const profissional = require("../models/profissionaisModel.js");
const admModel = require("../models/admModel.js");

const uploadFile = require("../util/uploader.js")("./app/public/imagens/imgperfil/");
const cliente = require("../models/clienteModel");
const profissional = require("../models/profissionaisModel");
const admModel = require("../models/admModel");
const uploadFile = require("../util/uploader.js")("./app/public/imagens/imgperfil");
// const uploadfile = require("../util/uploader")();

const orcamentoController = require('../controllers/orcamentoController.js');


const projetosreController = require("../controllers/projetosreController.js");

const verificarProfAutorizado = require("../models/verificarProfAutorizado.js");


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
const mercadoPagoCliente = new MercadoPagoConfig({
    accessToken: process.env.acessToken
});

require('dotenv').config(); // Carregar variáveis de ambiente

console.log("Chave Secreta:", process.env.JWT_SECRET); // Debug

const secretKey = process.env.JWT_SECRET || 'site'; // Usar chave padrão




// Rotas
router.get('/', verificarClienteAutenticado, (req, res) => {
    res.render('pages/home', { autenticado: req.session.autenticado });
});

router.get('/entrar', (req, res) => {
    res.render('pages/entrar', { dadosNotificacao: null });
});

router.get('/cadastrocliente', verificarClienteAutenticado, (req, res) => {
    res.render('pages/cadastrocliente', { autenticado: req.session.autenticado });
});

router.get('/cadastroinicial', (req, res) => {
    res.render('pages/cadastroinicial');
});

router.get('/dashboard', (req, res) => {
    const tarefas = [
        { nome_projetos: 'Projeto A', data_projetos: '2024-10-23', valor_projetos: 1500 },
        { nome_projetos: 'Projeto B', data_projetos: '2024-10-22', valor_projetos: 2000 }
    ];
    res.render('pages/dashboard', { tarefas });
});
router.get("/excluir", function (req, res) {
    projetosreController.excluirprojeto(req, res);
});

router.get("/finalizar", function (req, res) {
    projetosreController.finalizarprojeto(req, res);
});

router.get('/pagamentosre', (req, res) => {
    res.render('pages/pagamentosre');
});

router.get('/comissaore', (req, res) => {
    res.render('pages/comissaore');
});


router.get('/cadastrocartao', (req, res) => {
    res.render('pages/cadastrocartao');
});


router.get('/sobre', (req, res) => {
    res.render('pages/sobre');
});


router.get('/cadastroprof', (req, res) => {
    res.render('pages/cadastroprof');
});

router.get('/orcamento', verificarClienteAutorizado([1], 'pages/entrar'), (req, res) => {
    res.render('pages/orcamento');
});

router.get('/recsenha', (req, res) => {
    res.render('pages/recsenha', { listaErros: null, dadosNotificacao: null, msgErro: null });
});

router.get('/resetarsenha', (req, res) => {
    res.render('pages/resetarsenha', { listaErros: null, dadosNotificacao: null, msgErro: null });
});

router.get('/perfilprof', (req, res) => {
    res.render('pages/perfilprof');
    profissionaisController.mostrarPerfil(req, res);
});


router.get('/feedback', (req, res) => {
    res.render('pages/feedback');
});

router.get('/adm', (req, res) => {
    res.render('pages/adm');
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


router.get("/recuperar-senha", verificarClienteAutenticado, function (req, res) {
    res.render("pages/recsenha", { listaErros: null, dadosNotificacao: null });
});

router.post("/recuperar-senha",
    verificarClienteAutenticado,
    clienteController.regrasValidacaoFormRecSenha,
    function (req, res) {
        clienteController.recuperarSenha(req, res);
    });


router.get("/resetarsenha",
    function (req, res) {
        clienteController.validarTokenNovaSenha(req, res);
    });

router.post("/resetarenha",
    // clienteController.regrasValidacaoFormNovaSenha,
    function (req, res) {
        clienteController.resetarSenha(req, res);
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
router.post(
    "/perfilcliente",
    uploadFile("imagem-perfil_cliente"), // Middleware para upload de imagem
    clienteController.regrasValidacaoPerfil, // Validação dos campos do perfil
    verificarClienteAutorizado([1, 2, 3], "pages/cadastrocliente"), // Verificação de autorização
    async (req, res) => {
        try {
            // Chama o controlador para gravar o perfil após passar pelos middlewares
            await clienteController.gravarPerfil(req, res); 
        } catch (err) {
            console.error("Erro ao gravar perfil:", err);
            res.status(500).send("Erro ao gravar perfil.");
        }
    }
);

    uploadFile("imagem-perfil_cliente"),
    clienteController.regrasValidacaoPerfil,
    verificarClienteAutorizado([1, 2, 3], "pages/cadastrocliente"),
    async function (req, res) {
        clienteController.gravarPerfil(req, res);
    });

router.get(
    "/perfilcliente",
    verificarClienteAutorizado([1, 2, 3], "pages/cadastrocliente"),
    async function (req, res) {
        clienteController.mostrarPerfil(req, res);
    }
)

router.post("/cadastrocliente", clienteController.regrasValidacaoFormCad, async (req, res) => {
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
    clienteController.logar(req, res)
});

router.post("/orcamento", orcamentoController.regrasValidacaoFormOrcamento, (req, res) => {
    // Presumindo que o login foi bem-sucedido e as informações do usuário estão na req.user
    orcamentoController.cadastrarOrcamento(req, res)


});

router.post(
    "/perfilprof",
    uploadFile("imagem-perfil_prof"),
    profissionaisController.regrasValidacaoPerfil,
    // verificarProfAutorizado([1, 2, 3], "pages/cadastroprof"),
    async function (req, res) {
        profissionaisController.gravarPerfil(req, res);
    });

router.get(
    "/perfilprof",
    verificarProfAutorizado([1, 2, 3], "pages/cadastroprof"),
    async function (req, res) {
        profissionaisController.mostrarPerfil(req, res);
    }
);

// Exportando o router

module.exports = router;
