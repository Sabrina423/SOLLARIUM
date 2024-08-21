document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('#carousel img');
    let currentIndex = 0;

    function showImage(index) {
        images.forEach((img, i) => {
            img.style.display = i === index ? 'block' : 'none';
        });
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
    }

    function prevImage() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        showImage(currentIndex);
    }

    document.getElementById('next').addEventListener('click', nextImage);
    document.getElementById('prev').addEventListener('click', prevImage);

    // Carrossel automático
    setInterval(nextImage, 5000); // Muda a imagem a cada 5 segundos
});
