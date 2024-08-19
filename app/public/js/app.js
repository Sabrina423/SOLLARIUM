const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');

menuToggle.addEventListener('click', () => {
    menu.classList.toggle('active');
});

// Carousel Functionality
const carouselInner = document.querySelector('.carousel-inner');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
let index = 0;

const showItem = (n) => {
    index = (n + carouselInner.children.length) % carouselInner.children.length;
    carouselInner.style.transform = `translateX(-${index * 100}%)`;
};

prevBtn.addEventListener('click', () => showItem(index - 1));
nextBtn.addEventListener('click', () => showItem(index + 1));