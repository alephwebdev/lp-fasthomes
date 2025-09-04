// Process carousel: 3 per view on desktop, 1 on mobile, no arrows, no autoplay, no loop
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var el = document.querySelector('.process .process-carousel.splide');
    if (!el || !window.Splide) return;

    try {
      var splide = new Splide(el, {
        type: 'slide', // not loop
        perPage: 3,
        perMove: 1,
        gap: '24px',
        arrows: false,
        pagination: false,
        autoplay: false,
        rewind: false,
        drag: true,
        breakpoints: {
          768: {
            perPage: 1,
          },
        },
      });

      splide.mount();
    } catch (e) {
      console.error('Failed to init process carousel:', e);
    }
  });
})();
