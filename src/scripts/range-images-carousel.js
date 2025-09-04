// Slide-based carousel for the range images using Splide core (no AutoScroll)
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var el = document.querySelector('.range .range-carousel-images.splide');
    if (!el || !window.Splide) return;

    try {
      var splide = new Splide(el, {
        type: 'loop',
        perPage: 3,
        pagination: false,
        arrows: false,
        autoplay: true,
        interval: 4000,
        speed: 700,
        rewind: false,
        pauseOnHover: true,
        pauseOnFocus: true,
        breakpoints: {
            768: {
                perPage: 1
            }
        },
        classes: {
          // keep default styles; customize if needed
        },
      });

      splide.mount();
    } catch (e) {
      console.error('Failed to init range images carousel:', e);
    }
  });
})();
