/**
 * TPS Empire - 3D Warp Speed Tunnel Fly-Through Controller (Home Page)
 * 
 * Features:
 * 1. Strictly scroll-driven: Animation and canvas streaks move ONLY when scrolling
 * 2. Stationary and paused when idle (zero auto-drift)
 * 3. Slower, calm, highly controllable scroll scrub pacing
 * 4. Zero shine: clean matte styling, crisp perspective velocity lines
 * 5. Interactive HUD timeline dots navigation
 * 6. Subtle 3D mouse parallax
 */

(function () {
  'use strict';

  function initHomeWarpServices() {
    var section = document.getElementById('tpsHomeWarpSection');
    var track = document.getElementById('tpsHomeWarpTrack');
    var canvas = document.getElementById('tpsHomeWarpCanvas');

    if (!section || !track) return;

    var cards = section.querySelectorAll('.tps-home-warp-card');
    var dots = section.querySelectorAll('.tps-warp-dot');
    var counterText = section.querySelector('.tps-home-warp-step-counter strong');

    if (cards.length === 0) return;

    // Card Center Progress Targets (Well-spaced for relaxed, slow scroll pacing)
    var cardCenters = [0.14, 0.38, 0.62, 0.86];
    var stageHalfWidth = 0.18; // Generous transition width

    var targetProgress = 0;
    var currentProgress = 0;
    var isRunning = false;

    // Mouse coordinates for 3D parallax
    var mouseX = 0;
    var mouseY = 0;
    var curMouseX = 0;
    var curMouseY = 0;

    // ------------------------------------------------------------------------
    // 1. Perspective Canvas Velocity Lines (Strictly Scroll-Driven)
    // ------------------------------------------------------------------------
    var ctx = canvas ? canvas.getContext('2d') : null;
    var width = 0;
    var height = 0;
    var streaks = [];
    var numStreaks = 75;

    function resizeCanvas() {
      if (!canvas) return;
      width = canvas.width = section.offsetWidth || window.innerWidth;
      height = canvas.height = window.innerHeight;
      renderCanvasStreaks();
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    // Initialize fixed perspective streaks (TPS Empire Brand Theme)
    for (var s = 0; s < numStreaks; s++) {
      var rand = Math.random();
      var streakCol = rand > 0.6 ? '#323edd' : (rand > 0.35 ? '#ffa41b' : (rand > 0.15 ? '#007bff' : '#ffffff'));
      streaks.push({
        x: (Math.random() - 0.5) * 2200,
        y: (Math.random() - 0.5) * 2200,
        initialZ: Math.random() * 1000 + 1,
        length: Math.random() * 35 + 15,
        color: streakCol
      });
    }

    // Render perspective streaks: position is strictly calculated from currentProgress
    function renderCanvasStreaks() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, width, height);

      var cx = (width > 992 ? width * 0.71 : width / 2) + curMouseX * 35;
      var cy = height / 2 + curMouseY * 25;

      for (var i = 0; i < streaks.length; i++) {
        var strk = streaks[i];

        // Z depth is strictly tied to scroll progress (Calm, relaxed scroll pace)
        var zOffset = (currentProgress * 2200) % 1000;
        var z = strk.initialZ - zOffset;
        if (z <= 1) z += 1000;

        var k = 360 / z;
        var px = strk.x * k + cx;
        var py = strk.y * k + cy;

        var k2 = 360 / (z + strk.length);
        var px2 = strk.x * k2 + cx;
        var py2 = strk.y * k2 + cy;

        var alpha = Math.min(0.85, (1000 - z) / 450);

        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px2, py2);
        ctx.strokeStyle = strk.color;
        ctx.globalAlpha = Math.max(0.1, alpha);
        ctx.lineWidth = Math.max(1, (1 - z / 1000) * 2.2);
        ctx.stroke();
      }
    }

    // ------------------------------------------------------------------------
    // 2. Scroll Progress Calculation
    // ------------------------------------------------------------------------
    function clamp(val, min, max) {
      return Math.max(min, Math.min(max, val));
    }

    function smoothstep(min, max, value) {
      var x = Math.max(0, Math.min(1, (value - min) / (max - min)));
      return x * x * (3 - 2 * x);
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

    // ------------------------------------------------------------------------
    // 3. Main 3D Render Loop (Executes ONLY during movement/scroll)
    // ------------------------------------------------------------------------
    function renderLoop() {
      // Gentle lerp progress for relaxed, slow, smooth motion
      var diff = targetProgress - currentProgress;
      if (Math.abs(diff) > 0.0001) {
        currentProgress += diff * 0.04;
      } else {
        currentProgress = targetProgress;
      }

      // Smooth mouse parallax
      curMouseX += (mouseX - curMouseX) * 0.06;
      curMouseY += (mouseY - curMouseY) * 0.06;

      // Render canvas streaks tied to scroll
      renderCanvasStreaks();

      // Active card index tracker
      var activeIndex = 0;
      var minCenterDist = Infinity;

      // Update 4 Cards in 3D Perspective Space
      cards.forEach(function (card, index) {
        var centerP = cardCenters[index];
        var dist = (currentProgress - centerP) / stageHalfWidth;

        if (Math.abs(currentProgress - centerP) < minCenterDist) {
          minCenterDist = Math.abs(currentProgress - centerP);
          activeIndex = index;
        }

        // Card is in active range (-1.15 to +1.15)
        if (dist >= -1.15 && dist <= 1.15) {
          card.style.visibility = 'visible';
          card.style.pointerEvents = 'auto';

          var scale = 1;
          var opacity = 1;
          var translateZ = 0;

          if (dist < 0) {
            // Approaching from horizon (dist: -1.0 -> 0)
            var u = 1 + dist; // 0 -> 1
            u = Math.max(0, u);
            var easedU = u * u * (3 - 2 * u); // Smoothstep

            scale = 0.12 + 0.88 * easedU;
            translateZ = -700 * (1 - easedU);
            opacity = Math.sin(u * (Math.PI / 2));
          } else {
            // Flying past the camera into viewer (dist: 0 -> +1.0)
            var v = dist; // 0 -> 1
            var easedV = v * v * (3 - 2 * v); // Smoothstep

            scale = 1.0 + 2.4 * easedV;
            translateZ = 550 * easedV;
            opacity = Math.max(0, 1 - easedV * 1.8);
          }

          // 3D Parallax Rotation
          var rotX = -curMouseY * 8 * (dist < 0 ? 0.5 : 1);
          var rotY = curMouseX * 10 * (dist < 0 ? 0.5 : 1);

          card.style.transform = 'translate(-50%, -50%) translateZ(' + translateZ.toFixed(1) + 'px) scale(' + scale.toFixed(3) + ') rotateX(' + rotX.toFixed(2) + 'deg) rotateY(' + rotY.toFixed(2) + 'deg)';
          card.style.opacity = opacity.toFixed(3);
        } else {
          // Off-screen
          card.style.visibility = 'hidden';
          card.style.opacity = '0';
          card.style.pointerEvents = 'none';
          card.style.transform = 'translate(-50%, -50%) scale(0.08)';
        }
      });

      // Update HUD counter & active dots
      if (counterText) {
        counterText.textContent = '0' + (activeIndex + 1);
      }
      dots.forEach(function (dot, i) {
        if (i === activeIndex) {
          dot.classList.add('is-active');
        } else {
          dot.classList.remove('is-active');
        }
      });

      // Continue loop only if still moving; stops completely when idle
      if (Math.abs(diff) > 0.0001 || Math.abs(mouseX - curMouseX) > 0.001) {
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

    window.addEventListener('scroll', onScroll, { passive: true });

    // ------------------------------------------------------------------------
    // 4. Mouse Move 3D Parallax
    // ------------------------------------------------------------------------
    section.addEventListener('mousemove', function (e) {
      var rect = section.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) / rect.width - 0.5;
      mouseY = (e.clientY - rect.top) / rect.height - 0.5;

      if (!isRunning) {
        isRunning = true;
        requestAnimationFrame(renderLoop);
      }
    }, { passive: true });

    // ------------------------------------------------------------------------
    // 5. HUD Dots Click Navigation (Direct Stage Jump)
    // ------------------------------------------------------------------------
    dots.forEach(function (dot) {
      dot.addEventListener('click', function (e) {
        e.preventDefault();
        var idx = parseInt(dot.getAttribute('data-step'), 10) || 0;
        var targetP = cardCenters[idx];

        var rect = track.getBoundingClientRect();
        var trackTop = window.pageYOffset + rect.top;
        var totalScrollable = track.offsetHeight - window.innerHeight;
        var scrollToY = trackTop + targetP * totalScrollable;

        window.scrollTo({
          top: scrollToY,
          behavior: 'smooth'
        });
      });
    });

    // Initial render
    onScroll();
  }

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHomeWarpServices);
  } else {
    initHomeWarpServices();
  }
})();
