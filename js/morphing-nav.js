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
    // Dynamic relative base prefix calculation for root, subdirectories and deep nested pages
    var basePrefix = '';
    var styleLink = document.querySelector('link[href*="style.css"], link[href*="style.min.css"]');
    if (styleLink) {
      var href = styleLink.getAttribute('href');
      var idx = href.indexOf('css/style');
      if (idx !== -1) {
        basePrefix = href.substring(0, idx);
      }
    }
    if (!basePrefix) {
      var path = window.location.pathname;
      if (path.indexOf('/legal/') !== -1 && (path.indexOf('/privacy-policy') !== -1 || path.indexOf('/terms-and-conditions') !== -1 || path.indexOf('/disclaimer') !== -1 || path.indexOf('/cookie-policy') !== -1)) {
        basePrefix = '../../';
      } else if (path.indexOf('/faq/') !== -1 || path.indexOf('/legal/') !== -1) {
        basePrefix = '../';
      }
    }

    var currentPath = window.location.pathname.toLowerCase();
    var isHome = currentPath.endsWith('/') || currentPath.endsWith('/index.html') && currentPath.indexOf('/legal') === -1 && currentPath.indexOf('/faq') === -1 || currentPath.endsWith('public_html') || currentPath.endsWith('public_html (54)');
    var isAbout = currentPath.indexOf('about') !== -1;
    var isServices = currentPath.indexOf('services') !== -1;
    var isBlog = currentPath.indexOf('blog') !== -1;
    var isFaq = currentPath.indexOf('faq') !== -1;
    var isContact = currentPath.indexOf('contact') !== -1;

    // 1. Ensure Floating Hamburger Button exists in DOM
    var floatingBtn = document.getElementById('tpsFloatingMenuBtn') || document.getElementById('faqFloatingMenuBtn');
    if (!floatingBtn) {
      floatingBtn = document.createElement('button');
      floatingBtn.type = 'button';
      floatingBtn.id = 'tpsFloatingMenuBtn';
      floatingBtn.className = 'tps-floating-hamburger-btn';
      floatingBtn.setAttribute('aria-label', 'Open Navigation Menu');
      floatingBtn.setAttribute('aria-controls', 'tpsOffcanvasNav');
      floatingBtn.setAttribute('title', 'Open Menu');
      floatingBtn.innerHTML = '<span class="tps-hamburger-lines"><span class="line line-1"></span><span class="line line-2"></span><span class="line line-3"></span></span>';
      document.body.appendChild(floatingBtn);
    } else {
      floatingBtn.classList.add('tps-floating-hamburger-btn');
    }

    // 1b. Ensure Floating Top-Left Round TPS Logo exists in DOM
    var floatingLogo = document.getElementById('tpsFloatingCornerLogo');
    if (!floatingLogo) {
      floatingLogo = document.createElement('a');
      floatingLogo.id = 'tpsFloatingCornerLogo';
      floatingLogo.className = 'tps-floating-corner-logo';
      floatingLogo.href = basePrefix + 'index.html';
      floatingLogo.setAttribute('aria-label', 'TPS Empire Home');
      floatingLogo.setAttribute('title', 'TPS Empire Home');
      floatingLogo.innerHTML = '<img src="' + basePrefix + 'images/logo.png?v=3" alt="TPS Empire Logo" class="brand-logo">';
      document.body.appendChild(floatingLogo);
    }

    // 2. Ensure Off-Canvas Drawer exists in DOM
    var drawer = document.getElementById('tpsOffcanvasNav') || document.getElementById('faqOffcanvasNav');
    if (!drawer) {
      drawer = document.createElement('div');
      drawer.id = 'tpsOffcanvasNav';
      drawer.className = 'tps-offcanvas-drawer';
      drawer.setAttribute('role', 'dialog');
      drawer.setAttribute('aria-modal', 'true');
      drawer.setAttribute('aria-label', 'Main Navigation Menu');

      drawer.innerHTML = [
        '<div class="tps-offcanvas-backdrop"></div>',
        '<div class="tps-offcanvas-panel">',
        '  <div class="tps-offcanvas-top-bar">',
        '    <a href="' + basePrefix + 'index.html" class="tps-offcanvas-brand" aria-label="TPS Empire Home">',
        '      <img src="' + basePrefix + 'images/logo.png?v=3" alt="TPS Empire Logo" class="brand-logo">',
        '      <span class="brand-text">TPS <span>Empire</span></span>',
        '    </a>',
        '    <button type="button" class="tps-offcanvas-close" id="tpsOffcanvasClose" aria-label="Close navigation menu">',
        '      <i class="fa fa-times" aria-hidden="true"></i>',
        '    </button>',
        '  </div>',
        '  <nav class="tps-offcanvas-nav">',
        '    <ul class="tps-offcanvas-links">',
        '      <li><a href="' + basePrefix + 'index.html" class="tps-nav-link ' + (isHome ? 'active' : '') + '"><span>Home</span></a></li>',
        '      <li><a href="' + basePrefix + 'about.html" class="tps-nav-link ' + (isAbout ? 'active' : '') + '"><span>About</span></a></li>',
        '      <li><a href="' + basePrefix + 'services.html" class="tps-nav-link ' + (isServices ? 'active' : '') + '"><span>Services</span></a></li>',
        '      <li><a href="' + basePrefix + 'blog.html" class="tps-nav-link ' + (isBlog ? 'active' : '') + '"><span>Blog</span></a></li>',
        '      <li><a href="' + basePrefix + 'faq.html" class="tps-nav-link ' + (isFaq ? 'active' : '') + '"><span>FAQ</span></a></li>',
        '      <li><a href="' + basePrefix + 'contact.html" class="tps-nav-link ' + (isContact ? 'active' : '') + '"><span>Contact</span></a></li>',
        '    </ul>',
        '  </nav>',
        '</div>'
      ].join('\n');

      document.body.appendChild(drawer);
    } else {
      drawer.classList.add('tps-offcanvas-drawer');
    }

    var closeBtn = drawer.querySelector('.tps-offcanvas-close') || drawer.querySelector('#faqOffcanvasClose') || drawer.querySelector('#tpsOffcanvasClose');
    var backdrop = drawer.querySelector('.tps-offcanvas-backdrop') || drawer.querySelector('.faq-offcanvas-backdrop');
    var navLinks = drawer.querySelectorAll('.tps-nav-link, .faq-nav-link');

    // 3. Scroll Monitoring for Morphing Transition & Footer Detection
    var scrollThreshold = 45;
    var footerEl = document.querySelector('footer, .ftco-footer');

    // 3b. Fluid Multi-Layer Wave Parallax & Morph Controller (Over FAQ & Footer on all pages)
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

    // 4. Open / Close Interactions
    function openMenu() {
      drawer.classList.add('open');
      if (floatingBtn) floatingBtn.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      drawer.classList.remove('open');
      if (floatingBtn) floatingBtn.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (floatingBtn) {
      floatingBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (drawer.classList.contains('open')) {
          closeMenu();
        } else {
          openMenu();
        }
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', function (e) {
        e.preventDefault();
        closeMenu();
      });
    }

    if (backdrop) {
      backdrop.addEventListener('click', function () {
        closeMenu();
      });
    }

    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        closeMenu();
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        closeMenu();
      }
    });
  }
})();
