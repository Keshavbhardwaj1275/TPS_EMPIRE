/**
 * TPS Empire - Scroll-Driven Strategic Work Accordion & Image Showcase Controller
 * Synchronizes left vertical accordion items with right-side image transitions based on scroll
 */

(function () {
  'use strict';

  function initStrategicWorkScroll() {
    var section = document.getElementById('tpsStrategicWorkSection') || document.querySelector('.tps-strategic-work-section');
    var track = document.getElementById('tpsStrategicWorkTrack') || (section ? section.querySelector('.tps-strategic-work-track') : null);
    if (!track) return;

    var accordionItems = track.querySelectorAll('.tps-accordion-item');
    var imageLayers = track.querySelectorAll('.tps-strategic-image-layer');
    var totalItems = accordionItems.length;

    if (totalItems < 2 || !imageLayers.length) return;

    var targetProgress = 0;
    var currentProgress = 0;
    var isRunning = false;
    var activeIndex = -1;

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

    function setActiveSlide(index) {
      if (index === activeIndex) return;
      activeIndex = index;

      // Update left accordion items
      accordionItems.forEach(function (item, i) {
        if (i === index) {
          item.classList.add('is-active');
        } else {
          item.classList.remove('is-active');
        }
      });

      // Update right image layers
      imageLayers.forEach(function (layer, i) {
        if (i === index) {
          layer.classList.add('is-active');
        } else {
          layer.classList.remove('is-active');
        }
      });
    }

    function render(prog) {
      var isDesktop = window.innerWidth > 991.98;

      if (!isDesktop) {
        // Mobile fallback - ensure at least first slide is active
        setActiveSlide(0);
        return;
      }

      var floatIndex = prog * totalItems;
      var newIndex = Math.min(Math.floor(floatIndex), totalItems - 1);

      if (prog >= 0.999) {
        newIndex = totalItems - 1;
      }

      setActiveSlide(newIndex);
    }

    function renderLoop() {
      var diff = targetProgress - currentProgress;
      if (Math.abs(diff) > 0.0005) {
        currentProgress += diff * 0.1;
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

    // Interactive hovering and clicking on accordion items to jump to that slide
    accordionItems.forEach(function (item, i) {
      item.addEventListener('mouseenter', function () {
        setActiveSlide(i);
      });

      item.addEventListener('click', function () {
        var isDesktop = window.innerWidth > 991.98;
        if (!isDesktop) {
          setActiveSlide(i);
          return;
        }

        var rect = track.getBoundingClientRect();
        var scrollY = window.pageYOffset || document.documentElement.scrollTop;
        var trackTop = rect.top + scrollY;
        var trackHeight = rect.height;
        var windowHeight = window.innerHeight || document.documentElement.clientHeight;
        var totalScrollable = trackHeight - windowHeight;

        var targetScrollY = trackTop + (i / totalItems) * totalScrollable + 20;
        window.scrollTo({
          top: targetScrollY,
          behavior: 'smooth'
        });
      });
    });

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    // Initial render
    setActiveSlide(0);
    onScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStrategicWorkScroll);
  } else {
    initStrategicWorkScroll();
  }
})();
