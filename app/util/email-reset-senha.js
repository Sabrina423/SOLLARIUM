module.exports = (url, token)=>{

    return ` <!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recuperação de Senha</title>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Recuperação de Senha</h1>
        </div>
        <div class="content">
            <p>Recebemos uma solicitação para redefinir sua senha. Clique no botão abaixo para redefinir sua senha:</p>
          <a href="$("pages/resetarsenha")/resetarsenha?$(token)" class="button">Enviar link de recuperação </a>
        </div>
        <div class="footer">
            <p>Se você não solicitou esta alteração, por favor ignore este email.</p>
        </div>
    </div>
</body>
</html>`
    
    }