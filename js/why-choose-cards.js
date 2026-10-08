/**
 * TPS Empire - "Our Advantage / Why Choose TPS Empire" Interactive Cards Controller
 * Handles touch toggling, keyboard accessibility, and staggered scroll-reveal animations.
 */

(function () {
  'use strict';

  function initWhyChooseCards() {
    var cards = document.querySelectorAll('.tps-adv-card');
    if (!cards || cards.length === 0) return;

    // 1. Staggered Scroll-Reveal with IntersectionObserver
    var revealElements = document.querySelectorAll('.tps-adv-reveal');
    if ('IntersectionObserver' in window) {
      var observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.15
      };

      var revealObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('tps-adv-visible');
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      revealElements.forEach(function (el, index) {
        // Apply slight progressive delay based on card index
        var delay = (index % 3) * 120;
        el.style.transitionDelay = delay + 'ms';
        revealObserver.observe(el);
      });
    } else {
      // Fallback for older browsers
      revealElements.forEach(function (el) {
        el.classList.add('tps-adv-visible');
      });
    }

    // 2. Touch and Click Interaction (for mobile and tablet)
    cards.forEach(function (card) {
      var btn = card.querySelector('.tps-adv-card-btn');

      // Helper function to toggle card active state
      function toggleCard(e) {
        var isTouch = e.type === 'touchend' || (e.pointerType && e.pointerType === 'touch');
        var isClick = e.type === 'click';

        // Check if currently active
        var isCurrentlyActive = card.classList.contains('is-active');

        // Close all other cards first
        cards.forEach(function (otherCard) {
          if (otherCard !== card) {
            otherCard.classList.remove('is-active');
            var otherBtn = otherCard.querySelector('.tps-adv-card-btn');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle state for current card if touched or clicked
        if (isCurrentlyActive) {
          card.classList.remove('is-active');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        } else {
          card.classList.add('is-active');
          if (btn) btn.setAttribute('aria-expanded', 'true');
        }
      }

      // Handle card click / touch
      card.addEventListener('click', function (e) {
        // If clicking inside on mobile/tablet or direct tap
        if (window.innerWidth <= 992) {
          toggleCard(e);
        }
      });

      // Keyboard Accessibility
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'region');
      var cardTitle = card.querySelector('.tps-adv-card-title');
      if (cardTitle) {
        card.setAttribute('aria-label', cardTitle.textContent.trim());
      }

      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleCard(e);
        }
      });

      if (btn) {
        btn.setAttribute('aria-expanded', 'false');
      }
    });

    // Close any active card when clicking outside
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.tps-adv-card')) {
        cards.forEach(function (card) {
          card.classList.remove('is-active');
          var btn = card.querySelector('.tps-adv-card-btn');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        });
      }
    });
  }

  // Initialize on DOMContentLoaded or immediately if already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWhyChooseCards);
  } else {
    initWhyChooseCards();
  }
})();
