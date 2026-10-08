/**
 * TPS Empire - Scroll-Driven "Our Insights & Creative Ideas" Scatter-Stack Controller
 * At p=0: Cards stacked in a deck in the center
 * As user scrolls: Cards blossom/fly outward into a structured 3x2 grid
 */

(function () {
  'use strict';

  function initInsightsScatterStack() {
    var section = document.getElementById('tpsInsightsScatterSection');
    var stage = section ? section.querySelector('.tps-insights-stage') : null;
    var cards = section ? section.querySelectorAll('.tps-insight-card') : [];

    if (!section || !stage || !cards.length) return;

    var targetProgress = 0;
    var currentProgress = 0;
    var isRunning = false;

    // Deck stacking initial rotation offsets for that card fan deck look
    var stackRotations = [-6.5, 4.2, -2.8, 5.5, -4.0, 1.5];
    var stackOffsets = [
      { x: -8, y: -4 },
      { x: 6, y: 3 },
      { x: -3, y: 7 },
      { x: 5, y: -6 },
      { x: -4, y: 5 },
      { x: 2, y: -2 }
    ];

    function clamp(val, min, max) {
      return Math.max(min, Math.min(max, val));
    }

    function smoothstep(min, max, value) {
      var x = Math.max(0, Math.min(1, (value - min) / (max - min)));
      return x * x * (3 - 2 * x);
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
        cards.forEach(function (card) {
          card.style.transform = 'none';
        });
        return;
      }

      var p = currentProgress;
      var t = smoothstep(0.04, 0.88, p); // 0 at top stack, 1 at full grid scatter

      var stageRect = stage.getBoundingClientRect();
      var stageCenterX = stageRect.width / 2;
      var stageCenterY = stageRect.height / 2;

      cards.forEach(function (card, index) {
        // Compute card center relative to stage
        var cardLeft = card.offsetLeft;
        var cardTop = card.offsetTop;
        var cardWidth = card.offsetWidth;
        var cardHeight = card.offsetHeight;

        var cardCenterX = cardLeft + cardWidth / 2;
        var cardCenterY = cardTop + cardHeight / 2;

        // Offset to bring this card to the stage center
        var toCenterX = stageCenterX - cardCenterX + (stackOffsets[index] ? stackOffsets[index].x : 0);
        var toCenterY = stageCenterY - cardCenterY + (stackOffsets[index] ? stackOffsets[index].y : 0);
        var rot = stackRotations[index] || 0;

        // Current interpolated values (1-t moves to center, t moves to grid)
        var curX = toCenterX * (1 - t);
        var curY = toCenterY * (1 - t);
        var curRot = rot * (1 - t);
        var curScale = 0.88 + 0.12 * t;

        card.style.transform = 'translate3d(' + curX.toFixed(1) + 'px, ' + curY.toFixed(1) + 'px, 0) rotate(' + curRot.toFixed(2) + 'deg) scale(' + curScale.toFixed(3) + ')';
        
        // Ensure stacked cards have proper z-indices during stack state
        card.style.zIndex = index + 1;
      });
    }

    function renderLoop() {
      var diff = targetProgress - currentProgress;
      if (Math.abs(diff) > 0.0004) {
        currentProgress += diff * 0.09;
      } else {
        currentProgress = targetProgress;
      }

      render();

      if (Math.abs(diff) > 0.0004) {
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
    document.addEventListener('DOMContentLoaded', initInsightsScatterStack);
  } else {
    initInsightsScatterStack();
  }
})();
