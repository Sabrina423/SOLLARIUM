const slides = document.querySelectorAll('.carousel input[type="radio"]');
slides.forEach(slide => {
    slide.addEventListener('change', function() {
        const checkedSlide = document.querySelector('.carousel input[type="radio"]:checked + figcaption');
        if (checkedSlide) {
            checkedSlide.style.opacity = 0;
        }
        const selectedCaption = document.querySelector(`.carousel figcaption[for="${this.id}"]`);
        selectedCaption.style.opacity = 1;
    });
});
