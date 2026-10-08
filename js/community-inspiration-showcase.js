/**
 * TPS Empire - "Our Community, Our Inspiration" Interactive Showcase Controller
 * Smooth scroll-driven animation:
 * 1. Initial: "Our Community" [Photo] "Our Inspiration"
 * 2. Scroll (0 -> 40%): Title slides together side-by-side to the top ("Our Community, Our Inspiration")
 *    while the photo slides cleanly below the title (no zoom distortion).
 * 3. Scroll (40% -> 100%): 4 dialogue cards appear one-by-one below the photo with zero overlap.
 */

(function () {
  'use strict';

  function initCommunityInspiration() {
    var section = document.getElementById('our-community-inspiration') || document.querySelector('.tps-community-inspiration-section');
    if (!section) return;

    var track = section.querySelector('.tps-community-scroll-track');
    var headerWrap = document.getElementById('tpsCommunityHeaderWrap');
    var titleLeft = document.getElementById('tpsTitleLeft');
    var comma = document.getElementById('tpsTitleComma');
    var titleRight = document.getElementById('tpsTitleRight');
    var morphPhoto = document.getElementById('tpsMorphPhoto');
    var badge = section.querySelector('.tps-title-avatar-badge');
    var cardsGrid = document.getElementById('tpsCommunityCardsGrid');
    var cards = section.querySelectorAll('.tps-dialog-card');

    if (!track || !headerWrap || !morphPhoto) return;

    var targetProgress = 0;
    var currentProgress = 0;
    var isRunning = false;

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

    function getTextShift() {
      var badgeWidth = badge ? badge.offsetWidth : 380;
      if (!badgeWidth || badgeWidth <= 0) badgeWidth = 380;
      return (badgeWidth / 2) + 24;
    }

    function renderFrame(p) {
      var isDesktop = window.innerWidth > 991.98;

      if (!isDesktop) {
        // Reset desktop transforms on mobile/tablet
        if (headerWrap) headerWrap.style.transform = '';
        if (titleLeft) titleLeft.style.transform = '';
        if (titleRight) titleRight.style.transform = '';
        if (comma) comma.style.opacity = '1';
        if (morphPhoto) morphPhoto.style.transform = '';
        if (cardsGrid) cardsGrid.style.transform = '';
        cards.forEach(function (c) { c.classList.add('is-visible'); });
        return;
      }

      var textShift = getTextShift();

      // Phase 1: 0.0 -> 0.40 (Title Slide Together & Photo Drop Below Title)
      var p1 = clamp(p / 0.40, 0, 1);
      // Smooth cubic ease
      var easeP1 = p1 * p1 * (3 - 2 * p1);

      // 1. Text sliding together (Initial: separated by textShift, Ending: 0)
      var currentLeftShift = -textShift * (1 - easeP1);
      var currentRightShift = textShift * (1 - easeP1);

      if (titleLeft) {
        titleLeft.style.transform = 'translateX(' + currentLeftShift.toFixed(2) + 'px)';
      }
      if (titleRight) {
        titleRight.style.transform = 'translateX(' + currentRightShift.toFixed(2) + 'px)';
      }
      if (comma) {
        comma.style.opacity = easeP1.toFixed(3);
      }

      // 2. Header Translation (Centers vertically initially, moves smoothly to top)
      var topHeaderOffset = -210;
      var headerY = easeP1 * topHeaderOffset;
      headerWrap.style.transform = 'translate(-50%, calc(-50% + ' + headerY.toFixed(2) + 'px))';

      // 3. Photo Movement: Slides smoothly from center gap down to directly below title (No zoom in)
      var targetPhotoY = -55;
      var photoY = easeP1 * targetPhotoY;
      morphPhoto.style.transform = 'translate(-50%, calc(-50% + ' + photoY.toFixed(2) + 'px))';

      // 4. Cards Reveal (Phase 2: 0.40 -> 1.00)
      var cardThresholds = [0.44, 0.58, 0.72, 0.86];

      cards.forEach(function (card, idx) {
        var threshold = cardThresholds[idx];
        var isCardActive = p >= threshold;

        if (isCardActive) {
          card.classList.add('is-visible');
        } else {
          card.classList.remove('is-visible');
        }
      });
    }

    function renderLoop() {
      var diff = targetProgress - currentProgress;
      if (Math.abs(diff) > 0.0004) {
        currentProgress += diff * 0.14;
      } else {
        currentProgress = targetProgress;
      }

      renderFrame(currentProgress);

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
      onScroll();
    }, { passive: true });

    // Initial positioning setup
    setTimeout(function () {
      targetProgress = calculateProgress();
      currentProgress = targetProgress;
      renderFrame(currentProgress);
    }, 60);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCommunityInspiration);
  } else {
    initCommunityInspiration();
  }
})();
