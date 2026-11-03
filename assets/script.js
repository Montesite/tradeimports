document.addEventListener('DOMContentLoaded', function () {
  // Mobile menu toggle
  var menuToggle = document.querySelector('[data-menu-toggle]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');
  var menuIconOpen = document.querySelector('[data-icon-open]');
  var menuIconClose = document.querySelector('[data-icon-close]');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.toggle('hidden') === false;
      if (menuIconOpen && menuIconClose) {
        menuIconOpen.style.display = isOpen ? 'none' : 'block';
        menuIconClose.style.display = isOpen ? 'block' : 'none';
      }
    });

    mobileMenu.querySelectorAll('a, button').forEach(function (el) {
      el.addEventListener('click', function () {
        mobileMenu.classList.add('hidden');
        if (menuIconOpen && menuIconClose) {
          menuIconOpen.style.display = 'block';
          menuIconClose.style.display = 'none';
        }
      });
    });
  }

  // Scroll to section (works cross-page via ?scrollTo= in the href, or same-page via [data-scroll-to])
  document.querySelectorAll('[data-scroll-to]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      var targetId = el.getAttribute('data-scroll-to');
      var target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  if (window.location.hash) {
    var hashTarget = document.getElementById(window.location.hash.slice(1));
    if (hashTarget) {
      setTimeout(function () {
        hashTarget.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  }

  // Hero background slideshow (mirrors the original opacity-20 / opacity-0 crossfade)
  var heroLayers = document.querySelectorAll('[data-hero-layer]');
  if (heroLayers.length) {
    var heroIndex = 0;
    setInterval(function () {
      heroLayers[heroIndex].classList.remove('opacity-20');
      heroLayers[heroIndex].classList.add('opacity-0');
      heroIndex = (heroIndex + 1) % heroLayers.length;
      heroLayers[heroIndex].classList.remove('opacity-0');
      heroLayers[heroIndex].classList.add('opacity-20');
    }, 5000);
  }

  // Brand carousels (autoplay every 3s + prev/next, loops, pauses on hover)
  document.querySelectorAll('[data-carousel]').forEach(function (carousel) {
    var track = carousel.querySelector('[data-carousel-track]');
    var prevBtn = carousel.querySelector('[data-carousel-prev]');
    var nextBtn = carousel.querySelector('[data-carousel-next]');
    if (!track) return;

    var total = track.querySelectorAll('[data-carousel-slide]').length;
    if (!total) return;

    var index = 0;
    var autoplayId = null;

    function visibleCount() {
      var w = window.innerWidth;
      if (w >= 1024) return 6;
      if (w >= 768) return 4;
      return 1;
    }

    function maxIndex() {
      return Math.max(0, total - visibleCount());
    }

    function render() {
      var percent = index * (100 / visibleCount());
      track.style.transform = 'translateX(-' + percent + '%)';
    }

    function goTo(i) {
      var max = maxIndex();
      index = i > max ? 0 : i < 0 ? max : i;
      render();
    }

    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    function startAutoplay() {
      stopAutoplay();
      autoplayId = setInterval(next, 3000);
    }

    function stopAutoplay() {
      if (autoplayId) {
        clearInterval(autoplayId);
        autoplayId = null;
      }
    }

    track.style.transition = 'transform 0.5s ease';

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        prev();
        startAutoplay();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        next();
        startAutoplay();
      });
    }

    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);

    window.addEventListener('resize', function () {
      goTo(Math.min(index, maxIndex()));
    });

    render();
    startAutoplay();
  });
});
