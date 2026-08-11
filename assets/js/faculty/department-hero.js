/**
 * department-hero.js — canvas engine for the cinematic department hero
 * (includes/pages/department.php). Reads its configuration entirely
 * from the #stcDeptHero element's data attributes and CSS custom
 * properties (see department-hero.css) — nothing here is hardcoded to
 * any one department, so a new department with a different
 * animation_type just works.
 *
 * "flowing-gradient" is deliberately CSS-only (see department-hero.css)
 * — this file only renders "network-data" and "particles-math", and
 * leaves the canvas hidden/unused for every other type.
 *
 * Performance/accessibility contract:
 *  - prefers-reduced-motion or the site-wide animations toggle off ->
 *    one static frame, no animation loop.
 *  - IntersectionObserver pauses the rAF loop (and the video) whenever
 *    the hero scrolls out of view, resumes when back in view.
 *  - Mobile gets a reduced particle/node count; if the department has a
 *    dedicated mobile_background image, CSS hides the canvas entirely
 *    on mobile and this script skips initializing it.
 *  - devicePixelRatio capped at 2.
 */
(function () {
  'use strict';

  var hero = document.getElementById('stcDeptHero');
  if (!hero) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    || window.STC_DEPT_HERO_ANIMATIONS_ENABLED === false
    || window.STC_ANIMATIONS_ENABLED === false;

  var isMobile = window.matchMedia('(max-width: 767px)').matches;
  var hasMobileBg = hero.classList.contains('has-mobile-bg');

  /* ---- Video layer: lazy-load + play only once visible -------------------- */
  var video = document.getElementById('stcDeptHeroVideo');
  function initVideo() {
    if (!video || reduceMotion) return;
    var videoObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          if (!video.src && video.dataset.src) video.src = video.dataset.src;
          video.play().catch(function () { /* autoplay blocked — silently keep the static image */ });
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.15 });
    video.addEventListener('playing', function () { video.classList.add('is-playing'); });
    videoObserver.observe(hero);
  }
  initVideo();

  /* ---- Canvas motif --------------------------------------------------------- */
  var canvas = document.getElementById('stcDeptHeroCanvas');
  if (!canvas) return;

  var animationType = hero.dataset.animationType || 'none';
  if (animationType === 'none' || animationType === 'flowing-gradient' || (isMobile && hasMobileBg)) {
    canvas.classList.add('is-hidden');
    return;
  }

  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var intensity = hero.dataset.animationIntensity || 'medium';
  var speedSetting = hero.dataset.animationSpeed || 'normal';
  var speedFactor = { slow: 0.5, normal: 1, fast: 1.8 }[speedSetting] || 1;
  var countByIntensity = { low: 18, medium: 32, high: 48 }[intensity] || 32;
  if (isMobile) countByIntensity = Math.round(countByIntensity * 0.45);

  var styles = getComputedStyle(hero);
  var colorPrimary = styles.getPropertyValue('--stc-dept-motif-primary').trim() || '#c7962c';
  var colorSecondary = styles.getPropertyValue('--stc-dept-motif-secondary').trim() || '#7a1b2b';
  var colorLine = styles.getPropertyValue('--stc-dept-motif-line').trim() || 'rgba(199,150,44,0.3)';

  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var width = 0, height = 0;

  function resize() {
    width = hero.clientWidth;
    height = hero.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  /* ---- "network-data" — drifting nodes with proximity-based connecting
     lines and an occasional pulse, evoking a data/graph network. ---- */
  function makeNetworkNodes(n) {
    var nodes = [];
    for (var i = 0; i < n; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25 * speedFactor,
        vy: (Math.random() - 0.5) * 0.25 * speedFactor,
        r: 1.6 + Math.random() * 2.2,
        pulse: Math.random() * Math.PI * 2,
      });
    }
    return nodes;
  }

  function drawNetwork(nodes, dt) {
    ctx.clearRect(0, 0, width, height);
    var linkDist = Math.min(width, height) * 0.16;

    nodes.forEach(function (node) {
      node.x += node.vx * dt;
      node.y += node.vy * dt;
      if (node.x < -20) node.x = width + 20;
      if (node.x > width + 20) node.x = -20;
      if (node.y < -20) node.y = height + 20;
      if (node.y > height + 20) node.y = -20;
      node.pulse += 0.012 * speedFactor * dt;
    });

    ctx.lineWidth = 1;
    for (var i = 0; i < nodes.length; i++) {
      for (var j = i + 1; j < nodes.length; j++) {
        var a = nodes[i], b = nodes[j];
        var dx = a.x - b.x, dy = a.y - b.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < linkDist) {
          ctx.strokeStyle = colorLine;
          ctx.globalAlpha = 1 - dist / linkDist;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;

    nodes.forEach(function (node, idx) {
      var glow = 0.55 + Math.sin(node.pulse) * 0.35;
      ctx.beginPath();
      ctx.fillStyle = idx % 5 === 0 ? colorSecondary : colorPrimary;
      ctx.globalAlpha = glow;
      ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  /* ---- "particles-math" — drifting mathematical symbols, a lighter-
     weight motif available for future departments. ---- */
  var MATH_SYMBOLS = ['Σ', '∫', 'π', '√', '∞', 'Δ', 'θ', 'λ', '∂', '∑'];
  function makeMathParticles(n) {
    var particles = [];
    for (var i = 0; i < n; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height + height,
        vy: -(0.15 + Math.random() * 0.25) * speedFactor,
        vx: (Math.random() - 0.5) * 0.08 * speedFactor,
        size: 16 + Math.random() * 22,
        symbol: MATH_SYMBOLS[Math.floor(Math.random() * MATH_SYMBOLS.length)],
        opacity: 0.12 + Math.random() * 0.22,
      });
    }
    return particles;
  }
  function drawMathParticles(particles, dt) {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(function (p) {
      p.y += p.vy * dt;
      p.x += p.vx * dt;
      if (p.y < -40) { p.y = height + 40; p.x = Math.random() * width; }
      ctx.font = p.size + 'px Georgia, serif';
      ctx.fillStyle = colorPrimary;
      ctx.globalAlpha = p.opacity;
      ctx.fillText(p.symbol, p.x, p.y);
    });
    ctx.globalAlpha = 1;
  }

  var items = animationType === 'particles-math' ? makeMathParticles(countByIntensity) : makeNetworkNodes(countByIntensity);
  var draw = animationType === 'particles-math' ? drawMathParticles : drawNetwork;

  /* ---- Loop, paused entirely when the hero isn't visible -------------------- */
  var rafId = null;
  var running = false;
  var lastTime = null;

  function frame(ts) {
    if (!running) return;
    var dt = lastTime === null ? 1 : Math.min((ts - lastTime) / 16.67, 3);
    lastTime = ts;
    draw(items, dt);
    rafId = requestAnimationFrame(frame);
  }

  function start() {
    if (running) return;
    running = true;
    lastTime = null;
    rafId = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
  }

  if (reduceMotion) {
    draw(items, 1); // one static frame, no loop
  } else {
    var heroObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) start();
        else stop();
      });
    }, { threshold: 0.05 });
    heroObserver.observe(hero);
  }
})();
