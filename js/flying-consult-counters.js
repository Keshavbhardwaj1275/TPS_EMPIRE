/**
 * TPS Empire - Ultra-Smooth, Cinema-Grade Curved Floating Counters Controller
 * 
 * Features:
 * 1. Ultra-gentle lerping dampening (0.048) for slow, luxurious momentum
 * 2. Quintic polynomial Smootherstep easing (zero acceleration jerk)
 * 3. Soft cosine fade-in and subtle blossoming scale (0.94 -> 1.0)
 * 4. Graceful 3D parabolic curved floating flight paths
 * 5. Reversible bi-directional scrubbing when scrolling up
 * 6. Direct number display, zero shine, 100% matte elegance
 */

(function () {
  'use strict';

  function initCurvedFlyingCounters() {
    var section = document.getElementById('section-counter');
    var track = document.getElementById('tpsFlyingScrollTrack');
    var sheet = section ? section.querySelector('.tps-flying-sheet-layer') : null;

    if (!section || !track || !sheet) return;

    var cards = section.querySelectorAll('.tps-flying-card');
    if (cards.length === 0) return;

    // Card metadata & unique curve flight path parameters
    var cardData = [
      {
        el: cards[0],
        startP: 0.08,
        endP: 0.35,
        curveYPeak: -75, // Parabolic arc lift (px)
        initialY: -40,   // Initial vertical descent offset
        initialRotate: 8 // Subtle entry tilt (deg)
      },
      {
        el: cards[1],
        startP: 0.27,
        endP: 0.54,
        curveYPeak: 60,
        initialY: -25,
        initialRotate: -6.5
      },
      {
        el: cards[2],
        startP: 0.46,
        endP: 0.73,
        curveYPeak: 80,
        initialY: 45,
        initialRotate: -8
      },
      {
        el: cards[3],
        startP: 0.65,
        endP: 0.92,
        curveYPeak: -65,
        initialY: 35,
        initialRotate: 7
      }
    ];

    var targetProgress = 0;
    var currentProgress = 0;
    var isRunning = false;

    // Quintic polynomial Smootherstep: f'(0)=0, f''(0)=0, f'(1)=0, f''(1)=0 (pure zero-jerk elegance)
    function smootherstep(x) {
      return x * x * x * (x * (x * 6 - 15) + 10);
    }

    // Cubic smoothstep for sheet climb
    function smoothstep(x) {
      return x * x * (3 - 2 * x);
    }

    // Clamp helper
    function clamp(val, min, max) {
      return Math.max(min, Math.min(max, val));
    }

    // Calculate normalized track scroll progress (0.0 to 1.0)
    function calculateScrollProgress() {
      var rect = track.getBoundingClientRect();
      var trackHeight = rect.height;
      var windowHeight = window.innerHeight || document.documentElement.clientHeight;

      var totalScrollable = trackHeight - windowHeight;
      if (totalScrollable <= 0) return 0;

      var scrolled = -rect.top;
      var progress = scrolled / totalScrollable;
      return clamp(progress, 0, 1);
    }

    // Main render loop with ultra-smooth linear interpolation (lerp)
    function renderLoop() {
      var windowWidth = window.innerWidth || document.documentElement.clientWidth;
      var isMobile = windowWidth <= 767.98;

      if (isMobile) {
        if (sheet) {
          sheet.style.transform = '';
        }
        cardData.forEach(function (card) {
          if (!card.el) return;
          card.el.style.transform = '';
          card.el.style.opacity = '';
        });
        isRunning = false;
        return;
      }

      // Very gentle lerping factor for calm, slow, luxurious movement
      var diff = targetProgress - currentProgress;
      if (Math.abs(diff) > 0.0001) {
        currentProgress += diff * 0.048;
      } else {
        currentProgress = targetProgress;
      }

      var flightWidth = Math.max(window.innerWidth * 0.55, 380);

      // 1. Layered Climbing Sheet Reveal (0.0 to 0.10)
      var sheetClimbRaw = clamp(currentProgress / 0.10, 0, 1);
      var sheetEased = smoothstep(sheetClimbRaw);
      var sheetTranslateY = (1 - sheetEased) * 45; // Smooth 45px climb up
      sheet.style.transform = 'translate3d(0, ' + sheetTranslateY.toFixed(2) + 'px, 0)';

      // 2. Individual Cards Curved Floating Right-to-Left Flight
      cardData.forEach(function (card) {
        if (!card.el) return;

        var localRange = card.endP - card.startP;
        var localRaw = (currentProgress - card.startP) / localRange;
        var localP = clamp(localRaw, 0, 1);

        // Quintic smootherstep easing for ultra-seamless motion
        var easedP = smootherstep(localP);

        // Curved Floating Path Calculations:
        // X sweeps gracefully from flightWidth to 0
        var translateX = (1 - easedP) * flightWidth;

        // Y follows a parabolic swoop arc (sin wave) + linear elevation descent
        var arcY = Math.sin(easedP * Math.PI) * card.curveYPeak;
        var linearY = (1 - easedP) * card.initialY;
        var translateY = arcY + linearY;

        // Subtle floating rotation angle that aligns to 0deg upon landing
        var rotateDeg = (1 - easedP) * card.initialRotate;

        // Gentle scale blossom from 0.94 to 1.0
        var scale = 0.94 + easedP * 0.06;

        // Soft cosine fade-in for smooth, non-abrupt appearance
        var opacity = Math.sin(localP * (Math.PI / 2));

        // Apply hardware-accelerated 3D curved transform
        card.el.style.transform = 'translate3d(' + translateX.toFixed(1) + 'px, ' + translateY.toFixed(1) + 'px, 0) scale(' + scale.toFixed(3) + ') rotate(' + rotateDeg.toFixed(2) + 'deg)';
        card.el.style.opacity = opacity.toFixed(3);
      });

      // Keep animation loop alive if still progressing
      if (Math.abs(diff) > 0.0001) {
        requestAnimationFrame(renderLoop);
      } else {
        isRunning = false;
      }
    }

    function onScroll() {
      var windowWidth = window.innerWidth || document.documentElement.clientWidth;
      if (windowWidth <= 767.98) {
        if (sheet) {
          sheet.style.transform = '';
        }
        cardData.forEach(function (card) {
          if (!card.el) return;
          card.el.style.transform = '';
          card.el.style.opacity = '';
        });
        isRunning = false;
        return;
      }

      targetProgress = calculateScrollProgress();
      if (!isRunning) {
        isRunning = true;
        requestAnimationFrame(renderLoop);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    // Initial run
    onScroll();
  }

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCurvedFlyingCounters);
  } else {
    initCurvedFlyingCounters();
  }
})();
