// Continuous marquee for the range CTA band using Splide AutoScroll
// Assumes Splide core and AutoScroll extension are loaded via CDN before this script
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var el = document.querySelector('.range .range-carousel-ctas.splide');
    if (!el || !window.Splide) return;

    try {
      var splide = new Splide(el, {
        type: 'loop',
        drag: 'free',
        arrows: false,
        pagination: false,
        gap: '0rem',
        autoWidth: true,
        // Ensure enough clones to make the loop seamless
        clones: 6,
        focus: 'center',
        pauseOnHover: false,
        pauseOnFocus: false,
        keyboard: false,
        autoScroll: {
          speed: 0.8, // Adjust speed for marquee effect
          pauseOnHover: false,
        },
        // Reduce height jitter
        height: 'auto',
      });

      // Mount with AutoScroll extension
      splide.mount(window.splide.Extensions || { AutoScroll: window.splide ? window.splide.Extensions.AutoScroll : undefined });
    } catch (e) {
      console.error('Failed to init range marquee:', e);
    }
  });
})();
