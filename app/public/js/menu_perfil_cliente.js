// scripts.js

// Menu Toggle
const menuBtn = document.getElementById('menuBtn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');

menuBtn.addEventListener('click', () => {
    sidebar.style.left = '0';
    overlay.style.display = 'block';
    overlay.style.opacity = '1';
});

overlay.addEventListener('click', () => {
    sidebar.style.left = '-250px';
    overlay.style.opacity = '0';
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 500);
});
