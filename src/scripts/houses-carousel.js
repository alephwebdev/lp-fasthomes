// Houses carousel with category filters
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var root = document.querySelector('.houses .houses-carousel.splide');
    var filterButtons = document.querySelectorAll('.houses .houses-options .houses-option');
    if (!root || !window.Splide) return;

    var list = root.querySelector('.splide__list');
    if (!list) return;

  // Cache originals once to avoid accumulation or loss on filter changes
    var originalSlides = Array.from(list.querySelectorAll(':scope > li.splide__slide')).map(function (li) {
      return {
        category: li.getAttribute('data-category') || '',
        html: li.outerHTML,
      };
    });

    var splide;
    var progressEl = document.querySelector('.houses .houses-progress-bar');
  var counterEl = document.querySelector('.houses .houses-footer > span');
    var timerId = null;
    var startedAt = 0;
    var duration = 3000; // 3 seconds
    var isAuto = false;

    function clearTimer() {
      if (timerId) {
        clearInterval(timerId);
        timerId = null;
      }
      if (progressEl) progressEl.style.width = '0%';
    }

    function startTimer() {
      if (!splide) return;
      clearTimer();
      startedAt = Date.now();
      timerId = setInterval(function () {
        var elapsed = Date.now() - startedAt;
        var pct = Math.min(elapsed / duration, 1);
        if (progressEl) progressEl.style.width = (pct * 100) + '%';
        if (pct >= 1) {
          clearTimer();
          isAuto = true;
          splide.go('>');
        }
      }, 50);
    }

    // Resolve effective perPage considering breakpoints
    function resolvePerPage() {
      if (!splide) return 1;
      var per = splide.options && typeof splide.options.perPage !== 'undefined' ? splide.options.perPage : 1;
      var bps = splide.options && splide.options.breakpoints ? splide.options.breakpoints : null;
      if (bps) {
        try {
          Object.keys(bps)
            .map(function (k) { return Number(k); })
            .filter(function (n) { return !isNaN(n); })
            .sort(function (a, b) { return a - b; })
            .forEach(function (bp) {
              if (window.innerWidth <= bp) {
                var cfg = bps[bp];
                if (cfg && typeof cfg.perPage !== 'undefined') per = cfg.perPage;
              }
            });
        } catch (_) { /* noop */ }
      }
      return per || 1;
    }

    function updateCounter() {
      if (!splide || !counterEl) return;
      try {
        var perPage = resolvePerPage();
        var totalSlides = list.querySelectorAll(':scope > li.splide__slide').length;
        var totalPages = Math.max(1, Math.ceil(totalSlides / perPage));
        var currentIndex = typeof splide.index === 'number' ? splide.index : 0;
        var currentPage = Math.min(totalPages, Math.floor(currentIndex / perPage) + 1);
        counterEl.textContent = currentPage + '/' + totalPages;
      } catch (_) { /* noop */ }
    }

    function renderCategory(category) {
      var pool = originalSlides.filter(function (s) { return category ? s.category === category : true; });
      list.innerHTML = pool.map(function (s) { return s.html; }).join('');
    }

    function setSwitching(on) {
      root.classList.toggle('is-switching', !!on);
    }

    function mountSplide() {
      splide = new Splide(root, {
        type: 'slide',
        perPage: 2,
        perMove: 1,
        gap: '24px',
        arrows: true,
        pagination: false,
        autoplay: false,
        rewind: false,
        drag: true,
        breakpoints: {
          768: { perPage: 1 },
        },
      });

      function equalizeHeights() {
        try {
          var cards = root.querySelectorAll('.splide__slide > .houses-carousel-item');
          var maxH = 0;
          // reset to natural height first
          cards.forEach(function (c) { c.style.height = 'auto'; });
          cards.forEach(function (c) { maxH = Math.max(maxH, c.offsetHeight); });
          if (maxH > 0) { cards.forEach(function (c) { c.style.height = maxH + 'px'; }); }
        } catch (e) { /* noop */ }
      }

      splide.on('mounted', function () {
        // small delay to let layout settle before revealing
        equalizeHeights();
        setTimeout(function(){ setSwitching(false); }, 50);
  updateCounter();
        startTimer();
      });

      // Reset timer when user interacts
      splide.on('drag', function(){ clearTimer(); });
      splide.on('move', function(){ if (!isAuto) clearTimer(); });

      splide.on('moved', function(){
        equalizeHeights();
        isAuto = false;
        updateCounter();
        startTimer();
      });
      splide.on('resize', function(){
        equalizeHeights();
        updateCounter();
      });

      splide.mount();
    }

    function rebuildWithCategory(category) {
  setSwitching(true);
  clearTimer();
      if (splide) {
        try { splide.destroy(true); } catch (e) {}
      }
      renderCategory(category);
      mountSplide();
    }

  // Initial state: 'casas' as primary category
  setSwitching(true);
  renderCategory('casas');
    mountSplide();

    // Handle filter clicks with smooth transition
    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var category = btn.getAttribute('data-category');
        filterButtons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        rebuildWithCategory(category);
      });
    });
  });
})();
