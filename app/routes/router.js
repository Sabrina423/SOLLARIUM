var express = require("express");
var router = express.Router();

router.get("/", function (req,res){
    res.render ("pages/home");
});
router.get("/soucliente", function (req,res){
    res.render ("pages/soucliente");
});
router.get("/souprofissional", function (req,res){
    res.render ("pages/souprofissional",{nome:valor});
});
router.get("html", function (req,res){
    res.render("pages/cadastroprof");
});
router.get("/cadastrocliente", function (req,res){
    res.render ("pages/cadastrocliente");
});



module.exports = router;