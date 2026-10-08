/**
 * TPS Empire - Scroll-Driven Hero Transition Experience Controller
 * Stage 1: Initial Statement & Framed Media Showcase
 * Stage 2: Scroll-Driven Cinematic Expansion -> Main Hero Title & CTA
 * (Pure Vanilla JS, 60fps requestAnimationFrame lerp interpolation)
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

    if (!mediaCanvas || !stage1 || !stage2) return;

    var targetProgress = 0;
    var currentProgress = 0;
    var isRunning = false;

    function clamp(val, min, max) {
      return Math.max(min, Math.min(max, val));
    }

    function lerp(start, end, t) {
      return start + (end - start) * t;
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

    function render(p) {
      var windowWidth = window.innerWidth || document.documentElement.clientWidth;
      var windowHeight = window.innerHeight || document.documentElement.clientHeight;
      var isMobile = windowWidth <= 767.98;

      // ------------------------------------------------------------------------
      // 1. Stage 1 Content (Statement & Pill Tags): Progress 0.0 -> 0.35
      // ------------------------------------------------------------------------
      if (p < 0.35) {
        var s1Prog = p / 0.30; // 0 to 1
        var s1Opacity = clamp(1 - s1Prog, 0, 1);
        var s1Y = -(p * 100);
        var s1Scale = 1 - (p * 0.12);
        var s1Blur = p * 12;

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
      var initialWidthVw = isMobile ? 90 : 78;
      var initialHeightVh = isMobile ? 42 : 48;
      var initialTopPercent = isMobile ? 66 : 64;
      var expProg = clamp(p / 0.75, 0, 1);
      // Smooth cubic easing for expansion
      var easedExp = expProg < 0.5 
        ? 4 * expProg * expProg * expProg 
        : 1 - Math.pow(-2 * expProg + 2, 3) / 2;

      var curWidthVw = lerp(initialWidthVw, 100, easedExp);
      var curHeightVh = lerp(initialHeightVh, 100, easedExp);
      var curTopPercent = lerp(initialTopPercent, 50, easedExp);
      var curImgScale = lerp(1.15, 1.0, easedExp);
      var curOverlay = lerp(0.35, 0.70, easedExp);

      mediaCanvas.style.top = curTopPercent.toFixed(2) + '%';
      mediaCanvas.style.width = curWidthVw.toFixed(2) + 'vw';
      mediaCanvas.style.maxWidth = easedExp >= 0.99 ? '100vw' : '100%';
      mediaCanvas.style.height = curHeightVh.toFixed(2) + 'vh';
      mediaCanvas.style.maxHeight = easedExp >= 0.99 ? '100vh' : '100%';
      mediaCanvas.style.borderRadius = '0px';

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
      // 3. Stage 2 Content (Main Hero Title & Action): Progress 0.30 -> 1.0
      // ------------------------------------------------------------------------
      if (p >= 0.30) {
        var s2Prog = clamp((p - 0.30) / 0.50, 0, 1);
        // Ease-out curve
        var easedS2 = 1 - Math.pow(1 - s2Prog, 3);

        var s2Opacity = easedS2;
        var s2Y = (1 - easedS2) * 55;
        var s2Scale = 0.95 + (easedS2 * 0.05);
        var s2Blur = (1 - easedS2) * 8;

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
        if (p < 0.15) {
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
      onScroll();
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    // Initial setup on load
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
