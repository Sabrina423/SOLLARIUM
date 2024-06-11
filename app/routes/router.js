var express = require("express");
var router = express.Router();

router.get("/", function (req,res){
    res.render ("pages/home");
});
router.get("/soucliente", function (req,res){
    res.render ("pages/soucliente");
});
router.get("/souprofissional", function (req,res){
    res.render ("pages/souprofissional");
});
router.get("html", function (req,res){
    res.render("pages/cadastroprof");
});
router.get("/cadastrocliente", function (req,res){
    res.render ("pages/cadastrocliente");
});

router.get("/jquery", function (req,res){
    res.render("/");
});
router.get("/jquery", function (req,res){
    res.render("/");
});
router.post("html", function (req, res){
    res.json(req.body);
});
router.post("/jquery", function (req, res){
    console.log(req.body);
});

module.exports = router;