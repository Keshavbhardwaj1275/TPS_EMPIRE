/**
 * TPS Empire - Smooth Page Transition Controller
 * Coordinates seamless page entry/exit animations and scroll progress tracking.
 */

(function () {
  'use strict';

  function initPageTransition() {
    // Remove any leftover blocking overlay elements if cached in DOM
    var oldOverlay = document.getElementById('tpsPageTransitionOverlay');
    if (oldOverlay && oldOverlay.parentNode) {
      oldOverlay.parentNode.removeChild(oldOverlay);
    }
    document.body.classList.remove('tps-page-transitioning');

    // 1. Scroll Progress Bar
    var progressTrack = document.getElementById('tpsScrollProgressTrack');
    if (!progressTrack) {
      progressTrack = document.createElement('div');
      progressTrack.id = 'tpsScrollProgressTrack';
      progressTrack.className = 'tps-scroll-progress-track';
      progressTrack.innerHTML = '<div class="tps-scroll-progress-bar" id="tpsScrollProgressBar"></div>';
      document.body.appendChild(progressTrack);
    }

    var progressBar = document.getElementById('tpsScrollProgressBar');
    var scrollTicking = false;
    function updateScrollProgress() {
      scrollTicking = false;
      if (!progressBar) return;
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (docHeight > 0) {
        var progress = (scrollTop / docHeight) * 100;
        progressBar.style.width = Math.min(100, Math.max(0, progress)) + '%';
      }
    }
    window.addEventListener('scroll', function () {
      if (!scrollTicking) {
        scrollTicking = true;
        window.requestAnimationFrame(updateScrollProgress);
      }
    }, { passive: true });
    updateScrollProgress();

    // 2. Speculation Rules (instant prerender/prefetch on hover/tap in Chromium)
    if (window.location.protocol !== 'file:' &&
        window.HTMLScriptElement &&
        typeof HTMLScriptElement.supports === 'function' &&
        HTMLScriptElement.supports('speculationrules')) {
      var specScript = document.createElement('script');
      specScript.type = 'speculationrules';
      specScript.textContent = JSON.stringify({
        prerender: [{
          where: {
            and: [
              { href_matches: '/*' },
              { not: { href_matches: '/*\\#*' } }
            ]
          },
          eagerness: 'moderate'
        }]
      });
      document.head.appendChild(specScript);
    }

    // 3. Lightweight Link Prefetch Fallback on Hover / Touchstart (for zero-delay page switching)
    if (window.location.protocol !== 'file:') {
      var prefetchedUrls = {};
      function prefetchLink(target) {
        var link = target && target.closest ? target.closest('a') : null;
        if (!link) return;
        var href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('tel:') || href.startsWith('mailto:')) {
          return;
        }
        if (link.target === '_blank') return;

        var url;
        try {
          url = new URL(link.href, window.location.origin);
        } catch (err) {
          return;
        }
        if (url.origin !== window.location.origin) return;
        if (url.pathname === window.location.pathname) return;

        var cleanHref = url.href.split('#')[0];
        if (prefetchedUrls[cleanHref]) return;
        prefetchedUrls[cleanHref] = true;

        var hint = document.createElement('link');
        hint.rel = 'prefetch';
        hint.as = 'document';
        hint.href = cleanHref;
        document.head.appendChild(hint);
      }

      document.addEventListener('pointerenter', function (e) {
        prefetchLink(e.target);
      }, { capture: true, passive: true });

      document.addEventListener('touchstart', function (e) {
        prefetchLink(e.target);
      }, { capture: true, passive: true });

      document.addEventListener('focusin', function (e) {
        prefetchLink(e.target);
      }, { passive: true });
    }
  }

  // Initialize immediately or on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPageTransition);
  } else {
    initPageTransition();
  }
})();
