/**
 * TPS Empire - Global Scroll Morphing Navbar & Right-Side Slide-Over Menu Drawer
 * Universal Controller for All Website Pages
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initGlobalMorphingNav();
  });

  function initGlobalMorphingNav() {
    // Remove any legacy secondary drawer/floating buttons so only the single dark navbar menu is used
    ['tpsFloatingMenuBtn', 'faqFloatingMenuBtn', 'tpsFloatingCornerLogo', 'tpsOffcanvasNav', 'faqOffcanvasNav'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });

    var navbar = document.getElementById('ftco-navbar');
    var navCollapse = document.getElementById('ftco-nav');
    var navToggler = navbar ? navbar.querySelector('.navbar-toggler') : null;

    function closeMobileMenu() {
      if (!navCollapse || !navCollapse.classList.contains('show')) return;
      if (window.jQuery && window.jQuery.fn && window.jQuery.fn.collapse) {
        window.jQuery(navCollapse).collapse('hide');
      } else {
        navCollapse.classList.remove('show');
        if (navToggler) {
          navToggler.classList.add('collapsed');
          navToggler.setAttribute('aria-expanded', 'false');
        }
      }
    }

    // 1. Scroll Monitoring for Header Pinning & Wave Morphing
    var scrollThreshold = 45;
    var footerEl = document.querySelector('footer, .ftco-footer');

    // 1b. Fluid Multi-Layer Wave Parallax & Morph Controller (Over FAQ & Footer on all pages)
    var waveTransitions = document.querySelectorAll('.tps-wave-section-transition');
    function lerp(a, b, t) { return a + (b - a) * t; }

    function updateWaveMorph() {
      if (!waveTransitions.length) return;
      var windowHeight = window.innerHeight || document.documentElement.clientHeight;

      waveTransitions.forEach(function (wave) {
        var rect = wave.getBoundingClientRect();
        if (rect.bottom > -100 && rect.top < windowHeight + 100) {
          var startFlatten = windowHeight * 0.90;
          var endFlatten = windowHeight * 0.15;
          var rawProgress = (startFlatten - rect.top) / (startFlatten - endFlatten);
          var morphP = Math.max(0, Math.min(1, rawProgress));

          var path1 = wave.querySelector('.tps-wave-layer-1 path, .tps-wave-path-1') || wave.querySelector('#homeWavePath1, #footerWavePath1');
          var path2 = wave.querySelector('.tps-wave-layer-2 path, .tps-wave-path-2') || wave.querySelector('#homeWavePath2, #footerWavePath2');
          var path3 = wave.querySelector('.tps-wave-layer-3 path, .tps-wave-path-3') || wave.querySelector('#homeWavePath3, #footerWavePath3');

          if (path1) {
            var y0 = lerp(130, 320, morphP);
            var cy1 = lerp(240, 320, morphP);
            var cy2 = lerp(20, 320, morphP);
            var y1 = lerp(130, 320, morphP);
            var cy3 = lerp(240, 320, morphP);
            var cy4 = lerp(50, 320, morphP);
            var y2 = lerp(120, 320, morphP);
            path1.setAttribute('d', 'M0,' + y0.toFixed(1) + ' C240,' + cy1.toFixed(1) + ' 440,' + cy2.toFixed(1) + ' 720,' + y1.toFixed(1) + ' C1000,' + cy3.toFixed(1) + ' 1200,' + cy4.toFixed(1) + ' 1440,' + y2.toFixed(1) + ' L1440,320 L0,320 Z');
          }

          if (path2) {
            var y0 = lerp(175, 320, morphP);
            var cy1 = lerp(70, 320, morphP);
            var cy2 = lerp(270, 320, morphP);
            var y1 = lerp(160, 320, morphP);
            var cy3 = lerp(50, 320, morphP);
            var cy4 = lerp(220, 320, morphP);
            var y2 = lerp(165, 320, morphP);
            path2.setAttribute('d', 'M0,' + y0.toFixed(1) + ' C300,' + cy1.toFixed(1) + ' 540,' + cy2.toFixed(1) + ' 820,' + y1.toFixed(1) + ' C1100,' + cy3.toFixed(1) + ' 1280,' + cy4.toFixed(1) + ' 1440,' + y2.toFixed(1) + ' L1440,320 L0,320 Z');
          }

          if (path3) {
            var y0 = lerp(230, 320, morphP);
            var cy1 = lerp(150, 320, morphP);
            var cy2 = lerp(290, 320, morphP);
            var y1 = lerp(200, 320, morphP);
            var cy3 = lerp(120, 320, morphP);
            var cy4 = lerp(260, 320, morphP);
            var y2 = lerp(220, 320, morphP);
            path3.setAttribute('d', 'M0,' + y0.toFixed(1) + ' C320,' + cy1.toFixed(1) + ' 600,' + cy2.toFixed(1) + ' 920,' + y1.toFixed(1) + ' C1200,' + cy3.toFixed(1) + ' 1340,' + cy4.toFixed(1) + ' 1440,' + y2.toFixed(1) + ' L1440,320 L0,320 Z');
          }

          var nextSec = wave.nextElementSibling;
          if (nextSec && (nextSec.classList.contains('tps-faq-cascade-section') || nextSec.classList.contains('ftco-footer'))) {
            var maxDrop = nextSec.classList.contains('ftco-footer') ? -30 : -45;
            var dropOffset = (1 - morphP) * maxDrop;
            nextSec.style.transform = 'translateY(' + dropOffset.toFixed(1) + 'px)';
          }
        }
      });
    }

    function handleScroll() {
      var scrollY = window.pageYOffset || document.documentElement.scrollTop;
      var windowHeight = window.innerHeight || document.documentElement.clientHeight;

      // Header visibility
      if (scrollY > scrollThreshold) {
        document.body.classList.add('navbar-scrolled');
      } else {
        document.body.classList.remove('navbar-scrolled');
      }

      // Footer visibility check
      if (footerEl) {
        var footerRect = footerEl.getBoundingClientRect();
        if (footerRect.top <= windowHeight * 0.85) {
          document.body.classList.add('footer-in-view');
        } else {
          document.body.classList.remove('footer-in-view');
        }
      }

      // Wave morphing animation
      updateWaveMorph();
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    // 2. Single Mobile Navbar Collapse Interactions (close on link tap, outside tap, or Escape)
    if (navCollapse) {
      var collapseLinks = navCollapse.querySelectorAll('.nav-link');
      collapseLinks.forEach(function (link) {
        link.addEventListener('click', function () {
          closeMobileMenu();
        });
      });

      document.addEventListener('click', function (e) {
        if (navbar && !navbar.contains(e.target)) {
          closeMobileMenu();
        }
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          closeMobileMenu();
        }
      });
    }
  }
})();
