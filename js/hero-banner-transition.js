/**
 * TPS Empire - Scroll-Driven Hero Transition Experience Controller
 * Stage 1: Initial Statement & Framed Media Showcase
 * Stage 2: Scroll-Driven Cinematic Expansion -> Main Hero Title & CTA
 * (Pure Vanilla JS, 60fps requestAnimationFrame lerp interpolation)
 * Unified desktop & mobile interaction
 */

(function () {
  'use strict';

  function initHeroBannerTransition() {
    var track = document.getElementById('tpsHeroTransitionTrack');
    if (!track) return;

    var mediaCanvas = document.getElementById('tpsHeroMediaCanvas');
    var mediaImg = document.getElementById('tpsHeroMediaImg');
    var mediaOverlay = document.getElementById('tpsHeroMediaOverlay');
    var stage1 = document.getElementById('tpsHeroStage1Content');
    var stage2 = document.getElementById('tpsHeroStage2Content');
    var scrollCue = document.getElementById('tpsHeroScrollCue');
    var navbar = document.getElementById('ftco-navbar');

    if (!mediaCanvas || !stage1 || !stage2) return;

    function syncStage1Clearance() {
      var windowWidth = window.innerWidth || document.documentElement.clientWidth;
      var isSmallViewport = windowWidth <= 991.98;
      stage1.style.paddingTop = '';

      if (navbar) {
        var navStyle = window.getComputedStyle(navbar);
        if (navStyle.display !== 'none') {
          var navBottom = navbar.offsetTop + navbar.offsetHeight;
          if (navBottom > 0) {
            var currentTop = parseFloat(window.getComputedStyle(stage1).paddingTop) || 0;
            var minClearance = Math.ceil(navBottom + (isSmallViewport ? 22 : 24));
            if (currentTop < minClearance) {
              stage1.style.paddingTop = minClearance + 'px';
            }
          }
        }
      }
    }

    var targetProgress = 0;
    var currentProgress = 0;
    var isRunning = false;

    function clamp(val, min, max) {
      return Math.max(min, Math.min(max, val));
    }

    function lerp(start, end, t) {
      return start + (end - start) * t;
    }

    function prefersReducedMotion() {
      return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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

    function getMobileMediaLayout(windowHeight) {
      var s1Bottom = stage1.offsetHeight > 0 ? stage1.offsetHeight : 200;
      var gap = clamp(windowHeight * 0.045, 22, 48);
      var availableH = Math.max(160, windowHeight - s1Bottom - gap - 18);
      var baseCanvasH = Math.min(windowHeight * 0.36, availableH);
      var canvasCenter = s1Bottom + gap + (baseCanvasH / 2);
      return {
        heightVh: (baseCanvasH / windowHeight) * 100,
        topPercent: clamp((canvasCenter / windowHeight) * 100, 34, 72)
      };
    }

    function render(p) {
      var windowWidth = window.innerWidth || document.documentElement.clientWidth;
      var windowHeight = window.innerHeight || document.documentElement.clientHeight;
      var isMobile = windowWidth <= 767.98;
      var mobileLayout = isMobile ? getMobileMediaLayout(windowHeight) : null;

      if (prefersReducedMotion()) {
        if (p < 0.5) {
          stage1.style.opacity = '1';
          stage1.style.visibility = 'visible';
          stage1.style.transform = 'none';
          stage1.style.filter = 'none';
          stage1.style.pointerEvents = 'auto';

          stage2.style.opacity = '0';
          stage2.style.visibility = 'hidden';
          stage2.style.pointerEvents = 'none';

          mediaCanvas.style.top = (isMobile ? mobileLayout.topPercent.toFixed(2) : '64') + '%';
          mediaCanvas.style.left = '50%';
          mediaCanvas.style.transform = 'translate(-50%, -50%)';
          mediaCanvas.style.width = isMobile ? '88vw' : '78vw';
          mediaCanvas.style.maxWidth = isMobile ? '460px' : '1040px';
          mediaCanvas.style.height = (isMobile ? mobileLayout.heightVh.toFixed(2) : '48') + 'vh';
          mediaCanvas.style.maxHeight = isMobile ? '280px' : '480px';
          mediaCanvas.style.borderRadius = isMobile ? '12px' : '0px';
          if (mediaImg) mediaImg.style.transform = 'scale(1)';
          if (mediaOverlay) mediaOverlay.style.opacity = '0.35';
        } else {
          stage1.style.opacity = '0';
          stage1.style.visibility = 'hidden';
          stage1.style.pointerEvents = 'none';

          stage2.style.opacity = '1';
          stage2.style.visibility = 'visible';
          stage2.style.transform = 'none';
          stage2.style.filter = 'none';
          stage2.style.pointerEvents = 'auto';

          mediaCanvas.style.top = '50%';
          mediaCanvas.style.left = '50%';
          mediaCanvas.style.transform = 'translate(-50%, -50%)';
          mediaCanvas.style.width = '100vw';
          mediaCanvas.style.maxWidth = '100vw';
          mediaCanvas.style.height = '100vh';
          mediaCanvas.style.maxHeight = '100vh';
          mediaCanvas.style.borderRadius = '0px';
          if (mediaImg) mediaImg.style.transform = 'scale(1)';
          if (mediaOverlay) mediaOverlay.style.opacity = '0.72';
        }
        return;
      }

      // ------------------------------------------------------------------------
      // 1. Stage 1 Content (Statement & Pill Tags): Progress 0.0 -> 0.38
      // ------------------------------------------------------------------------
      var s1End = isMobile ? 0.35 : 0.38;
      var s1Start = isMobile ? 0.06 : 0.08;
      if (p < s1End) {
        var s1Prog = clamp((p - s1Start) / (s1End - s1Start), 0, 1);
        var s1Opacity = clamp(1 - s1Prog, 0, 1);
        var s1Y = -(p * (isMobile ? 50 : 90));
        var s1Scale = 1 - (p * (isMobile ? 0.06 : 0.10));
        var s1Blur = p * (isMobile ? 6 : 10);

        stage1.style.opacity = s1Opacity.toFixed(3);
        stage1.style.transform = 'translate3d(0, ' + s1Y.toFixed(1) + 'px, 0) scale(' + s1Scale.toFixed(3) + ')';
        stage1.style.filter = 'blur(' + s1Blur.toFixed(1) + 'px)';
        stage1.style.visibility = 'visible';
        stage1.style.pointerEvents = s1Opacity < 0.1 ? 'none' : 'auto';
      } else {
        stage1.style.opacity = '0';
        stage1.style.visibility = 'hidden';
        stage1.style.pointerEvents = 'none';
      }

      // ------------------------------------------------------------------------
      // 2. Media Canvas Expansion: Progress 0.0 -> 0.75
      // ------------------------------------------------------------------------
      var initialWidthVw = isMobile ? 88 : 78;
      var initialHeightVh = isMobile ? 36 : 48;
      var initialTopPercent = 64;

      if (isMobile && mobileLayout) {
        initialHeightVh = mobileLayout.heightVh;
        initialTopPercent = mobileLayout.topPercent;
      }

      var expCutoff = isMobile ? 0.72 : 0.75;
      var expProg = clamp(p / expCutoff, 0, 1);

      // Smooth cubic easing for expansion
      var easedExp = expProg < 0.5 
        ? 4 * expProg * expProg * expProg 
        : 1 - Math.pow(-2 * expProg + 2, 3) / 2;

      var curWidthVw = lerp(initialWidthVw, 100, easedExp);
      var curHeightVh = lerp(initialHeightVh, 100, easedExp);
      var curTopPercent = lerp(initialTopPercent, 50, easedExp);
      var curImgScale = lerp(isMobile ? 1.08 : 1.15, 1.0, easedExp);
      var curOverlay = lerp(0.35, 0.72, easedExp);
      var curRadius = isMobile ? lerp(12, 0, clamp(easedExp * 1.3, 0, 1)) : 0;

      mediaCanvas.style.top = curTopPercent.toFixed(2) + '%';
      mediaCanvas.style.left = '50%';
      mediaCanvas.style.transform = 'translate(-50%, -50%)';
      mediaCanvas.style.width = curWidthVw.toFixed(2) + 'vw';
      mediaCanvas.style.maxWidth = '100vw';
      mediaCanvas.style.height = curHeightVh.toFixed(2) + 'vh';
      mediaCanvas.style.maxHeight = '100vh';
      mediaCanvas.style.borderRadius = curRadius.toFixed(1) + 'px';

      if (easedExp >= 0.98) {
        mediaCanvas.style.boxShadow = 'none';
      } else {
        mediaCanvas.style.boxShadow = '0 25px 60px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1)';
      }

      if (mediaImg) {
        mediaImg.style.transform = 'scale(' + curImgScale.toFixed(3) + ')';
      }
      if (mediaOverlay) {
        mediaOverlay.style.opacity = curOverlay.toFixed(3);
      }

      // ------------------------------------------------------------------------
      // 3. Stage 2 Content (Main Hero Title & Action): Progress 0.22 -> 1.0
      // ------------------------------------------------------------------------
      var s2Start = isMobile ? 0.20 : 0.22;
      var s2Duration = isMobile ? 0.46 : 0.48;
      if (p >= s2Start) {
        var s2Prog = clamp((p - s2Start) / s2Duration, 0, 1);
        // Ease-out curve
        var easedS2 = 1 - Math.pow(1 - s2Prog, 3);

        var s2Opacity = easedS2;
        var s2Y = (1 - easedS2) * (isMobile ? 30 : 45);
        var s2Scale = (isMobile ? 0.97 : 0.95) + (easedS2 * (isMobile ? 0.03 : 0.05));
        var s2Blur = (1 - easedS2) * (isMobile ? 4 : 6);

        stage2.style.opacity = s2Opacity.toFixed(3);
        stage2.style.transform = 'translate3d(0, ' + s2Y.toFixed(1) + 'px, 0) scale(' + s2Scale.toFixed(3) + ')';
        stage2.style.filter = 'blur(' + s2Blur.toFixed(1) + 'px)';
        stage2.style.visibility = 'visible';
        stage2.style.pointerEvents = s2Opacity < 0.2 ? 'none' : 'auto';
      } else {
        stage2.style.opacity = '0';
        stage2.style.visibility = 'hidden';
        stage2.style.pointerEvents = 'none';
      }

      // ------------------------------------------------------------------------
      // 4. Scroll Cue: Progress 0.0 -> 0.15
      // ------------------------------------------------------------------------
      if (scrollCue) {
        if (!isMobile && p < 0.15) {
          var cueOpacity = clamp(1 - (p / 0.12), 0, 1);
          scrollCue.style.opacity = cueOpacity.toFixed(2);
          scrollCue.style.visibility = 'visible';
        } else {
          scrollCue.style.opacity = '0';
          scrollCue.style.visibility = 'hidden';
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

      render(currentProgress);

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

    function onResize() {
      syncStage1Clearance();
      onScroll();
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('load', function () {
      syncStage1Clearance();
      render(currentProgress);
    });

    // Initial setup on load
    syncStage1Clearance();
    targetProgress = calculateProgress();
    currentProgress = targetProgress;
    render(currentProgress);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroBannerTransition);
  } else {
    initHeroBannerTransition();
  }
})();
