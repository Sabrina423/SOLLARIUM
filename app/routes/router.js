var express = require("express");
var router = express.Router();

router.get("/", function (req,res){
    res.render ("pages/home");
});
router.get("html", function (req,res){
    res.render ("pages/cadastrocliente");
});
router.get("html", function (req,res){
    res.render("/");
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