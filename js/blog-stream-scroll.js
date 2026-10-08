/**
 * TPS Empire - Scattered Floating Parallax Blog Showcase Controller
 * Recreates the exact reference transition:
 * - Pinned center headline ("READ OUR LATEST ARTICLES")
 * - Asymmetrical image cards positioned across left/right/center-offset coordinates
 * - Multiple cards drift and float upwards through the screen across the scroll track
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initFloatingBlogShowcase();
  });

  function initFloatingBlogShowcase() {
    var section = document.getElementById('tpsBlogStreamSection') || document.querySelector('.tps-blog-stream-section');
    if (!section) return;

    var track = section.querySelector('.tps-blog-stream-track');
    var cards = section.querySelectorAll('.tps-blog-floating-card');
    if (!track || !cards.length) return;

    var totalCards = cards.length;
    var targetProgress = 0;
    var currentProgress = 0;
    var isRunning = false;
    var rafId = null;

    // Split-lane positioning with varied card sizes and asymmetrical styling
    var cardPositions = [
      { left: '5%',  top: '28%', width: '27vw', maxWidth: '390px' }, // Card 1: Standard Landscape
      { left: '63%', top: '20%', width: '32vw', maxWidth: '440px' }, // Card 2: Large Editorial Portrait
      { left: '8%',  top: '32%', width: '23vw', maxWidth: '340px' }, // Card 3: Compact Square
      { left: '61%', top: '26%', width: '34vw', maxWidth: '460px' }, // Card 4: Wide Cinematic Banner
      { left: '5%',  top: '22%', width: '29vw', maxWidth: '420px' }, // Card 5: Tall Story Feature
      { left: '67%', top: '30%', width: '25vw', maxWidth: '360px' }, // Card 6: Compact Landscape
      { left: '5%',  top: '25%', width: '30vw', maxWidth: '430px' }, // Card 7: Editorial Wide
      { left: '64%', top: '24%', width: '29vw', maxWidth: '410px' }  // Card 8: Large Square Statement
    ];

    // Explicit non-overlapping start schedule for each card
    var cardStartProgress = [
      0.04, // Card 1: Left (active ~0.04 - 0.32)
      0.15, // Card 2: Right (active ~0.15 - 0.43)
      0.26, // Card 3: Left (active ~0.26 - 0.54)
      0.37, // Card 4: Right (active ~0.37 - 0.65)
      0.48, // Card 5: Left (active ~0.48 - 0.76)
      0.59, // Card 6: Right (active ~0.59 - 0.87)
      0.70, // Card 7: Left (active ~0.70 - 0.98)
      0.80  // Card 8: Right (active ~0.80 - 1.00)
    ];

    function clamp(val, min, max) {
      return Math.max(min, Math.min(max, val));
    }

    function calculateTargetProgress() {
      if (window.innerWidth <= 991) {
        // Reset transforms and inline styles on mobile
        for (var i = 0; i < totalCards; i++) {
          cards[i].style.transform = '';
          cards[i].style.opacity = '';
          cards[i].style.visibility = '';
          cards[i].style.left = '';
          cards[i].style.top = '';
          cards[i].style.width = '';
          cards[i].style.maxWidth = '';
        }
        return;
      }

      // Apply base resting positions
      for (var k = 0; k < totalCards; k++) {
        var pos = cardPositions[k % cardPositions.length];
        cards[k].style.left = pos.left;
        cards[k].style.top = pos.top;
        cards[k].style.width = pos.width;
        cards[k].style.maxWidth = pos.maxWidth;
      }

      var scrollY = window.pageYOffset || document.documentElement.scrollTop;
      var trackRect = track.getBoundingClientRect();
      var trackTop = trackRect.top + scrollY;

      var startScroll = trackTop;
      var maxScrollable = track.offsetHeight - window.innerHeight;
      if (maxScrollable <= 0) maxScrollable = 1;

      var dist = scrollY - startScroll;
      targetProgress = clamp(dist / maxScrollable, 0, 1);

      if (!isRunning) {
        isRunning = true;
        rafId = window.requestAnimationFrame(animLoop);
      }
    }

    function renderFloatingCards(prog) {
      if (window.innerWidth <= 991) return;

      var vh = window.innerHeight;
      var travelRange = 0.28; // Strict non-overlapping duration per card
      var travelDistance = vh * 1.55; // Vertical travel height

      for (var i = 0; i < totalCards; i++) {
        var card = cards[i];
        var startProg = cardStartProgress[i] || (0.04 + i * 0.11);
        var t = (prog - startProg) / travelRange;

        if (t <= 0 || t >= 1.02) {
          // Completely off-screen and non-interfering
          card.style.visibility = 'hidden';
          card.style.opacity = '0';
          card.style.pointerEvents = 'none';
        } else {
          // Active in viewport
          card.style.visibility = 'visible';
          card.style.pointerEvents = 'auto';

          // Y-offset: Entering from bottom (t=0), resting at focal position (t=0.5), exiting top (t=1)
          var yOffset = (0.5 - t) * travelDistance;

          // Smooth fade in & out
          var opacity = 1;
          if (t < 0.16) {
            opacity = clamp(t / 0.16, 0, 1);
          } else if (t > 0.84 && i < totalCards - 1) {
            opacity = clamp((1 - t) / 0.16, 0, 1);
          } else if (t > 0.84) {
            // Retain final card visibility at track finish
            opacity = clamp(1 - (t - 0.84) * 1.2, 0.6, 1);
          }

          card.style.transform = 'translate3d(0, ' + yOffset.toFixed(2) + 'px, 0)';
          card.style.opacity = opacity.toFixed(3);
        }
      }
    }

    function animLoop() {
      var diff = targetProgress - currentProgress;

      if (Math.abs(diff) < 0.0002) {
        currentProgress = targetProgress;
        renderFloatingCards(currentProgress);
        isRunning = false;
        return;
      }

      // Smooth buttery damping (0.08)
      currentProgress += diff * 0.08;
      renderFloatingCards(currentProgress);

      rafId = window.requestAnimationFrame(animLoop);
    }

    // Scroll and resize listeners
    window.addEventListener('scroll', calculateTargetProgress, { passive: true });
    window.addEventListener('resize', function () {
      calculateTargetProgress();
      renderFloatingCards(currentProgress);
    }, { passive: true });

    // Initial render
    calculateTargetProgress();
    renderFloatingCards(0);
  }
})();
