/**
 * TPS Empire - Hero Scroll Emergence Controller
 * Seamless sequence: 3 Square Curved Preview Cards -> Focal Guy Centerpiece Zoom-Out -> Flank Cards Smooth Emergence
 * Features: Click-to-highlight corner brackets, curved arc framing around image, smooth 60fps lerp
 */

(function () {
  'use strict';

  function initHeroScrollEmergence() {
    var section = document.getElementById('tpsHeroEmergenceSection');
    var track = document.getElementById('tpsHeroEmergenceTrack');
    var previewRow = document.getElementById('tpsHeroPreviewRow');
    var previewCards = section ? section.querySelectorAll('.tps-hero-preview-card') : [];
    var header = document.getElementById('tpsEmergenceHeader');
    var stage = document.getElementById('tpsEmergenceStage');
    var focalCenterpiece = document.getElementById('tpsFocalCenterpiece');
    var cardLeft = document.getElementById('tpsEmergentCardLeft');
    var cardRight = document.getElementById('tpsEmergentCardRight');

    if (!section || !track || !focalCenterpiece || !cardLeft || !cardRight) {
      return;
    }

    var targetProgress = 0;
    var currentProgress = 0;
    var isRunning = false;

    function clamp(val, min, max) {
      return Math.max(min, Math.min(max, val));
    }

    function smoothstep(min, max, value) {
      var x = Math.max(0, Math.min(1, (value - min) / (max - min)));
      return x * x * (3 - 2 * x);
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

    function renderSequence() {
      var p = currentProgress;
      var isMobile = window.innerWidth <= 640;
      var isTablet = window.innerWidth <= 991 && !isMobile;

      // ----------------------------------------------------------------------
      // Phase 1: Section Header (More than 35+ years we provide IT Solution)
      // Header appears between p: 0.20 -> 0.45
      // ----------------------------------------------------------------------
      var headerT = smoothstep(0.20, 0.45, p);
      if (header) {
        if (p > 0.18) {
          var headerY = -24 * (1 - headerT);
          header.style.opacity = headerT.toFixed(3);
          header.style.transform = 'translate3d(0, ' + headerY.toFixed(1) + 'px, 0)';
          header.style.visibility = 'visible';
        } else {
          header.style.opacity = '0';
          header.style.transform = 'translate3d(0, -24px, 0)';
          header.style.visibility = 'hidden';
        }
      }

      // ----------------------------------------------------------------------
      // Phase 2: Top Curved Preview Cards
      // Stay fully visible at top, and disappear ONLY when header appears (p: 0.20 -> 0.45)
      // ----------------------------------------------------------------------
      if (previewRow) {
        if (p < 0.48) {
          // Preview cards alpha is the direct inverse of header appearance
          var previewAlpha = Math.max(0, 1 - headerT);
          var previewScale = 1 - headerT * 0.06;

          previewRow.style.opacity = previewAlpha.toFixed(3);
          previewRow.style.pointerEvents = previewAlpha > 0.4 ? 'auto' : 'none';
          previewRow.style.visibility = previewAlpha > 0.001 ? 'visible' : 'hidden';

          // Animate individual curved cards along their arc vectors as they fade out
          if (previewCards.length >= 3) {
            var leftCard = previewCards[0];
            var centerCard = previewCards[1];
            var rightCard = previewCards[2];

            var leftRot = -12 - 8 * headerT;
            var rightRot = 12 + 8 * headerT;

            leftCard.style.transform = 'translate3d(-' + (45 * headerT).toFixed(1) + 'px, -' + (50 * headerT).toFixed(1) + 'px, 0) rotate(' + leftRot.toFixed(1) + 'deg) scale3d(' + previewScale.toFixed(3) + ', ' + previewScale.toFixed(3) + ', 1)';
            centerCard.style.transform = 'translate3d(0, -' + (60 * headerT).toFixed(1) + 'px, 0) rotate(0deg) scale3d(' + previewScale.toFixed(3) + ', ' + previewScale.toFixed(3) + ', 1)';
            rightCard.style.transform = 'translate3d(' + (45 * headerT).toFixed(1) + 'px, -' + (50 * headerT).toFixed(1) + 'px, 0) rotate(' + rightRot.toFixed(1) + 'deg) scale3d(' + previewScale.toFixed(3) + ', ' + previewScale.toFixed(3) + ', 1)';
          }
        } else {
          previewRow.style.opacity = '0';
          previewRow.style.visibility = 'hidden';
          previewRow.style.pointerEvents = 'none';
        }
      }

      // ----------------------------------------------------------------------
      // Phase 3: Focal Guy Image (Seamless Rise -> Zoom Prominence -> Zoom Out)
      // At p=0..0.20: Framed below the preview cards (scale: 1.00x)
      // At p=0.20..0.35: Transitions to focal prominence (scale: 1.45x)
      // At p=0.38..0.78: Zooms out / scales down to 1.00x as flank cards emerge
      // ----------------------------------------------------------------------
      var guyScale;
      var guyOpacity;
      var guyOffsetY;

      if (p < 0.25) {
        var riseT = smoothstep(0.0, 0.25, p);
        guyOffsetY = 40 * (1 - riseT);
        guyScale = 1.00 + riseT * 0.45; // 1.00x -> 1.45x
        guyOpacity = 0.90 + riseT * 0.10;
      } else if (p >= 0.25 && p <= 0.38) {
        // Focal prominence hold
        guyOffsetY = 0;
        guyScale = 1.45;
        guyOpacity = 1.0;
      } else {
        // Smoothly zoom out / scale down into center (p: 0.38 -> 0.78)
        var zoomT = smoothstep(0.38, 0.78, p);
        guyOffsetY = 0;
        guyScale = 1.45 - zoomT * 0.45; // 1.45 -> 1.00
        guyOpacity = 1.0;
      }

      focalCenterpiece.style.transform = 'translate3d(-50%, calc(-50% + ' + guyOffsetY.toFixed(1) + 'px), 0) scale3d(' + guyScale.toFixed(3) + ', ' + guyScale.toFixed(3) + ', 1)';
      focalCenterpiece.style.opacity = guyOpacity.toFixed(3);

      // ----------------------------------------------------------------------
      // Phase 4: Flank Cards Outward Emergence (p: 0.38 -> 0.78)
      // Slides cleanly outward from behind the guy as he zooms out
      // ----------------------------------------------------------------------
      var emergeT = smoothstep(0.38, 0.78, p);

      if (emergeT > 0.001) {
        var cardOpacity = emergeT;
        var cardScale = 0.45 + emergeT * 0.55; // 0.45 -> 1.00

        var targetDist = 430;
        if (isTablet) targetDist = 310;
        if (isMobile) targetDist = 0;

        if (!isMobile) {
          var currentDistX = targetDist * emergeT;
          var leftRot = 3.5 * (1 - emergeT);
          var rightRot = -3.5 * (1 - emergeT);

          // Left card glides outward to the left (-X)
          cardLeft.style.transform = 'translate3d(calc(-50% - ' + currentDistX.toFixed(1) + 'px), -50%, 0) scale3d(' + cardScale.toFixed(3) + ', ' + cardScale.toFixed(3) + ', 1) rotate(' + leftRot.toFixed(2) + 'deg)';
          cardLeft.style.opacity = cardOpacity.toFixed(3);
          cardLeft.style.pointerEvents = emergeT > 0.8 ? 'auto' : 'none';
          cardLeft.style.visibility = 'visible';

          // Right card glides outward to the right (+X)
          cardRight.style.transform = 'translate3d(calc(-50% + ' + currentDistX.toFixed(1) + 'px), -50%, 0) scale3d(' + cardScale.toFixed(3) + ', ' + cardScale.toFixed(3) + ', 1) rotate(' + rightRot.toFixed(2) + 'deg)';
          cardRight.style.opacity = cardOpacity.toFixed(3);
          cardRight.style.pointerEvents = emergeT > 0.8 ? 'auto' : 'none';
          cardRight.style.visibility = 'visible';
        } else {
          // Mobile responsive vertical spread
          var mobileDistY = 95 * emergeT;
          cardLeft.style.transform = 'translate3d(-50%, calc(-50% - ' + mobileDistY.toFixed(1) + 'px), 0) scale3d(' + cardScale.toFixed(3) + ', ' + cardScale.toFixed(3) + ', 1)';
          cardLeft.style.opacity = cardOpacity.toFixed(3);
          cardLeft.style.pointerEvents = emergeT > 0.8 ? 'auto' : 'none';
          cardLeft.style.visibility = 'visible';

          cardRight.style.transform = 'translate3d(-50%, calc(-50% + ' + mobileDistY.toFixed(1) + 'px), 0) scale3d(' + cardScale.toFixed(3) + ', ' + cardScale.toFixed(3) + ', 1)';
          cardRight.style.opacity = cardOpacity.toFixed(3);
          cardRight.style.pointerEvents = emergeT > 0.8 ? 'auto' : 'none';
          cardRight.style.visibility = 'visible';
        }
      } else {
        cardLeft.style.opacity = '0';
        cardLeft.style.visibility = 'hidden';
        cardLeft.style.pointerEvents = 'none';

        cardRight.style.opacity = '0';
        cardRight.style.visibility = 'hidden';
        cardRight.style.pointerEvents = 'none';
      }
    }

    function renderLoop() {
      var diff = targetProgress - currentProgress;
      if (Math.abs(diff) > 0.0001) {
        currentProgress += diff * 0.055;
      } else {
        currentProgress = targetProgress;
      }

      renderSequence();

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

    // Interactive preview cards: Corner highlight occurs ONLY on click
    previewCards.forEach(function (card) {
      card.addEventListener('click', function (e) {
        e.stopPropagation();
        var isAlreadyActive = card.classList.contains('active-highlight');
        previewCards.forEach(function (c) { c.classList.remove('active-highlight'); });
        if (!isAlreadyActive) {
          card.classList.add('active-highlight');
        }
      });
    });

    // Initial calculation on load
    onScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroScrollEmergence);
  } else {
    initHeroScrollEmergence();
  }
})();
