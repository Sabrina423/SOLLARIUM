document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
   
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
 
    if (username === '' || password === '') {
        alert('Please fill in all fields');
        return;
    }
 
    const loginData = {
        username: username,
        password: password
    };
 
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = '/dashboard';
        } else {
            alert('Invalid username or password');
        }
    })
    .catch(error => console.error('Error:', error));
});
 
