/**
 * TPS EMPIRE - FULL-WIDTH PANORAMIC ECOSYSTEM ANIMATION CONTROLLER
 * High-performance 60FPS engine for moving satellite nodes, 3D mouse parallax,
 * and dynamic seamless card-to-line docking
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    const stage = document.querySelector('.tps-ecosystem-stage');
    if (!stage) return;

    const svg = document.querySelector('.tps-circuit-svg');
    const hub = document.querySelector('.tps-hub-wrapper');
    const hubPlate = document.querySelector('.tps-hub-plate');
    const movingNodes = document.querySelectorAll('.tps-moving-node');

    // --------------------------------------------------------------------------
    // 1. Interactive 3D Parallax Tilt on Clean 3D White Central Hub
    // --------------------------------------------------------------------------
    if (stage && hubPlate) {
      window.addEventListener('mousemove', function (e) {
        const rect = stage.getBoundingClientRect();
        if (e.clientY < rect.top - 120 || e.clientY > rect.bottom + 200) return;

        const mouseX = e.clientX - (rect.left + rect.width / 2);
        const mouseY = e.clientY - (rect.top + rect.height / 2);

        const rotateX = (-mouseY / (rect.height / 2)) * 14;
        const rotateY = (mouseX / (rect.width / 2)) * 14;

        hubPlate.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px) scale(1.03)`;
      });

      stage.addEventListener('mouseleave', function () {
        hubPlate.style.transform = '';
      });
    }

    // --------------------------------------------------------------------------
    // 2. Full-Width 60FPS Motion Physics for Satellite Nodes along SVG Tracks
    // --------------------------------------------------------------------------
    const nodeConfigs = [
      { id: 'node-ai', trackId: 'track-ai-base', speed: 0.0032, phase: 0.20, minProgress: 0.12, maxProgress: 0.96 },
      { id: 'node-web', trackId: 'track-web-base', speed: 0.0038, phase: 0.50, minProgress: 0.16, maxProgress: 0.96 },
      { id: 'node-security', trackId: 'track-security-base', speed: 0.0034, phase: 0.75, minProgress: 0.14, maxProgress: 0.96 },
      { id: 'node-cloud', trackId: 'track-cloud-base', speed: 0.0036, phase: 0.35, minProgress: 0.12, maxProgress: 0.96 },
      { id: 'node-mobile', trackId: 'track-mobile-base', speed: 0.0040, phase: 0.85, minProgress: 0.16, maxProgress: 0.96 },
      { id: 'node-data', trackId: 'track-data-base', speed: 0.0033, phase: 0.65, minProgress: 0.14, maxProgress: 0.96 },
      { id: 'node-erp', trackId: 'track-erp-base', speed: 0.0030, phase: 0.08, minProgress: 0.20, maxProgress: 0.95 },
      { id: 'node-infra', trackId: 'track-infra-base', speed: 0.0031, phase: 0.55, minProgress: 0.20, maxProgress: 0.95 }
    ];

    const activeTrackObjects = [];

    nodeConfigs.forEach(function (cfg) {
      const el = document.getElementById(cfg.id);
      const pathEl = document.getElementById(cfg.trackId);
      if (el && pathEl) {
        const pulsePathEl = document.getElementById(cfg.trackId.replace('-base', ''));
        activeTrackObjects.push({
          element: el,
          pathElement: pathEl,
          pulseElement: pulsePathEl,
          speed: cfg.speed,
          progress: cfg.phase,
          direction: 1,
          minProgress: cfg.minProgress,
          maxProgress: cfg.maxProgress,
          isPaused: false
        });

        // Hover events to pause and spotlight
        el.addEventListener('mouseenter', function () {
          const item = activeTrackObjects.find(function (obj) { return obj.element === el; });
          if (item) item.isPaused = true;
          el.classList.add('is-active');

          if (pulsePathEl) {
            pulsePathEl.style.strokeWidth = '3.5';
          }

          movingNodes.forEach(function (other) {
            if (other !== el) {
              other.style.opacity = '0.35';
              other.style.filter = 'grayscale(40%)';
            }
          });
        });

        el.addEventListener('mouseleave', function () {
          const item = activeTrackObjects.find(function (obj) { return obj.element === el; });
          if (item) item.isPaused = false;
          el.classList.remove('is-active');

          if (pulsePathEl) {
            pulsePathEl.style.strokeWidth = '';
          }

          movingNodes.forEach(function (other) {
            other.style.opacity = '';
            other.style.filter = '';
          });
        });
      }
    });

    // Reference viewBox dimensions (1920 x 600)
    const SVG_VIEWBOX_W = 1920;
    const SVG_VIEWBOX_H = 600;

    function renderMotionLoop() {
      activeTrackObjects.forEach(function (item) {
        if (!item.isPaused) {
          item.progress += item.speed * item.direction;

          if (item.progress >= item.maxProgress) {
            item.progress = item.maxProgress;
            item.direction = -1;
          } else if (item.progress <= item.minProgress) {
            item.progress = item.minProgress;
            item.direction = 1;
          }
        }

        const totalLen = item.pathElement.getTotalLength();
        if (totalLen > 0) {
          const pt = item.pathElement.getPointAtLength(item.progress * totalLen);

          const leftPct = ((pt.x / SVG_VIEWBOX_W) * 100).toFixed(3);
          const topPct = ((pt.y / SVG_VIEWBOX_H) * 100).toFixed(3);

          item.element.style.left = leftPct + '%';
          item.element.style.top = topPct + '%';
        }
      });

      requestAnimationFrame(renderMotionLoop);
    }

    requestAnimationFrame(renderMotionLoop);

    // --------------------------------------------------------------------------
    // 3. Seamless Dynamic Line Attachment to the Two Cards Below
    // --------------------------------------------------------------------------
    function attachLinesToCards() {
      const leftCard = document.querySelector('.tps-power-card:not(.training-card)');
      const rightCard = document.querySelector('.tps-power-card.training-card');

      const leftBasePath = document.getElementById('track-down-enterprise-base');
      const leftPulsePath = document.getElementById('track-down-enterprise');
      const rightBasePath = document.getElementById('track-down-training-base');
      const rightPulsePath = document.getElementById('track-down-training');

      if (!stage || !hubPlate || !leftCard || !rightCard) return;

      const stageRect = stage.getBoundingClientRect();
      const hubRect = hubPlate.getBoundingClientRect();
      const leftCardRect = leftCard.getBoundingClientRect();
      const rightCardRect = rightCard.getBoundingClientRect();

      function toSvgCoords(clientX, clientY) {
        const x = ((clientX - stageRect.left) / stageRect.width) * SVG_VIEWBOX_W;
        const y = ((clientY - stageRect.top) / stageRect.height) * SVG_VIEWBOX_H;
        return { x, y };
      }

      // Hub bottom exit coordinates from circular hub
      const hubExitY = hubRect.bottom - 4;
      const hubLeftStart = toSvgCoords(hubRect.left + hubRect.width * 0.42, hubExitY);
      const hubRightStart = toSvgCoords(hubRect.left + hubRect.width * 0.58, hubExitY);

      // Card docking center coordinates (attaches directly to top center of each card)
      const leftEnd = toSvgCoords(leftCardRect.left + leftCardRect.width / 2, leftCardRect.top);
      const rightEnd = toSvgCoords(rightCardRect.left + rightCardRect.width / 2, rightCardRect.top);

      // Construct smooth, elegant bezier curve connecting Hub directly to each Card
      const midYLeft = (hubLeftStart.y + leftEnd.y) * 0.52;
      const dLeft = `M ${hubLeftStart.x.toFixed(1)} ${hubLeftStart.y.toFixed(1)} C ${hubLeftStart.x.toFixed(1)} ${midYLeft.toFixed(1)}, ${leftEnd.x.toFixed(1)} ${midYLeft.toFixed(1)}, ${leftEnd.x.toFixed(1)} ${leftEnd.y.toFixed(1)}`;

      const midYRight = (hubRightStart.y + rightEnd.y) * 0.52;
      const dRight = `M ${hubRightStart.x.toFixed(1)} ${hubRightStart.y.toFixed(1)} C ${hubRightStart.x.toFixed(1)} ${midYRight.toFixed(1)}, ${rightEnd.x.toFixed(1)} ${midYRight.toFixed(1)}, ${rightEnd.x.toFixed(1)} ${rightEnd.y.toFixed(1)}`;

      if (leftBasePath) leftBasePath.setAttribute('d', dLeft);
      if (leftPulsePath) leftPulsePath.setAttribute('d', dLeft);
      if (rightBasePath) rightBasePath.setAttribute('d', dRight);
      if (rightPulsePath) rightPulsePath.setAttribute('d', dRight);
    }

    // Attach on load and on every window resize / orientation change
    attachLinesToCards();
    window.addEventListener('resize', attachLinesToCards);
    setTimeout(attachLinesToCards, 300);
    setTimeout(attachLinesToCards, 1000);

  });
})();
