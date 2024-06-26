document.addEventListener("DOMContentLoaded", function() {
    let counter = document.getElementById('counter');
    let count = 0;
    setInterval(() => {
        if (count < 20000) { // Ajuste o valor final conforme necessário
            count++;
            counter.innerText = count;
        }
    }, 50); // Ajuste a velocidade conforme necessário
});