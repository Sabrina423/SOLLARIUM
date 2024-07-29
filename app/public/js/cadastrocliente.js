document.querySelector('form').addEventListener('submit', async function (event) {
    event.preventDefault();
    const formData = new FormData(this);
    const formObject = Object.fromEntries(formData);

    try {
        const response = await fetch('/cadastrocliente', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formObject)
        });

        const result = await response.json();

        if (response.ok) {
            showSuccessMessage(result.mensagem);
        } else {
            showErrors(result.errors);
        }
    } catch (error) {
        alert('Erro ao enviar dados: ' + error.message);
    }
});

function showErrors(errors) {
    const errorFields = document.querySelectorAll('.error-message');
    errorFields.forEach(field => field.remove());

    errors.forEach(error => {
        const inputField = document.querySelector(`[name="${error.field}"]`);
        inputField.classList.add('input-error');

        const errorMessage = document.createElement('small');
        errorMessage.classList.add('error-message');
        errorMessage.style.color = 'red';
        errorMessage.style.fontSize = '0.8em';
        errorMessage.textContent = error.message;

        inputField.parentNode.appendChild(errorMessage);
    });
}

function showSuccessMessage(message) {
    const successMessage = document.createElement('div');
    successMessage.classList.add('success-message');
    successMessage.style.color = 'green';
    successMessage.style.fontSize = '1em';
    successMessage.style.marginBottom = '20px';
    successMessage.textContent = message;

    document.querySelector('main').prepend(successMessage);
}

function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    if (field.type === 'password') {
        field.type = 'text';
    } else {
        field.type = 'password';
    }
}
