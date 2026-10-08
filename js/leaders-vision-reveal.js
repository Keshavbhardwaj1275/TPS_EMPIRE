/**
 * TPS Empire - Leaders with Vision Repeatable Scroll Reveal Controller
 * Seamlessly triggers line-first and content-reveal animation EVERY TIME the user scrolls into view
 */

(function () {
  'use strict';

  function initLeadersVisionReveal() {
    var section = document.querySelector('.tps-leaders-vision-section');
    if (!section) return;

    var steps = section.querySelectorAll('.tps-frameless-step, .tps-leader-step, .tps-leader-card');
    if (!steps.length) return;

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              // Trigger line-first then content reveal sequence
              steps.forEach(function (step) {
                step.classList.add('is-revealed');
              });
            } else {
              // When scrolled out of view, reset state so it re-triggers every time
              steps.forEach(function (step) {
                step.classList.remove('is-revealed');
              });
            }
          });
        },
        {
          root: null,
          rootMargin: '-5% 0px -8% 0px',
          threshold: 0.15
        }
      );

      observer.observe(section);
    } else {
      // Fallback
      steps.forEach(function (step) {
        step.classList.add('is-revealed');
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLeadersVisionReveal);
  } else {
    initLeadersVisionReveal();
  }
})();
