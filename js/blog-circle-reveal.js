/**
 * TPS Empire - Blog Section Horizontal Circle Split & Emergence Controller
 * - Header "Read our latest blog" is visible all the time at top of stage
 * - Center Circle splits HORIZONTALLY (Left Half moves LEFT, Right Half moves RIGHT)
 * - Blog cards have SHARP edges, NO gloss/shadows
 * - Blog cards appear ONLY when the circle is fully opened
 */

document.addEventListener('DOMContentLoaded', () => {
  const scrollTrack = document.getElementById('homeBlogSection');
  if (!scrollTrack) return;

  const leftHalf = document.getElementById('tpsCircleLeftHalf');
  const rightHalf = document.getElementById('tpsCircleRightHalf');
  const emergeContainer = document.getElementById('tpsBlogEmergeContainer');

  let ticking = false;

  const updateSplitProgress = () => {
    const rect = scrollTrack.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;
    const scrollDistance = scrollTrack.offsetHeight - windowHeight;

    if (scrollDistance <= 0) return;

    // Calculate scroll progress (0.0 to 1.0)
    const currentScroll = -rect.top;
    const rawProgress = currentScroll / scrollDistance;
    const progress = Math.max(0, Math.min(1, rawProgress));

    // Horizontal split travel distance (moves to the outer edges)
    const splitDistanceX = Math.min(640, windowWidth * 0.48);

    // Circle opens progressively across the first 70% of scroll
    const circleOpenProgress = Math.min(1, progress / 0.70);

    // 1. Move Left Half Leftwards
    if (leftHalf) {
      const leftX = -(circleOpenProgress * splitDistanceX);
      leftHalf.style.transform = `translateY(-50%) translateX(${leftX.toFixed(1)}px)`;
      leftHalf.style.opacity = progress > 0.88 ? Math.max(0, (1 - progress) / 0.12).toFixed(2) : '1';
    }

    // 2. Move Right Half Rightwards
    if (rightHalf) {
      const rightX = circleOpenProgress * splitDistanceX;
      rightHalf.style.transform = `translateY(-50%) translateX(${rightX.toFixed(1)}px)`;
      rightHalf.style.opacity = progress > 0.88 ? Math.max(0, (1 - progress) / 0.12).toFixed(2) : '1';
    }

    // 3. Blog Cards Appear ONLY When Circle is Fully Opened (progress >= 0.70)
    if (emergeContainer) {
      if (progress < 0.70) {
        emergeContainer.style.opacity = '0';
        emergeContainer.style.transform = 'scale(0.94) translateY(20px)';
        emergeContainer.style.pointerEvents = 'none';
      } else {
        const blogRevealProgress = Math.min(1, (progress - 0.70) / 0.28);
        const scale = (0.94 + blogRevealProgress * 0.06).toFixed(3);
        const translateY = ((1 - blogRevealProgress) * 20).toFixed(1);

        emergeContainer.style.opacity = blogRevealProgress.toFixed(2);
        emergeContainer.style.transform = `scale(${scale}) translateY(${translateY}px)`;
        emergeContainer.style.pointerEvents = blogRevealProgress >= 0.85 ? 'auto' : 'none';
      }
    }

    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateSplitProgress);
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  // Initial execution
  updateSplitProgress();
});
