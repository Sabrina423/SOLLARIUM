document.getElementById('cadastroFormprof').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = {
        nome_prof: document.getElementById('nome_prof').value,
        
        
        
        
        _prof: document.getElementById('cpf_prof').value,
        email_prof: document.getElementById('email_prof').value, 
        contato_prof: document.getElementById('telefone_prof').value,
        senha_prof: document.getElementById('senha_prof').value,
        confimasenha_prof: document.getElementById('confimasenha_prof').value,
        estado_cliente: document.getElementById('estado_cliente').value,
        area_prof: document.getElementById('area_prof').value,
        experiencia_prof: document.getElementById('experiencia_prof').value,
    };

    document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');

    let isValid = true;

    if (!formData.nome_prof) {
        showError('nome_prof', 'Nome Completo é obrigatório.');
        isValid = false;
    }

    if (!formData.cpf_prof || !/^\d{11}$/.test(formData.cpf_prof)) {
        showError('cpf_prof', 'O CPF deve ter 11 dígitos e conter apenas números.');
        isValid = false;
    }


    if (!formData.email_prof || !/\S+@\S+\.\S+/.test(formData.email_prof)) {
        showError('email_prof', 'Email é obrigatório e deve ser válido.');
        isValid = false;
    }


    if (!formData.telefone_prof || !/^\d{10,15}$/.test(formData.telefone_prof)) {
        showError('telefone_prof', 'O contato deve ter entre 10 e 15 dígitos e conter apenas números.');
        isValid = false;
        
    }


    if (!formData.senha_prof || formData.senha_prof.length < 8) {
        showError('senha_prof', 'A senha deve ter no mínimo 8 caracteres.');
        isValid = false;
    }

    if (formData.confimasenha_prof !== formData.confimasenha_prof) {
        showError('confimasenha_prof', 'As senhas não coincidem.');
        isValid = false;
    }

    if (!isValid) return;

    try {
        const response = await fetch('/cadastroprofissional', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.status === 200) {
            document.getElementById('success-message').innerText = result.message;
            document.getElementById('cadastroFormprof').reset();
        } else {
            result.errors.forEach(error => {
                showError(error.field, error.message);
            });
        }
    } catch (error) {
        console.error('Erro ao enviar o formulário:', error);
    }
});

function showError(field, message) {
    const input = document.getElementById(field);
    const errorElement = document.getElementById(`${field}_error`);
    errorElement.innerText = message;
    errorElement.style.display = 'block';
}