document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll('.sliderhome .listhome .item'); 
    const thumbnails = document.querySelectorAll('.thumbnailhome .item');
    const sliderContainer = document.querySelector('.sliderhome');

    let countItem = items.length;
    let itemActive = 0;
    let refreshInterval;

    const showSlider = (index) => {
        // Remove old active items
        const itemActiveOld = document.querySelector('.sliderhome .listhome .item.active');
        const thumbnailActiveOld = document.querySelector('.thumbnailhome .item.active');
        if (itemActiveOld) itemActiveOld.classList.remove('active');
        if (thumbnailActiveOld) thumbnailActiveOld.classList.remove('active');

        // Add new active item
        items[index].classList.add('active');
        thumbnails[index].classList.add('active');

        // Update the currently active item
        itemActive = index;
    };

    const startAutoSlide = () => {
        refreshInterval = setInterval(() => {
            let nextIndex = (itemActive + 1) % countItem;
            showSlider(nextIndex);
        }, 7000); // Aumente o tempo para 7000 milissegundos (7 segundos)
    };

    const stopAutoSlide = () => {
        clearInterval(refreshInterval);
    };

    // Set up event listeners for thumbnails
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', () => {
            stopAutoSlide(); // Stop auto-slide on manual interaction
            showSlider(index);
            startAutoSlide(); // Restart auto-slide after interaction
        });

        thumbnail.addEventListener('mouseover', () => {
            stopAutoSlide(); // Stop auto-slide on mouseover
            showSlider(index);
        });

        thumbnail.addEventListener('mouseout', () => {
            startAutoSlide(); // Resume auto-slide on mouseout
        });
    });

    // Start auto-slide on page load
    startAutoSlide();

    // Pause auto-slide on mouse enter
    sliderContainer.addEventListener('mouseenter', () => {
        stopAutoSlide();
    });

    // Resume auto-slide on mouse leave
    sliderContainer.addEventListener('mouseleave', () => {
        startAutoSlide();
    });
});
