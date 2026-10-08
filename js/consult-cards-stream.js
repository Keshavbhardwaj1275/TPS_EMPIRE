/**
 * TPS Empire - Horizontal Sliding Card Stream Controller ("Consult Us Here")
 * Sliding Rail with Peek Effect:
 * - Active card sits in primary view on the left
 * - Next card peeks on the right with its number, icon, and title visible
 * - As user scrolls, the rail slides left into the next card and expands its description
 */

(function () {
  'use strict';

  function initConsultCardsStream() {
    var section = document.getElementById('section-counter') || document.querySelector('.tps-consult-stream-section');
    if (!section) return;

    var track = document.getElementById('tpsConsultScrollTrack') || section.querySelector('.tps-consult-scroll-track');
    var rail = document.getElementById('tpsConsultCardsRail') || section.querySelector('.tps-consult-cards-rail') || section.querySelector('.tps-consult-cards-track');
    var cards = section.querySelectorAll('.tps-consult-card');
    var stepDots = section.querySelectorAll('.tps-step-dot');

    if (!track || !rail || cards.length === 0) return;

    var targetProgress = 0;
    var currentProgress = 0;
    var isRunning = false;
    var currentPhase = -1;

    function clamp(val, min, max) {
      return Math.max(min, Math.min(max, val));
    }

    function calculateProgress() {
      var rect = track.getBoundingClientRect();
      var trackHeight = rect.height;
      var windowHeight = window.innerHeight || document.documentElement.clientHeight;

      var totalScrollable = trackHeight - windowHeight;
      if (totalScrollable <= 0) return 0;

      var scrolled = -rect.top;
      var p = scrolled / totalScrollable;
      return clamp(p, 0, 1);
    }

    function getCardStep() {
      if (cards.length > 1) {
        var c0 = cards[0].getBoundingClientRect();
        var c1 = cards[1].getBoundingClientRect();
        var diff = c1.left - c0.left;
        if (diff > 50) return diff;
      }
      return 384; // default fallback (360px card + 24px gap)
    }

    function renderPhase(p) {
      var isDesktop = window.innerWidth > 991.98;
      if (!isDesktop) {
        rail.style.transform = '';
        return;
      }

      var totalCards = cards.length;
      var phase = Math.min(totalCards - 1, Math.floor(p * totalCards));

      var stepDistance = getCardStep();
      var targetX = -(phase * stepDistance);
      rail.style.transform = 'translateX(' + targetX + 'px)';

      if (phase !== currentPhase) {
        currentPhase = phase;

        cards.forEach(function (card, idx) {
          if (idx === currentPhase) {
            card.classList.add('is-active');
          } else {
            card.classList.remove('is-active');
          }
        });

        if (stepDots && stepDots.length > 0) {
          stepDots.forEach(function (dot, idx) {
            if (idx === currentPhase) {
              dot.classList.add('is-active');
            } else {
              dot.classList.remove('is-active');
            }
          });
        }
      }
    }

    function renderLoop() {
      var diff = targetProgress - currentProgress;
      if (Math.abs(diff) > 0.0005) {
        currentProgress += diff * 0.14;
      } else {
        currentProgress = targetProgress;
      }

      renderPhase(currentProgress);

      if (Math.abs(diff) > 0.0005) {
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
    window.addEventListener('resize', function () {
      currentPhase = -1;
      onScroll();
    }, { passive: true });

    // Initial check
    currentPhase = -1;
    onScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initConsultCardsStream);
  } else {
    initConsultCardsStream();
  }
})();
