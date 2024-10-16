module.exports=(url,token)=>{


    return`<!DOCTYPE html>
    <html lang="pt-br">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Recuperação de Senha</title>
        <link rel="stylesheet" href="/css/recuperarsenha.css">
    
    </head>
    
    <body>
        <nav class="container">
            <h2>Recuperar Senha</h2>
            <form action="/recuperarsenha" method="POST">
                <label for="email">Digite seu e-mail:</label>
                <input type="email" id="email" name="email" required>
                <a href="$("pages/resetarsenha")/resetarsenha?$(token)" class="button">Enviar link de recuperação </a>
            </form>
            <p class="message">Você receberá um e-mail com instruções para redefinir sua senha.</p>
        </nav>
        <script src="server.js"></script>
    </body>
    </html>
}