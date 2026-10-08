/**
 * TPS Empire - Scroll-Driven Sticky Stacked Service Cards
 * Left: Sticky heading & live step indicators (pinned throughout scroll)
 * Right: Smooth scroll-synchronized card stack transitions
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initScrollStackedDeck();
  });

  function initScrollStackedDeck() {
    var track = document.getElementById('tpsServicesScrollTrack') || document.querySelector('.tps-scroll-track');
    if (!track) return;

    var stickyViewport = track.querySelector('.tps-sticky-viewport');
    var cards = track.querySelectorAll('.tps-deck-card-wide');
    var stepItems = track.querySelectorAll('.tps-step-item');
    var totalCards = cards.length;
    if (totalCards < 2) return;

    var numTransitions = totalCards - 1;
    var ticking = false;

    // Smooth cubic easing for natural card entrance
    function easeOutCubic(x) {
      return 1 - Math.pow(1 - x, 3);
    }

    function clamp(val, min, max) {
      return Math.max(min, Math.min(max, val));
    }

    function updateActiveStep(activeIndex) {
      if (!stepItems || stepItems.length === 0) return;
      stepItems.forEach(function (step, idx) {
        if (idx === activeIndex) {
          step.classList.add('active');
        } else {
          step.classList.remove('active');
        }
      });
    }

    function renderCards() {
      var scrollY = window.pageYOffset || document.documentElement.scrollTop;
      var trackRect = track.getBoundingClientRect();
      var trackTop = trackRect.top + scrollY;

      var isMobile = window.innerWidth <= 768;
      var stickyOffset = isMobile ? 70 : 120;
      var topTabStep = isMobile ? 18 : 26;
      var stageHeight = stickyViewport ? stickyViewport.clientHeight : 560;
      var startRestY = stageHeight + 40;

      // Calculate scroll progress through the track
      var startScroll = trackTop - stickyOffset;
      var trackHeight = track.offsetHeight;
      var maxScrollable = trackHeight - window.innerHeight;

      if (maxScrollable <= 0) maxScrollable = 1;

      var currentDist = scrollY - startScroll;
      var rawProgress = currentDist / maxScrollable;
      var progress = clamp(rawProgress, 0, 1);

      // Determine active card index for left step indicator
      var activeIndex = 0;
      for (var s = 1; s < totalCards; s++) {
        var threshold = (s - 0.4) / numTransitions;
        if (progress >= threshold) {
          activeIndex = s;
        }
      }
      updateActiveStep(activeIndex);

      // Card 0 (Base Royal Blue card) is always anchored at top 0
      cards[0].style.transform = 'translate3d(0, 0px, 0)';
      cards[0].style.zIndex = 10;

      // Animate subsequent cards based on scroll progress
      for (var i = 1; i < totalCards; i++) {
        var card = cards[i];
        var segStart = (i - 1) / numTransitions;
        var segEnd = i / numTransitions;

        var segProgress = clamp((progress - segStart) / (segEnd - segStart), 0, 1);
        var eased = easeOutCubic(segProgress);

        var targetTop = i * topTabStep;
        var currentY = startRestY - (eased * (startRestY - targetTop));

        card.style.transform = 'translate3d(0, ' + currentY.toFixed(2) + 'px, 0)';
        card.style.zIndex = 10 + (i * 10);

        if (segProgress >= 0.95) {
          card.classList.add('active');
        } else {
          card.classList.remove('active');
        }
      }

      ticking = false;
    }

    function requestRender() {
      if (!ticking) {
        window.requestAnimationFrame(renderCards);
        ticking = true;
      }
    }

    // Passive scroll and resize listeners
    window.addEventListener('scroll', requestRender, { passive: true });
    window.addEventListener('resize', requestRender, { passive: true });

    function scrollToCard(targetIndex) {
      var scrollY = window.pageYOffset || document.documentElement.scrollTop;
      var trackRect = track.getBoundingClientRect();
      var trackTop = trackRect.top + scrollY;
      var isMobile = window.innerWidth <= 768;
      var stickyOffset = isMobile ? 70 : 120;
      var startScroll = trackTop - stickyOffset;
      var maxScrollable = track.offsetHeight - window.innerHeight;

      var targetProgress = targetIndex === 0 ? 0 : (targetIndex / numTransitions);
      var targetScrollY = startScroll + (targetProgress * maxScrollable) + 2;

      window.scrollTo({
        top: targetScrollY,
        behavior: 'smooth'
      });
    }

    // Step item navigation click
    stepItems.forEach(function (step, index) {
      step.addEventListener('click', function () {
        scrollToCard(index);
      });
    });

    // Allow clicking any card's visible top tab to scroll smoothly to it
    cards.forEach(function (card, index) {
      card.setAttribute('data-index', index);

      card.addEventListener('click', function (e) {
        if (e.target.closest('.tps-deck-card-cta')) return;
        scrollToCard(index);
      });
    });

    // Initial render
    setTimeout(renderCards, 60);
  }
})();

