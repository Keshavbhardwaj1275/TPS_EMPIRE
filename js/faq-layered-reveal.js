/**
 * TPS Empire - FAQ Interactive Controller
 * Features:
 * 1. Intro Fullscreen Stage -> Smooth FAQ Pill Zoom-Out Fullscreen Transition -> Waterfall Reveal
 * 2. Scroll-Driven Hanging Cards Cascade with Synchronized Connector Wires
 * 3. Interactive Accordion Drawers, Feedback Voting, and Permalink Copy
 * 4. Scroll Depth Progress Indicator
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    initFaqScrollDrivenZoom();
    initScrollCascadeCards();
    initFaqAccordionAndFeedback();
    initScrollProgressBar();
  });

  /* ==========================================================================
     1. Real-Time Scroll-Driven Continuous Zoom System
     ========================================================================== */
  function initFaqScrollDrivenZoom() {
    const track = document.getElementById('faqScrollZoomTrack');
    const heroContent = document.getElementById('faqHeroContent');
    const heroHeading = heroContent ? heroContent.querySelector('.faq-section-morph-heading') : null;
    const heroLead = heroContent ? heroContent.querySelector('.faq-section-morph-lead') : null;
    const pillBtn = document.getElementById('faqDockedPillTarget');
    if (!track || !heroContent || !pillBtn) return;

    let ticking = false;

    function updateZoom() {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      const maxScroll = Math.max(200, window.innerHeight * 0.75);

      // Calculate continuous progress between 0 (top) and 1 (zoom complete)
      const progress = Math.min(1, Math.max(0, scrollY / maxScroll));

      // 1. Text Fade & Translate (Smoothly fades in first 35% of scroll)
      const textProg = Math.min(1, progress / 0.35);
      const textOpacity = (1 - textProg).toFixed(3);
      const textTranslate = (-textProg * 45).toFixed(1);

      if (heroHeading) {
        heroHeading.style.opacity = textOpacity;
        heroHeading.style.transform = `translate3d(0, ${textTranslate}px, 0)`;
      }
      if (heroLead) {
        heroLead.style.opacity = textOpacity;
        heroLead.style.transform = `translate3d(0, ${textTranslate}px, 0)`;
      }

      // 2. FAQ Box Continuous Zoom (Crisp Solid Vector Expansion)
      const scale = (1 + Math.pow(progress, 2.0) * 38).toFixed(3);

      // Fade inner text/icon quickly so no small fonts blur when scaled
      const innerProg = Math.min(1, progress / 0.15);
      const innerOpacity = (1 - innerProg).toFixed(3);
      for (let i = 0; i < pillBtn.children.length; i++) {
        pillBtn.children[i].style.opacity = innerOpacity;
      }

      // Smoothly fade out the solid expanding box when reaching screen edges (> 75% progress)
      let pillOpacity = 1;
      if (progress > 0.75) {
        pillOpacity = Math.max(0, 1 - (progress - 0.75) / 0.25).toFixed(3);
      }

      pillBtn.style.transform = `scale(${scale})`;
      pillBtn.style.opacity = pillOpacity;

      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateZoom);
        ticking = true;
      }
    }, { passive: true });

    window.addEventListener('resize', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateZoom);
        ticking = true;
      }
    }, { passive: true });

    // Optional click to smoothly scroll to questions
    pillBtn.addEventListener('click', () => {
      const questionsSection = document.getElementById('faqQuestionsSection');
      if (questionsSection) {
        questionsSection.scrollIntoView({ behavior: 'smooth' });
      }
    });

    // Initial check
    updateZoom();
  }

  /* ==========================================================================
     1. Scroll Progress Bar
     ========================================================================== */
  function initScrollProgressBar() {
    const bar = document.querySelector('.faq-scroll-progress-bar');
    if (!bar) return;

    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = scrollPercent + '%';
    }, { passive: true });
  }

  /* ==========================================================================
     2. Scroll-Driven Hanging Cards Cascade (with Synchronized Connector Wires)
     ========================================================================== */
  function initScrollCascadeCards() {
    const cards = Array.from(document.querySelectorAll('.tps-faq-card'));
    if (!cards.length) return;

    let ticking = false;

    const checkCardsVisibility = () => {
      const windowHeight = window.innerHeight;

      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        // Reveal when top of card reaches within 90% of viewport height
        if (rect.top < windowHeight * 0.90 && rect.bottom > 20) {
          card.classList.add('is-card-visible');
        } else if (rect.top > windowHeight) {
          // Reset if scrolled back up
          card.classList.remove('is-card-visible');
        }
      });

      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(checkCardsVisibility);
        ticking = true;
      }
    }, { passive: true });

    window.addEventListener('resize', checkCardsVisibility, { passive: true });
    // Initial check
    setTimeout(checkCardsVisibility, 100);
  }

  /* ==========================================================================
     3. Interactive Accordion Drawers, Feedback Voting & Permalink Copy
     ========================================================================== */
  function initFaqAccordionAndFeedback() {
    const cards = document.querySelectorAll('.tps-faq-card');
    const toast = document.getElementById('faqToast');
    let toastTimeout = null;

    function showToast(message, iconClass = 'fa fa-check-circle') {
      if (!toast) return;
      const msgSpan = toast.querySelector('.faq-toast-message');
      const icon = toast.querySelector('i');
      if (msgSpan) msgSpan.textContent = message;
      if (icon) icon.className = iconClass;

      toast.classList.add('show');
      if (toastTimeout) clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
      }, 3500);
    }

    let hoverTimeout = null;

    cards.forEach((card) => {
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-expanded', card.classList.contains('is-open') ? 'true' : 'false');

      const openCard = () => {
        cards.forEach((c) => {
          if (c !== card) {
            c.classList.remove('is-open');
            c.setAttribute('aria-expanded', 'false');
          }
        });
        card.classList.add('is-open');
        card.setAttribute('aria-expanded', 'true');
      };

      const closeCard = () => {
        card.classList.remove('is-open');
        card.setAttribute('aria-expanded', 'false');
      };

      // Automatically reveal answer on cursor hover
      card.addEventListener('mouseenter', () => {
        clearTimeout(hoverTimeout);
        openCard();
      });

      card.addEventListener('mouseleave', () => {
        hoverTimeout = setTimeout(() => {
          closeCard();
        }, 220);
      });

      card.addEventListener('click', (e) => {
        // Ignore clicks on links or buttons inside footer
        if (e.target.closest('a') || e.target.closest('button')) return;

        const isCurrentlyOpen = card.classList.contains('is-open');
        if (isCurrentlyOpen) {
          closeCard();
        } else {
          openCard();
        }
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if (e.target.closest('button') || e.target.closest('a')) return;
          e.preventDefault();
          const isCurrentlyOpen = card.classList.contains('is-open');
          if (isCurrentlyOpen) {
            closeCard();
          } else {
            openCard();
          }
        }
      });

      // Helpful Feedback Buttons
      const feedbackBtns = card.querySelectorAll('.tps-feedback-btn');
      feedbackBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const isYes = btn.getAttribute('data-feedback') === 'yes';
          feedbackBtns.forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          showToast(isYes ? 'Thank you! Glad this answer was helpful.' : 'Thank you for your feedback! We will improve this answer.');
        });
      });

      // Copy Permalink Button
      const copyBtn = card.querySelector('.tps-copy-link-btn');
      if (copyBtn) {
        copyBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const cardId = card.getAttribute('id');
          const url = window.location.origin + window.location.pathname + (cardId ? '#' + cardId : '');
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url).then(() => {
              showToast('Direct link copied to clipboard!', 'fa fa-link');
            });
          } else {
            showToast('Direct link: ' + url, 'fa fa-link');
          }
        });
      }
    });

    // If URL has hash, scroll and open target card
    if (window.location.hash) {
      const targetCard = document.querySelector(window.location.hash);
      if (targetCard && targetCard.classList.contains('tps-faq-card')) {
        setTimeout(() => {
          targetCard.classList.add('is-card-visible', 'is-open');
          targetCard.setAttribute('aria-expanded', 'true');
          targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 500);
      }
    }
  }
})();
