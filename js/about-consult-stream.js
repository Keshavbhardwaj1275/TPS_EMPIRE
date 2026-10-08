/**
 * TPS Empire - "Consult us here in TPS Empire" Animated Stream Controller
 * Drives smooth left-to-right animated line threading across horizontal cards and sequential activation.
 */

(function () {
  'use strict';

  function initConsultStream() {
    var section = document.getElementById('section-counter') || document.querySelector('.tps-consult-flow-section');
    if (!section) return;

    var track = section.querySelector('.tps-consult-scroll-track');
    var stage = section.querySelector('.tps-consult-stream-stage');
    var deckTrack = document.getElementById('tpsConsultDeckTrack');
    var threadBg = document.getElementById('tpsHThreadBg');
    var threadActive = document.getElementById('tpsHThreadActive');
    var threadHead = document.getElementById('tpsHThreadHead');
    var cards = section.querySelectorAll('.tps-stream-card');
    var endNode = document.getElementById('tpsConsultEndNode');

    if (!track || !stage || cards.length === 0) return;

    var targetProgress = 0;
    var currentProgress = 0;
    var isRunning = false;
    var pathLength = 0;

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

    // Build smooth edge-to-edge full-screen continuous weaving Bézier path through cards
    function buildHorizontalThreadPath() {
      var viewport = section.querySelector('.tps-consult-sticky-viewport');
      var svg = document.getElementById('tpsConsultHorizontalSvg');
      if (!threadBg || !threadActive || !deckTrack || !viewport || window.innerWidth <= 991.98) return;

      var viewportRect = viewport.getBoundingClientRect();
      var screenWidth = viewportRect.width || window.innerWidth;
      var screenHeight = viewportRect.height || window.innerHeight;

      if (svg) {
        svg.setAttribute('viewBox', '0 0 ' + screenWidth + ' ' + screenHeight);
      }

      // Collect real screen-space coordinates for all 4 square cards
      var cardData = [];
      cards.forEach(function (card) {
        var cr = card.getBoundingClientRect();
        cardData.push({
          left: cr.left - viewportRect.left,
          right: cr.right - viewportRect.left,
          centerY: cr.top - viewportRect.top + (cr.height / 2),
          width: cr.width,
          height: cr.height
        });
      });

      if (cardData.length === 0 || cardData[0].left <= 0) return;

      var firstCard = cardData[0];
      var lastCard = cardData[cardData.length - 1];

      // Absolute Screen Edges (Spans full display from edge to edge)
      var startX = 0;
      var startY = firstCard.centerY;
      var endX = screenWidth;
      var endY = lastCard.centerY;

      // Start at far-left border
      var d = 'M ' + startX.toFixed(1) + ' ' + startY.toFixed(1);

      // 1. Lead-in curve from screen left border (X=0) to Card 1 left edge
      var leadDist = firstCard.left - startX;
      var leadCp1X = startX + leadDist * 0.35;
      var leadCp1Y = startY - 16;
      var leadCp2X = startX + leadDist * 0.70;
      var leadCp2Y = firstCard.centerY + 16;

      d += ' C ' + leadCp1X.toFixed(1) + ' ' + leadCp1Y.toFixed(1) + ', ' +
           leadCp2X.toFixed(1) + ' ' + leadCp2Y.toFixed(1) + ', ' +
           firstCard.left.toFixed(1) + ' ' + firstCard.centerY.toFixed(1);

      // Through Card 1
      d += ' L ' + firstCard.right.toFixed(1) + ' ' + firstCard.centerY.toFixed(1);

      var prevRight = firstCard.right;
      var prevCenterY = firstCard.centerY;

      // 2. Weave through intermediate cards
      for (var i = 1; i < cardData.length; i++) {
        var nextCard = cardData[i];
        var gap = nextCard.left - prevRight;
        var waveOffset = (i % 2 === 1) ? 22 : -22;

        var cp1x = prevRight + gap * 0.35;
        var cp1y = prevCenterY + waveOffset;
        var cp2x = nextCard.left - gap * 0.35;
        var cp2y = nextCard.centerY - waveOffset;

        d += ' C ' + cp1x.toFixed(1) + ' ' + cp1y.toFixed(1) + ', ' +
             cp2x.toFixed(1) + ' ' + cp2y.toFixed(1) + ', ' +
             nextCard.left.toFixed(1) + ' ' + nextCard.centerY.toFixed(1);

        // Through current card
        d += ' L ' + nextCard.right.toFixed(1) + ' ' + nextCard.centerY.toFixed(1);

        prevRight = nextCard.right;
        prevCenterY = nextCard.centerY;
      }

      // 3. Lead-out exit curve from Card 4 right edge to screen right border (X=screenWidth)
      var exitDist = endX - prevRight;
      var exitCp1X = prevRight + exitDist * 0.30;
      var exitCp1Y = prevCenterY - 16;
      var exitCp2X = prevRight + exitDist * 0.65;
      var exitCp2Y = endY + 16;

      d += ' C ' + exitCp1X.toFixed(1) + ' ' + exitCp1Y.toFixed(1) + ', ' +
           exitCp2X.toFixed(1) + ' ' + exitCp2Y.toFixed(1) + ', ' +
           endX.toFixed(1) + ' ' + endY.toFixed(1);

      threadBg.setAttribute('d', d);
      threadActive.setAttribute('d', d);

      try {
        pathLength = threadActive.getTotalLength();
        threadActive.style.strokeDasharray = pathLength.toFixed(1);
        threadActive.style.strokeDashoffset = pathLength.toFixed(1);
      } catch (e) {
        pathLength = 1200;
      }
    }

    function renderState(p) {
      var isDesktop = window.innerWidth > 991.98;

      if (!isDesktop) {
        cards.forEach(function (card) { card.classList.add('is-active'); });
        if (endNode) endNode.classList.add('is-active');
        return;
      }

      // 1. Live draw the left-to-right thread
      if (pathLength > 0 && threadActive) {
        var drawLength = p * pathLength;
        var dashOffset = Math.max(0, pathLength - drawLength);
        threadActive.style.strokeDashoffset = dashOffset.toFixed(1);

        // Move glowing bead along line tip
        if (threadHead) {
          try {
            var point = threadActive.getPointAtLength(drawLength);
            threadHead.setAttribute('cx', point.x.toFixed(1));
            threadHead.setAttribute('cy', point.y.toFixed(1));
            threadHead.style.opacity = (p > 0.03 && p < 0.98) ? '1' : '0';
          } catch (e) {}
        }
      }

      // 2. Sequential card activation as line passes through
      var cardThresholds = [0.15, 0.38, 0.62, 0.82];

      cards.forEach(function (card, idx) {
        var threshold = cardThresholds[idx];
        if (p >= threshold) {
          card.classList.add('is-active');
        } else {
          card.classList.remove('is-active');
        }
      });

      // 3. CTA button activation
      if (endNode) {
        if (p >= 0.86) {
          endNode.classList.add('is-active');
        } else {
          endNode.classList.remove('is-active');
        }
      }
    }

    function renderLoop() {
      var diff = targetProgress - currentProgress;
      if (Math.abs(diff) > 0.0004) {
        currentProgress += diff * 0.14;
      } else {
        currentProgress = targetProgress;
      }

      renderState(currentProgress);

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
    window.addEventListener('resize', function () {
      buildHorizontalThreadPath();
      onScroll();
    }, { passive: true });
    window.addEventListener('load', function () {
      buildHorizontalThreadPath();
      onScroll();
    });

    // Initial render phases
    [50, 150, 400, 800].forEach(function (delay) {
      setTimeout(function () {
        buildHorizontalThreadPath();
        targetProgress = calculateProgress();
        currentProgress = targetProgress;
        renderState(currentProgress);
      }, delay);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initConsultStream);
  } else {
    initConsultStream();
  }
})();
