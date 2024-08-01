document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('cadastroForm');

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        const response = await fetch('/cadastrocliente', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        // Limpa mensagens de erro anteriores
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        document.querySelectorAll('.input-group input, .input-group select').forEach(el => el.classList.remove('input-error'));

        if (response.status !== 200) {
            result.errors.forEach(error => {
                const field = document.querySelector(`[name=${error.field}]`);
                const errorMessage = field.parentElement.querySelector('.error-message');
                errorMessage.textContent = error.message;
                field.classList.add('input-error');
            });
        } else {
            alert(result.mensagem);
            form.reset();
        }
    });
});

function togglePassword(id) {
    const field = document.getElementById(id);
    const type = field.getAttribute('type') === 'password' ? 'text' : 'password';
    field.setAttribute('type', type);
}
