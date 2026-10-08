/**
 * TPS Empire - Multi-Layer Wave & FAQ Scroll-Driven Reveal Controller
 * Features fluid multi-layer wave section transitions (over FAQ & Footer) + strictly scroll-driven question reveals.
 */

document.addEventListener('DOMContentLoaded', () => {
  const lerp = (a, b, t) => a + (b - a) * t;

  // 1. Fluid Multi-Layer Wave Parallax & Morph Controller (FAQ & Footer Transitions)
  const waveTransitions = document.querySelectorAll('.tps-wave-section-transition');

  const updateWaveMorphAndDrop = () => {
    waveTransitions.forEach((wave) => {
      const rect = wave.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Check if wave transition is in viewport range
      if (rect.bottom > -100 && rect.top < windowHeight + 100) {
        // Morph progress: 0 (fully curved wave) to 1 (fully straight line)
        const startFlatten = windowHeight * 0.90;
        const endFlatten = windowHeight * 0.15;
        const rawProgress = (startFlatten - rect.top) / (startFlatten - endFlatten);
        const morphP = Math.max(0, Math.min(1, rawProgress));

        // Locate Layer 1, 2, 3 paths inside this specific wave component
        const path1 = wave.querySelector('.tps-wave-layer-1 path, .tps-wave-path-1') || wave.querySelector('#homeWavePath1, #footerWavePath1');
        const path2 = wave.querySelector('.tps-wave-layer-2 path, .tps-wave-path-2') || wave.querySelector('#homeWavePath2, #footerWavePath2');
        const path3 = wave.querySelector('.tps-wave-layer-3 path, .tps-wave-path-3') || wave.querySelector('#homeWavePath3, #footerWavePath3');

        // Morph Layer 1 (Orange #ea580c) to straight line at y=320
        if (path1) {
          const y0 = lerp(130, 320, morphP);
          const cy1 = lerp(240, 320, morphP);
          const cy2 = lerp(20, 320, morphP);
          const y1 = lerp(130, 320, morphP);
          const cy3 = lerp(240, 320, morphP);
          const cy4 = lerp(50, 320, morphP);
          const y2 = lerp(120, 320, morphP);
          path1.setAttribute(
            'd',
            `M0,${y0.toFixed(1)} C240,${cy1.toFixed(1)} 440,${cy2.toFixed(1)} 720,${y1.toFixed(1)} C1000,${cy3.toFixed(1)} 1200,${cy4.toFixed(1)} 1440,${y2.toFixed(1)} L1440,320 L0,320 Z`
          );
        }

        // Morph Layer 2 (Peach/Amber #ffae6c) to straight line at y=320
        if (path2) {
          const y0 = lerp(175, 320, morphP);
          const cy1 = lerp(70, 320, morphP);
          const cy2 = lerp(270, 320, morphP);
          const y1 = lerp(160, 320, morphP);
          const cy3 = lerp(50, 320, morphP);
          const cy4 = lerp(220, 320, morphP);
          const y2 = lerp(165, 320, morphP);
          path2.setAttribute(
            'd',
            `M0,${y0.toFixed(1)} C300,${cy1.toFixed(1)} 540,${cy2.toFixed(1)} 820,${y1.toFixed(1)} C1100,${cy3.toFixed(1)} 1280,${cy4.toFixed(1)} 1440,${y2.toFixed(1)} L1440,320 L0,320 Z`
          );
        }

        // Morph Layer 3 (Base connection layer) to straight line at y=320
        if (path3) {
          const y0 = lerp(230, 320, morphP);
          const cy1 = lerp(150, 320, morphP);
          const cy2 = lerp(290, 320, morphP);
          const y1 = lerp(200, 320, morphP);
          const cy3 = lerp(120, 320, morphP);
          const cy4 = lerp(260, 320, morphP);
          const y2 = lerp(220, 320, morphP);
          path3.setAttribute(
            'd',
            `M0,${y0.toFixed(1)} C320,${cy1.toFixed(1)} 600,${cy2.toFixed(1)} 920,${y1.toFixed(1)} C1200,${cy3.toFixed(1)} 1340,${cy4.toFixed(1)} 1440,${y2.toFixed(1)} L1440,320 L0,320 Z`
          );
        }

        // Section underneath emerging from beneath the wave
        const nextSec = wave.nextElementSibling;
        if (nextSec && (nextSec.classList.contains('tps-faq-cascade-section') || nextSec.classList.contains('ftco-footer'))) {
          const maxDrop = nextSec.classList.contains('ftco-footer') ? -30 : -45;
          const dropOffset = (1 - morphP) * maxDrop;
          nextSec.style.transform = `translateY(${dropOffset.toFixed(1)}px)`;
        }
      }
    });
  };

  // 2. FAQ Accordion & Scroll-Driven Cascading Reveal Controller
  const faqSections = document.querySelectorAll('.tps-faq-cascade-section');
  const cardThresholds = [0.18, 0.34, 0.50, 0.66, 0.82];

  const updateFaqScrollProgress = () => {
    faqSections.forEach((faqSection) => {
      const faqCards = Array.from(faqSection.querySelectorAll('.tps-faq-card'));
      if (faqCards.length === 0) return;

      const rect = faqSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.bottom > 50 && rect.top < windowHeight - 50) {
        faqSection.classList.add('is-revealed');

        const scrollEntry = windowHeight - rect.top;
        const scrollRange = windowHeight * 0.75 + rect.height * 0.45;
        const progress = Math.max(0, Math.min(1, scrollEntry / scrollRange));

        faqCards.forEach((card, index) => {
          const threshold = cardThresholds[index] !== undefined ? cardThresholds[index] : (0.18 + index * 0.16);
          if (progress >= threshold) {
            card.classList.add('is-card-visible');
          } else {
            card.classList.remove('is-card-visible');
          }
        });
      } else {
        if (rect.top > windowHeight) {
          faqSection.classList.remove('is-revealed');
          faqCards.forEach((card) => card.classList.remove('is-card-visible'));
        }
      }
    });
  };

  // Setup Accordion Hover, Click & Keyboard Interactions
  faqSections.forEach((faqSection) => {
    const faqCards = Array.from(faqSection.querySelectorAll('.tps-faq-card'));
    let hoverTimeout = null;

    faqCards.forEach((card) => {
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-expanded', 'false');

      const openCard = () => {
        faqCards.forEach((otherCard) => {
          if (otherCard !== card) {
            otherCard.classList.remove('is-open');
            otherCard.setAttribute('aria-expanded', 'false');
          }
        });
        card.classList.add('is-open');
        card.setAttribute('aria-expanded', 'true');
      };

      const closeCard = () => {
        card.classList.remove('is-open');
        card.setAttribute('aria-expanded', 'false');
      };

      const toggleCard = (e) => {
        if (e.target.tagName && e.target.tagName.toLowerCase() === 'a') return;

        const isCurrentlyOpen = card.classList.contains('is-open');
        if (isCurrentlyOpen) {
          closeCard();
        } else {
          openCard();
        }
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

      card.addEventListener('click', toggleCard);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleCard(e);
        }
      });
    });
  });

  // 3. Centralized High-Performance Scroll RAF Engine
  let ticking = false;

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateWaveMorphAndDrop();
        updateFaqScrollProgress();
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  // Initial calculation on page load
  updateWaveMorphAndDrop();
  updateFaqScrollProgress();
});
