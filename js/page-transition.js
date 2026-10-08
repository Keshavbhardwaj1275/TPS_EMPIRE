/**
 * TPS Empire - Smooth Page Transition Controller
 * Coordinates seamless page entry/exit animations and scroll progress tracking.
 */

(function () {
  'use strict';

  function initPageTransition() {
    // 1. Create or bind the overlay element
    var overlay = document.getElementById('tpsPageTransitionOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'tpsPageTransitionOverlay';
      overlay.className = 'tps-page-transition-overlay';
      overlay.innerHTML = 
        '<div class="tps-transition-curtain"></div>' +
        '<div class="tps-transition-brand">' +
          '<img src="images/tps-logo-circle.png" alt="TPS Empire" class="tps-transition-logo">' +
          '<div class="tps-transition-loader-bar"></div>' +
        '</div>';
      document.body.appendChild(overlay);
    }

    // 2. Create Scroll Progress Bar
    var progressTrack = document.getElementById('tpsScrollProgressTrack');
    if (!progressTrack) {
      progressTrack = document.createElement('div');
      progressTrack.id = 'tpsScrollProgressTrack';
      progressTrack.className = 'tps-scroll-progress-track';
      progressTrack.innerHTML = '<div class="tps-scroll-progress-bar" id="tpsScrollProgressBar"></div>';
      document.body.appendChild(progressTrack);
    }

    var progressBar = document.getElementById('tpsScrollProgressBar');
    function updateScrollProgress() {
      if (!progressBar) return;
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (docHeight > 0) {
        var progress = (scrollTop / docHeight) * 100;
        progressBar.style.width = Math.min(100, Math.max(0, progress)) + '%';
      }
    }
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress();

    // 3. Play Reveal Animation on Page Load
    function revealPage() {
      setTimeout(function () {
        overlay.classList.add('is-loaded');
        overlay.classList.remove('is-exiting');
        document.body.classList.remove('tps-page-transitioning');
      }, 80);
    }

    if (document.readyState === 'complete') {
      revealPage();
    } else {
      window.addEventListener('load', revealPage);
    }

    // Handle back/forward cache in browsers
    window.addEventListener('pageshow', function (event) {
      if (event.persisted) {
        revealPage();
      }
    });

    // 4. Intercept Internal Link Clicks for Smooth Exit Sweep
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a');
      if (!link) return;

      var href = link.getAttribute('href');
      var target = link.getAttribute('target');

      // Check if valid internal HTML page link
      if (
        !href ||
        href.startsWith('#') ||
        href.startsWith('javascript:') ||
        href.startsWith('tel:') ||
        href.startsWith('mailto:') ||
        target === '_blank' ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey
      ) {
        return;
      }

      // Check if URL points to same domain / internal html
      var url;
      try {
        url = new URL(link.href, window.location.origin);
      } catch (err) {
        return;
      }

      if (url.origin === window.location.origin) {
        // If clicking link to current exact URL, allow default
        if (url.pathname === window.location.pathname && url.hash) {
          return;
        }

        e.preventDefault();
        overlay.classList.remove('is-loaded');
        overlay.classList.add('is-exiting');

        // Navigate after smooth exit curtain animation
        setTimeout(function () {
          window.location.href = link.href;
        }, 360);

        // Failsafe timeout
        setTimeout(function () {
          window.location.href = link.href;
        }, 800);
      }
    });
  }

  // Initialize immediately or on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPageTransition);
  } else {
    initPageTransition();
  }
})();
