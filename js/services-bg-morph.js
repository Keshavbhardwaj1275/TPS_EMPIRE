/**
 * TPS Empire - Dynamic Scroll Background Color Morphing Controller (Services Page)
 * Seamlessly morphs the page background and typography between brand dark and luminous light
 * themes as the user scrolls through different sections, exactly as seen in the reference video.
 */

(function () {
  'use strict';

  function initServicesBgMorph() {
    var body = document.body;
    body.classList.add('services-page');

    // 1. Inject or bind background canvas layer for hardware-accelerated color morphing
    var canvas = document.getElementById('tpsBgMorphCanvas');
    if (!canvas) {
      canvas = document.createElement('div');
      canvas.id = 'tpsBgMorphCanvas';
      canvas.className = 'tps-bg-morph-canvas';
      body.insertBefore(canvas, body.firstChild);
    }

    // 2. Identify sections and their target color themes: Light -> Dark -> Light -> Midnight
    var sectionThemes = [
      {
        selector: '.tps-scroll-stack-section',
        theme: 'theme-light'
      },
      {
        selector: '.tps-services-editorial-section',
        theme: 'theme-dark'
      },
      {
        selector: '#section-counter',
        theme: 'theme-light'
      },
      {
        selector: '.ftco-footer',
        theme: 'theme-midnight'
      }
    ];

    // Collect valid section elements
    var sections = [];
    sectionThemes.forEach(function (item) {
      var el = document.querySelector(item.selector);
      if (el) {
        el.setAttribute('data-bg-theme', item.theme);
        sections.push({
          element: el,
          theme: item.theme
        });
      }
    });

    if (sections.length === 0) return;

    var currentTheme = '';
    var isTicking = false;

    function applyTheme(themeName) {
      if (currentTheme === themeName) return;
      currentTheme = themeName;

      // Remove previous theme classes
      body.classList.remove('theme-dark', 'theme-light', 'theme-midnight');
      body.classList.add(themeName);

      // Dispatch custom event for connected components
      var event = new CustomEvent('tpsThemeChange', { detail: { theme: themeName } });
      window.dispatchEvent(event);
    }

    function updateThemeOnScroll() {
      var viewportHeight = window.innerHeight;
      var triggerPoint = viewportHeight * 0.42; // 42% from top of viewport

      var activeTheme = sections[0].theme;

      for (var i = 0; i < sections.length; i++) {
        var rect = sections[i].element.getBoundingClientRect();
        // Check if section top has crossed or is near the trigger point
        if (rect.top <= triggerPoint && rect.bottom >= triggerPoint) {
          activeTheme = sections[i].theme;
          break;
        } else if (rect.top <= triggerPoint) {
          activeTheme = sections[i].theme;
        }
      }

      applyTheme(activeTheme);
      isTicking = false;
    }

    function onScroll() {
      if (!isTicking) {
        requestAnimationFrame(updateThemeOnScroll);
        isTicking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    // Initial check
    updateThemeOnScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initServicesBgMorph);
  } else {
    initServicesBgMorph();
  }
})();
