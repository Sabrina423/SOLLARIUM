document.getElementById('cadastroForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = {
        nome_cliente: document.getElementById('nome_cliente').value,
        cpf_cliente: document.getElementById('cpf_cliente').value,
        endereco_cliente: document.getElementById('endereco_cliente').value,
        contato_cliente: document.getElementById('contato_cliente').value,
        email_cliente: document.getElementById('email_cliente').value,
        senha_cliente: document.getElementById('senha_cliente').value,
        confirmar_senha_cliente: document.getElementById('confirmar_senha_cliente').value,
        estado_cliente:document.getElementById('O campo é obrogatório').value,
    };

    document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');

    let isValid = true;

    if (!formData.nome_cliente) {
        showError('nome_cliente', 'Nome Completo é obrigatório.');
        isValid = false;
    }

    if (!formData.cpf_cliente || !/^\d{11}$/.test(formData.cpf_cliente)) {
        showError('cpf_cliente', 'O CPF deve ter 11 dígitos e conter apenas números.');
        isValid = false;
    }

    if (!formData.cep_cliente) {
        showError('endereco_cliente', 'Endereço é obrigatório.');
        isValid = false;
    }

    if (!formData.email_cliente || !/\S+@\S+\.\S+/.test(formData.email_cliente)) {
        showError('email_cliente', 'Email é obrigatório e deve ser válido.');
        isValid = false;
    }

    if (!formData.contato_cliente || !/^\d{10,15}$/.test(formData.contato_cliente)) {
        showError('contato_cliente', 'O contato deve ter entre 10 e 15 dígitos e conter apenas números.');
        isValid = false;
    }

    if (!formData.senha_cliente || formData.senha_cliente.length < 8) {
        showError('senha_cliente', 'A senha deve ter no mínimo 8 caracteres.');
        isValid = false;
    }

    if (formData.senha_cliente !== formData.confirmar_senha_cliente) {
        showError('confirmar_senha_cliente', 'As senhas não coincidem.');
        isValid = false;
    }

    if (!isValid) return;

    try {
        const response = await fetch('/cadastrocliente', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.status === 200) {
            document.getElementById('success-message').innerText = result.message;
            document.getElementById('cadastroForm').reset();
        } else {
            result.errors.forEach(error => {
                showError(error.field, error.message);
            });
        }
    } catch (error) {
        console.error('Erro ao enviar os dados:', error);
    }
});
function showMessage() {
    document.getElementById('message').style.display = 'block';
}

function hideMessage() {
    document.getElementById('message').style.display = 'none';
}

function validatePassword() {
    const password = document.getElementById('password').value;
    const message = document.getElementById('message');
    if (password.length >= 8) {
        message.textContent = 'A senha deve ter no mínimo 8 caracteres.';
        message.className = 'valid';
    } else {
        message.textContent = 'A senha deve ter no mínimo 8 caracteres.';
        message.className = 'invalid';
    }
}
function showError(field, message) {
    const errorElement = document.querySelector(`#${field} ~ .error-message`);
    // console.log(message);
    //errorElement.innerText = message;
    //errorElement.style.display = 'block';
}