const nodemailer = require('nodemailer');
const mysql = require('mysql2');

// Set up MySQL connection
const db = mysql.createConnection({
    host: 'bidvquas07dy64qsdag8-mysql.services.clever-cloud.com ',
    user: 'uusrgp7hb44r6oln', // substitua pelo seu usuário do MySQL
    password: 'TmmSqt4IlYxivD5pw8Vt', // substitua pela sua senha do MySQL
    database: 'bidvquas07dy64qsdag8' // nome do seu banco de dados
});

// Testar a conexão com o banco de dados
db.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conexão ao banco de dados estabelecida.');
});

// Configuração do Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Seu e-mail
        pass: process.env.EMAIL_PASS  // Sua senha, ou senha configurada para App password
    },
    tls: {
        secure: false,
        ignoreTLS: true,
        rejectUnauthorized: false, // ignorar certificado digital - APENAS EM DESENVOLVIMENTO
    }
});

function enviarEmail(to, subject, text = null, html = null, callback) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
        html
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Erro ao enviar e-mail:', error);
        } else {
            console.log("Email enviado:", info.response);
            if (callback && typeof callback === 'function') {
                callback();
            }
        }
    });
}

// Exemplo de como usar a função de envio de e-mail
db.query('SELECT EMAIL_CLIENTE FROM CLIENTE WHERE ID_CLIENTE = ?', [1], (err, results) => {
    if (err) {
        console.error('Erro ao buscar cliente:', err);
        return;
    }

    if (results.length > 0) {
        const email = results[0].EMAIL_CLIENTE;
        enviarEmail(email, 'Assunto do Email', 'Corpo do email em texto simples', '<h1>Corpo do email em HTML</h1>', () => {
            console.log('Email foi enviado com sucesso!');
        });
    } else {
        console.log('Nenhum cliente encontrado.');
    }
});

// Exportar a função, se necessário
module.exports = { enviarEmail };
