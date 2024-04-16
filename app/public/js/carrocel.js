const slides = document.querySelectorAll('.carousel input[type="radio"]');
slides.forEach(slide => {
    slide.addEventListener('change', function() {
        const checkedSlide = document.querySelector('.carousel input[type="radio"]:checked + figure');
        const allSlides = document.querySelectorAll('.carousel figure');
        allSlides.forEach(slide => {
            slide.style.opacity = 0;
        });
        if (checkedSlide) {
            checkedSlide.style.opacity = 1;
        }
    });
});
