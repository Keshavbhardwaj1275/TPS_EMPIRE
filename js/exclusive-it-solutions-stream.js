/**
 * TPS Empire - Exclusive IT Solutions Scroll-Driven Cards Stream Controller
 * Keeps "Our Exclusive IT Solution Services" 100% static while the cards stream vertically with scroll
 */

(function () {
  'use strict';

  function initExclusiveCardStream() {
    var section = document.getElementById('tpsExclusiveServicesSection');
    var cardsCol = section ? section.querySelector('.tps-exclusive-cards-col') : null;
    var cardsRail = section ? section.querySelector('.tps-exclusive-cards-rail') : null;
    var cards = section ? section.querySelectorAll('.tps-stream-card') : [];

    if (!section || !cardsCol || !cardsRail || !cards.length) return;

    var targetProgress = 0;
    var currentProgress = 0;
    var isRunning = false;

    function clamp(val, min, max) {
      return Math.max(min, Math.min(max, val));
    }

    function calculateProgress() {
      var rect = section.getBoundingClientRect();
      var sectionHeight = rect.height;
      var windowHeight = window.innerHeight || document.documentElement.clientHeight;

      var totalScrollable = sectionHeight - windowHeight;
      if (totalScrollable <= 0) return 0;

      var scrolled = -rect.top;
      var p = scrolled / totalScrollable;
      return clamp(p, 0, 1);
    }

    function render() {
      var isDesktop = window.innerWidth > 991.98;

      if (!isDesktop) {
        cardsRail.style.transform = 'none';
        return;
      }

      var p = currentProgress;
      var colHeight = cardsCol.offsetHeight || 600;
      var railHeight = cardsRail.scrollHeight || 650;
      var cardHeight = cards[0] ? cards[0].offsetHeight : 120;

      // Start position: Card 1 nicely framed in view
      var startY = (colHeight - cardHeight) * 0.45;
      // End position: Card 4 nicely framed in view
      var endY = -(railHeight - colHeight + startY);

      var totalTravel = startY - endY;
      var currentY = startY - (p * totalTravel);

      cardsRail.style.transform = 'translate3d(0, ' + currentY.toFixed(1) + 'px, 0)';

      // Highlight the card currently closest to center line
      var triggerLine = colHeight * 0.5;
      cards.forEach(function (card) {
        var cardRect = card.getBoundingClientRect();
        var colRect = cardsCol.getBoundingClientRect();
        var cardRelCenter = (cardRect.top - colRect.top) + cardRect.height * 0.5;
        var dist = Math.abs(cardRelCenter - triggerLine);

        if (dist < 90) {
          card.classList.add('is-active');
        } else {
          card.classList.remove('is-active');
        }
      });
    }

    function renderLoop() {
      var diff = targetProgress - currentProgress;
      if (Math.abs(diff) > 0.0001) {
        currentProgress += diff * 0.08;
      } else {
        currentProgress = targetProgress;
      }

      render();

      if (Math.abs(diff) > 0.0001) {
        requestAnimationFrame(renderLoop);
      } else {
        isRunning = false;
      }
    }

    function onScroll() {
      targetProgress = calculateProgress();
      if (!isRunning) {
        isRunning = true;
        requestAnimationFrame(renderLoop);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    // Initial render
    onScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initExclusiveCardStream);
  } else {
    initExclusiveCardStream();
  }
})();
