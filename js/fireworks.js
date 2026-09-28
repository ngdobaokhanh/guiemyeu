window.Fireworks = {
  run() {
    if (!SETTINGS.fireworksEnabled) return;

    const canvas = document.getElementById('fireworks');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const mobile = window.innerWidth <= 720;
    let width = 0;
    let height = 0;
    let lastBurst = 0;
    const particles = [];
    const rockets = [];

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function getTarget() {
      const element = document.querySelector('.scene.active .memory-copy, .scene.active h1, .scene.active h2, .scene.active .eyebrow, .content h1, .content h2');
      if (!element) return { x: width / 2, y: height * (mobile ? 0.4 : 0.35) };
      const rect = element.getBoundingClientRect();
      return {
        x: Math.max(40, Math.min(width - 40, rect.left + rect.width / 2)),
        y: Math.max(90, Math.min(height * (mobile ? 0.58 : 0.62), rect.top + rect.height / 2))
      };
    }

    function burst(x, y) {
      const colors = ['#fff8cf', '#ffe28a', '#ffd166', '#ff9f68', '#ff6b9d', '#9ee7ff', '#c8a6ff'];
      const count = mobile ? 100 : 145;
      const color = colors[Math.floor(Math.random() * colors.length)];
      for (let i = 0; i < count; i += 1) {
        const angle = Math.random() * Math.PI * 2;
        const speed = (mobile ? 1.8 : 2.3) + Math.random() * (mobile ? 2.2 : 2.9);
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 55 + Math.random() * 35,
          maxLife: 90,
          size: 1.3 + Math.random() * 1.8,
          color
        });
      }
    }

    function launch() {
      const target = getTarget();
      const startX = target.x + (Math.random() - 0.5) * Math.min(width * 0.4, 170);
      rockets.push({
        x: startX,
        y: height * (mobile ? 0.78 : 0.92),
        vx: (target.x - startX) * 0.014,
        vy: -(mobile ? 5.5 : 6.2),
        targetX: target.x + (Math.random() - 0.5) * Math.min(width * 0.3, 140),
        targetY: target.y + (Math.random() - 0.5) * Math.min(height * 0.12, 80),
        trail: []
      });
    }

    function frame(time) {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';

      if (time - lastBurst > (mobile ? 1000 : 850)) {
        launch();
        lastBurst = time;
      }

      for (let i = rockets.length - 1; i >= 0; i -= 1) {
        const rocket = rockets[i];
        rocket.trail.push({ x: rocket.x, y: rocket.y });
        if (rocket.trail.length > 8) rocket.trail.shift();
        ctx.strokeStyle = 'rgba(255,235,165,.9)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        rocket.trail.forEach((point, index) => index ? ctx.lineTo(point.x, point.y) : ctx.moveTo(point.x, point.y));
        ctx.stroke();
        ctx.fillStyle = '#fff5bd';
        ctx.beginPath();
        ctx.arc(rocket.x, rocket.y, 3, 0, Math.PI * 2);
        ctx.fill();
        rocket.x += rocket.vx;
        rocket.y += rocket.vy;
        rocket.vy += 0.03;
        if (Math.abs(rocket.x - rocket.targetX) < 10 || rocket.y <= rocket.targetY) {
          burst(rocket.x, rocket.y);
          rockets.splice(i, 1);
        }
      }

      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const particle = particles[i];
        const alpha = Math.max(0, particle.life / particle.maxLife);
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.022;
        particle.vx *= 0.985;
        particle.vy *= 0.985;
        particle.life -= 1;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = alpha * 0.22;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 6, 0, Math.PI * 2);
        ctx.fill();
        if (particle.life <= 0) particles.splice(i, 1);
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });
    if (!reduceMotion) {
      launch();
      requestAnimationFrame(frame);
    }
  }
};
