document.addEventListener('DOMContentLoaded', () => {
    const btnClient = document.getElementById('btnClient');
    const btnProfessional = document.getElementById('btnProfessional');
    const formClient = document.getElementById('formClient');
    const formProfessional = document.getElementById('formProfessional');

    btnClient.addEventListener('click', () => {
        formProfessional.classList.add('hidden');
        formClient.classList.remove('hidden');
    });

    btnProfessional.addEventListener('click', () => {
        formClient.classList.add('hidden');
        formProfessional.classList.remove('hidden');
    });

    const validateForm = (form) => {
        let isValid = true;
        form.querySelectorAll('input[required], select[required]').forEach(input => {
            if (!input.value) {
                input.style.border = '2px solid red';
                isValid = false;
            } else {
                input.style.border = '';
            }
        });

        const password = form.querySelector('input[type="password"]');
        if (password && password.value.length < 8) {
            alert('Password must be at least 8 characters long');
            isValid = false;
        }

        return isValid;
    };

    formClient.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateForm(formClient)) {
            // Submit the form
        }
    });

    formProfessional.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateForm(formProfessional)) {
            // Submit the form
        }
    });
});
