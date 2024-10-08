const relatorioModel = require("../models/relatorioModel");
const moment = require("moment");
const{body,validationResult} = require("express-validator");
const relatorioController = {
    regrasValidacao:[
        body("tarefa")
      .isLength({ min: 5, max: 45 })
      .withMessage("Nome da Tarefa deve conter de 5 a 45 letras!"),
        body("prazo").isISO8601(),
        body("situacao").isNumeric(),
    ],
    listarrelatorioPaginadas: async (req, res) => {
        res.locals.moment = moment;
        try {
          results = await relatorioModel.findAll();
          res.render("pages/relatorio", { relatorio: results });
        } catch (e) {
          console.log(e); // exibir os erros no console do vs code
          res.json({ erro: "Falha ao acessar dados" });
        }
},

    adicionarrelatorio: async (req, res) => {
        res.locals.moment = moment;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        console.log(errors);
        return res.render("pages/adicionar", {
            dados: req.body,
            listaErros: errors,
        });
        }
        var dadosForm = {
        nome_relatorio: req.body.relatorio,
        prazo_relatorio: req.body.prazo,
        situacao_relatorio: req.body.situacao,
        };
        let id_relatorio = req.body.id_relatorio;
        try {
            if(id_relatorio==""){
                results = await relatorioModel.create(dadosForm);
            }else{
                results = await relatorioModel.update(dadosForm,id_relatorio);
            }
        res.redirect("/");
        } catch (e) {
        console.log(e);
        res.json({ erro: "Falha ao acessar dados" });
        }
    },

    excluirrelatorio: async (req, res) => {
        let { id } = req.query;
        try {
        results = await relatorioModel.delete(id);
        res.redirect("/");
        } catch (e) {
        console.log(e);
        res.json({ erro: "Falha ao acessar dados" });
        }
    },

    finalizarrelatorio: async (req, res) => {
        let { id } = req.query;
        try {
        results = await relatorioModel.sistuacaorelatorio(2, id);
        res.redirect("/");
        } catch (e) {
        console.log(e);
        res.json({ erro: "Falha ao acessar dados" });
        }
    },

    exibirrelatorioId: async (req, res) => {
        res.locals.moment = moment;
        let { id } = req.query;
        console.log(id);
        try {
        let relatorio = await relatorioModel.findId(id);
        res.render("pages/adicionar", {
            dados: {
            id_relatorio: id,
            relatorio: relatorio[0].nome_relatorio,
            prazo: relatorio[0].prazo_relatorio,
            situacao: relatorio[0].situacao_relatorio,
            },
            listaErros: null,
        });
        } catch (e) {
        console.log(e);
        res.json({ erro: "Falha ao acessar dados" });
        }
    },

    iniciarrelatorio: async (req, res) => {
        let { id } = req.query;
        try {
        results = await relatorioModel.sistuacaorelatorio(1, id);
        res.redirect("/");
        } catch (e) {
        console.log(e);
        res.json({ erro: "Falha ao acessar dados" });
        }
    },
    };

    function formatCurrency(value) {
        return value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    }
    
    exports.showTransaction = (req, res) => {
        const amount = 12345.67; // Isso pode vir de uma requisição ou banco de dados
        res.render('index', { amount: formatCurrency(amount) });
    };
    

module.exports = relatoriosController;
