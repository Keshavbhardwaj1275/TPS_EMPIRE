/**
 * TPS Empire - Contact Hero Scroll Stage & Sequential Icon Reveal Controller
 * Handles the initial centered hero intro and reveals contact cards one-by-one as user scrolls.
 */
(function () {
  'use strict';

  function initContactStage() {
    var track = document.getElementById('contactScrollStageTrack');
    var heroIntro = document.getElementById('contactHeroIntro');
    var cardsTrack = document.getElementById('contactCardsTrack');

    if (!track || !heroIntro || !cardsTrack) return;

    var items = cardsTrack.querySelectorAll('.contact-card-item');
    if (!items.length) return;

    var ticking = false;

    function handleScroll() {
      var trackRect = track.getBoundingClientRect();
      var windowHeight = window.innerHeight || document.documentElement.clientHeight;
      var trackHeight = track.offsetHeight;
      var maxScroll = trackHeight - windowHeight;

      if (maxScroll <= 0) return;

      // Calculate how far down the track has scrolled
      var scrolled = -trackRect.top;
      var progress = scrolled / maxScroll;
      progress = Math.max(0, Math.min(1, progress));

      var isMobile = (window.innerWidth || document.documentElement.clientWidth) <= 991.98;
      var initCenterY = isMobile ? 60 : 95;

      // 1. Initial Centered Stage to Shift-Up State
      if (progress < 0.04) {
        // Initial state: Centered intro, cards hidden
        heroIntro.style.transform = 'translateY(' + initCenterY + 'px)';
        cardsTrack.classList.remove('is-active');
      } else {
        // Shift intro up smoothly and reveal cards container
        var t = Math.min(1, progress / 0.20);
        var currentY = (1 - t) * initCenterY - (t * 20);
        heroIntro.style.transform = 'translateY(' + currentY.toFixed(1) + 'px)';
        cardsTrack.classList.add('is-active');
      }

      // 2. Sequential Reveal of the 4 Icons
      // Thresholds:
      // Card 0 (Address) -> progress >= 0.18
      // Card 1 (Phone)   -> progress >= 0.38
      // Card 2 (Email)   -> progress >= 0.58
      // Card 3 (Website) -> progress >= 0.78
      var thresholds = [0.18, 0.38, 0.58, 0.78];

      items.forEach(function (item, index) {
        var threshold = thresholds[index] !== undefined ? thresholds[index] : 0.2 + index * 0.2;
        if (progress >= threshold) {
          item.classList.add('is-visible');
        } else {
          item.classList.remove('is-visible');
        }
      });
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    // Initial check
    handleScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactStage);
  } else {
    initContactStage();
  }
})();
