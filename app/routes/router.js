var express = require("express");
var router = express.Router();

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

const feedbackModel = require("../models/feedbackModel.js")


// const cliente = require("../models/clienteModel");
// const profissional = require("../models/profissionaisModel");
// const admModel = require("../models/admModel");
// const uploadFile = require("../util/uploader.js")("./app/public/imagens/imgperfil");
const uploadFile = require("../util/uploader.js")("./app/public/imagens/imgperfil/");
// const uploadfile = require("../util/uploader")();

const orcamentoController = require('../controllers/orcamentoController.js');

const {
} = require("../models/autenticadormiddleware.js");

const projetosreController = require("../controllers/projetosreController.js");

const verificarProfAutorizado = require("../models/verificarProfAutorizado.js");


const {
    verificarClienteAutenticado,
    verificarClienteAutorizado,
    gravarClienteAutenticado
} = require("../models/autenticadormiddleware.js");

// Mercado Pago
const { MercadoPagoConfig, Preference } = require('mercadopago');
const { PedidoController } = require("../controllers/PedidoController");
const pool_conexoes = require("../../config/pool_conexoes.js");



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

router.get('/orcprof', (req, res) => {
    orcamentoController.listaOrcamentoProf(req,res)
});

router.get('/listaClienteorc', (req, res) => {
    orcamentoController.listaOrcamentoCliente(req,res)
});


// router.get("/excluir", function (req, res) {
//     projetosreController.excluirprojeto(req, res);
// });

// router.get("/finalizar", function (req, res) {
//     projetosreController.finalizarprojeto(req, res);
// });

router.get('/updateorc', (req, res) => {
    let id=req.query.id_orcamento
   res.render('pages/updateorc', {campos:{id_orcamento:id}}) 
});


router.get('/pagamento', (req, res) => {
    res.render('pages/pagamento');
});

router.get('/comissao', (req, res) => {
    res.render('pages/comissao');
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

router.get('/orcamento', verificarClienteAutorizado([1],'pages/entrar'), (req, res) => {
    orcamentoController.solicitarOrcamento(req, res);
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

router.get('/orcamento/:id', (req, res) => {
    const idOrcamento = req.params.id;

    // Aqui, você deve pegar o orçamento do banco de dados
    // Exemplo de consulta (com pool ou qualquer método que você use):
    pool.query('SELECT * FROM orcamentos WHERE ID_ORCAMENTO = ?', [idOrcamento], (err, results) => {
        if (err) {
            return res.status(500).send('Erro ao buscar orçamento');
        }
        // Supondo que você tenha um único orçamento
        const orcamento = results[0];
        res.render('detalhesOrcamento', { orcamento });
    });
});

// router.get('/verdetalhe', async (req, res) => {
//     const { id_orcamento } = req.query;

//     try {
//         const orcamento = await orcamentoController.buscarOrcamentoPorId(id_orcamento);
//         res.render('verdetalhe', { orcamento });  // Passa os dados para o template
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Erro ao buscar orçamento');
//     }
// });

router.get('/detalheProfissional', (req, res) => {
    res.render('pages/detalheProfissional');
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


// router.get("/recuperar-senha", verificarClienteAutenticado, function (req, res) {
//     res.render("pages/recsenha", { listaErros: null, dadosNotificacao: null });
// });

// router.post("/recuperar-senha",
//     verificarClienteAutenticado,
//     clienteController.regrasValidacaoFormRecSenha,
//     function (req, res) {
//         clienteController.recuperarSenha(req, res);
//     });


// router.get("/resetarsenha",
//     function (req, res) {
//         clienteController.validarTokenNovaSenha(req, res);
//     });

// router.post("/resetarenha",
//     // clienteController.regrasValidacaoFormNovaSenha,
//     function (req, res) {
//         clienteController.resetarSenha(req, res);
//     });



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
    uploadFile("file-input"), // Middleware para upload de imagem
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
    // uploadFile("imagem-perfil_cliente" ),(
    // clienteController.regrasValidacaoPerfil,
    // verificarClienteAutorizado([1, 2, 3], "pages/cadastrocliente"),
    // async function (req, res) {
    //     clienteController.gravarPerfil(req, res);
    // });


router.get(
    "/perfilcliente",
    verificarClienteAutorizado([1, 2, 3], "pages/cadastrocliente"), // Verificação de autorização
    async (req, res) => {
        try {
            // Chama o controlador para exibir o perfil do cliente
            await clienteController.mostrarPerfil(req, res);
        } catch (err) {
            console.error("Erro ao exibir perfil:", err);
            res.status(500).send("Erro ao exibir perfil.");
        }
    }
);


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

router.post('/aprovar-orcamento/:id_orcamento',(req,res) => {
    orcamentoController.aceitarOrcamentoCliente(req, res)
});

router.post('/updateorc', (req,res)=>{
    orcamentoController.atualizarOrcamento(req,res)
  });

router.post(
    "/perfilprof",
    uploadFile("inputArquivo"),
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


module.exports = router;
