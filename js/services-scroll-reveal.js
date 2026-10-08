/**
 * TPS EMPIRE - VERTICAL SCROLL-DRIVEN SERVICES CONTROLLER
 * Smooth 60FPS scroll observer for editorial 3-column sticky showcase:
 * - Dynamic scroll-linked translation/parallax for the center pastel card
 * - Active slide switching with smooth vertical slide transitions
 * - Dynamic visibility for the Royal Blue 'Send a Request' floating action button
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    const servicesSection = document.getElementById('services-section');
    const leftSteps = document.querySelectorAll('.tps-story-column-left .tps-story-step-item');
    const rightSteps = document.querySelectorAll('.tps-story-column-right .tps-story-step-item');
    const artworkSlides = document.querySelectorAll('.tps-pastel-artwork-slide');
    const cardFrame = document.querySelector('.tps-pastel-card-frame');
    const requestBubble = document.querySelector('.tps-floating-request-bubble');

    if (!servicesSection || !leftSteps.length || !artworkSlides.length) return;

    let currentIndex = 0;

    function setActiveStep(index, progressOffset) {
      currentIndex = index;

      // Update Left Steps
      leftSteps.forEach(function (step, i) {
        if (i === index) {
          step.classList.add('is-active');
        } else {
          step.classList.remove('is-active');
        }
      });

      // Update Right Steps
      rightSteps.forEach(function (step, i) {
        if (i === index) {
          step.classList.add('is-active');
        } else {
          step.classList.remove('is-active');
        }
      });

      // Update Center Artwork Slides with vertical movement
      artworkSlides.forEach(function (slide, i) {
        if (i === index) {
          slide.classList.remove('is-passed');
          slide.classList.add('is-active');
        } else if (i < index) {
          slide.classList.remove('is-active');
          slide.classList.add('is-passed');
        } else {
          slide.classList.remove('is-active');
          slide.classList.remove('is-passed');
        }
      });

      // Apply subtle dynamic parallax translation to the card frame as you scroll
      if (cardFrame && typeof progressOffset === 'number') {
        const subtleY = Math.max(-14, Math.min(14, progressOffset * -0.06));
        cardFrame.style.transform = 'translateY(' + subtleY + 'px)';
      }
    }

    // Scroll Handler
    function handleScroll() {
      // 1. Manage Floating 'Send a Request' Button Visibility (Strictly within Our Best Services)
      if (requestBubble && servicesSection) {
        const secRect = servicesSection.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        const counterSection = document.getElementById('section-counter');

        // Check if the user has reached or scrolled into the next section (Consult us / #section-counter)
        let isPastBestServices = false;
        if (counterSection) {
          const counterRect = counterSection.getBoundingClientRect();
          // As soon as #section-counter enters near viewport, hide the button
          if (counterRect.top <= (viewportHeight * 0.75)) {
            isPastBestServices = true;
          }
        }

        // Check if user is currently inside 'Our Best Services' (#services-section)
        const isInsideBestServices = secRect.top <= (viewportHeight * 0.6) && secRect.bottom >= (viewportHeight * 0.3) && !isPastBestServices;

        if (isInsideBestServices) {
          requestBubble.classList.add('is-visible');
        } else {
          requestBubble.classList.remove('is-visible');
        }
      }

      // 2. Desktop Center Card Movement & Active Step Tracking
      if (window.innerWidth >= 992) {
        const viewportCenter = window.innerHeight * 0.48;
        let closestIndex = 0;
        let minDistance = Infinity;
        let activeDistOffset = 0;

        leftSteps.forEach(function (step, index) {
          const rect = step.getBoundingClientRect();
          const stepCenter = rect.top + rect.height / 2;
          const dist = Math.abs(stepCenter - viewportCenter);

          if (dist < minDistance) {
            minDistance = dist;
            closestIndex = index;
            activeDistOffset = stepCenter - viewportCenter;
          }
        });

        setActiveStep(closestIndex, activeDistOffset);
      }
    }

    // Initial setup
    setActiveStep(0, 0);
    handleScroll();

    // Throttled Scroll Listener using requestAnimationFrame
    let isTicking = false;
    window.addEventListener('scroll', function () {
      if (!isTicking) {
        window.requestAnimationFrame(function () {
          handleScroll();
          isTicking = false;
        });
        isTicking = true;
      }
    }, { passive: true });

    window.addEventListener('resize', handleScroll);
  });
})();
