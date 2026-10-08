/**
 * TPS Empire - Split Scroll-Driven Showcase Controller ("Empowering Businesses & Careers")
 * Replicates the reference video:
 * - Phase 0: Heading and unboxed picture appear FIRST in the CENTER of the section
 * - Phase 1: As user scrolls down, picture glides to the LEFT, and Card 1 (Enterprise Solutions) animates in on the RIGHT
 * - Phase 2: On continued scrolling, Card 1 moves up/out and Card 2 (Professional Training) animates in with staggered vertical sequence
 * - Dynamic color transitions: Electric Blue <---> Sunset Amber/Orange
 * - Interactive toggle switch pill with smooth slide & click support
 */

(function () {
  'use strict';

  function initSplitShowcase() {
    var section = document.getElementById('tpsSplitShowcaseSection') || document.querySelector('.tps-split-showcase-section');
    if (!section) return;

    var track = document.getElementById('tpsSplitShowcaseTrack') || section.querySelector('.tps-split-showcase-track');
    if (!track) return;

    var card1 = section.querySelector('.tps-split-card[data-card-index="0"]');
    var card2 = section.querySelector('.tps-split-card[data-card-index="1"]');
    var statusText = section.querySelector('.tps-status-text');
    var togglePill = section.querySelector('.tps-split-status-pill');

    if (!card1 || !card2) return;

    var targetProgress = 0;
    var currentProgress = 0;
    var isRunning = false;
    var currentPhase = -1; // -1: uninit, 0: Intro (center image), 1: Enterprise (image left + card 1), 2: Training (image left + card 2)

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

    function renderPhase(p) {
      var isDesktop = window.innerWidth > 991.98;
      if (!isDesktop) return;

      // 3-Phase Scroll Sequence:
      // Phase 0 (p < 0.12): Picture in CENTER, cards hidden
      // Phase 1 (0.12 <= p < 0.55): Picture slides to LEFT, Card 1 animates in on RIGHT
      // Phase 2 (p >= 0.55): Picture on LEFT, Card 1 exits up, Card 2 animates in on RIGHT
      var phase;
      if (p < 0.12) {
        phase = 0;
      } else if (p < 0.55) {
        phase = 1;
      } else {
        phase = 2;
      }

      if (phase !== currentPhase) {
        currentPhase = phase;

        if (phase === 0) {
          // Phase 0: Center Picture Presentation
          section.classList.add('phase-intro');
          section.classList.remove('phase-active');
          section.classList.remove('mode-training');
          section.classList.add('mode-enterprise');

          card1.classList.remove('is-active');
          card1.classList.remove('is-passed');

          card2.classList.remove('is-active');
          card2.classList.remove('is-passed');

          if (statusText) {
            statusText.textContent = 'Enterprise Active';
          }
        } else if (phase === 1) {
          // Phase 1: Picture Left + Card 1 Active
          section.classList.remove('phase-intro');
          section.classList.add('phase-active');
          section.classList.remove('mode-training');
          section.classList.add('mode-enterprise');

          card1.classList.remove('is-passed');
          card1.classList.add('is-active');

          card2.classList.remove('is-active');
          card2.classList.remove('is-passed');

          if (statusText) {
            statusText.textContent = 'Enterprise Active';
          }
        } else {
          // Phase 2: Picture Left + Card 2 Active
          section.classList.remove('phase-intro');
          section.classList.add('phase-active');
          section.classList.remove('mode-enterprise');
          section.classList.add('mode-training');

          card1.classList.remove('is-active');
          card1.classList.add('is-passed');

          card2.classList.remove('is-passed');
          card2.classList.add('is-active');

          if (statusText) {
            statusText.textContent = 'Training Active';
          }
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

    // Interactive Click Toggle on Pill
    if (togglePill) {
      togglePill.addEventListener('click', function () {
        var rect = track.getBoundingClientRect();
        var scrollY = window.pageYOffset || document.documentElement.scrollTop;
        var trackTop = rect.top + scrollY;
        var trackHeight = rect.height;
        var windowHeight = window.innerHeight || document.documentElement.clientHeight;
        var totalScrollable = trackHeight - windowHeight;

        if (totalScrollable > 0) {
          var targetScroll;
          if (currentPhase === 2) {
            targetScroll = trackTop + totalScrollable * 0.32;
          } else {
            targetScroll = trackTop + totalScrollable * 0.75;
          }
          window.scrollTo({
            top: targetScroll,
            behavior: 'smooth'
          });
        }
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    // Initial check
    currentPhase = -1;
    onScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSplitShowcase);
  } else {
    initSplitShowcase();
  }
})();
