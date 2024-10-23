module.exports = (url, token)=>{

    return ` <!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recuperação de Senha</title>
</head>
<body>
    <nav class="container">
        <nav class="header">
            <h1>Recuperação de Senha</h1>
        </nav>
        <nav class="content">
            <p>Recebemos uma solicitação para redefinir sua senha. Clique no botão abaixo para redefinir sua senha:</p>
          <a href="$("pages/resetarsenha")/resetarsenha?$(token)" class="button">Enviar link de recuperação </a>
        </nav>
        <nav class="footer">
            <p>Se você não solicitou esta alteração, por favor ignore este email.</p>
        </nav>
    </nav>
</body>
</html>`
    
    }