const { validationResult } = require("express-validator")

recuperarSenha: async (req,res)=>{
    const erros= validationResult(req);
    console.log(erros);
    if(!erros. isEmpty()){
        return res.render ("/pages/recuperarsenha",{
            listaErros: erros,
            dadosNotificacao: null,
            valores: req.body,

        }

        )
    }

    try{
        user= await cliente.findusercostum({
        email_cliente: req.body.email_cliente,
        });

        const token = jwt.sign(
           { clientId: user[0].id_cliente, expiresIn: "4om"},
           process.env.SECRET_KEY
        );

        html= require("../controllers/email-reset-senha")(process.env.URL_BASE, token)
        enviarEmail(req.body.email_cliente, "Pedido de recuperação de senha", null, html, ()=>{
            return res.render("pages/index",{
                listaErros: null,
                autenticado: req.session.autenticado,
                dadosNotificacao: {
                    titulo:"Recuperação de senha",
                    mensagem: "Enviamos um email com as instruções para resetar sua senha",
                    tipo: "success",

            },
            });
        });
     } catch (e){
                console.log (e);
            }
        }