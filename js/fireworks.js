const Fireworks = {
  run() {
    if (!SETTINGS.fireworksEnabled) return;

    const canvas = document.getElementById('fireworks');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const mobile = window.innerWidth <= 720;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let animationId;
    let lastBurst = 0;
    const particles = [];
    const rockets = [];

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function textOrigin() {
      const target = document.querySelector('.scene.active .memory-copy, .scene.active h1, .scene.active h2, .scene.active .eyebrow, .content h1, .content h2');
      if (target) {
        const rect = target.getBoundingClientRect();
        return {
          x: Math.max(40, Math.min(width - 40, rect.left + rect.width / 2)),
          y: Math.max(100, Math.min(height * (mobile ? 0.62 : 0.58), rect.top + rect.height * 0.35))
        };
      }
      return { x: width / 2, y: height * (mobile ? 0.42 : 0.36) };
    }

    function burst(x, y) {
      const colors = ['#fff8cf', '#ffe28a', '#ffd166', '#ff9f68', '#ff6b9d', '#9ee7ff', '#c8a6ff'];
      const count = mobile ? 95 : 135;
      const color = colors[Math.floor(Math.random() * colors.length)];
      for (let i = 0; i < count; i += 1) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.08;
        const speed = (mobile ? 1.7 : 2.2) + Math.random() * (mobile ? 2.1 : 2.8);
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 55 + Math.random() * 35,
          maxLife: 90,
          size: 1.2 + Math.random() * 1.8,
          color,
          gravity: 0.018 + Math.random() * 0.012
        });
      }
    }

    function launch() {
      const origin = textOrigin();
      const startX = origin.x + (Math.random() - 0.5) * Math.min(width * 0.34, 150);
      const startY = height * (mobile ? 0.76 : 0.9);
      rockets.push({
        x: startX,
        y: startY,
        vx: (origin.x - startX) * 0.012,
        vy: -(mobile ? 4.8 : 5.8),
        targetX: origin.x + (Math.random() - 0.5) * Math.min(width * 0.28, 130),
        targetY: origin.y + (Math.random() - 0.5) * Math.min(height * 0.13, 90),
        trail: []
      });
    }

    function drawGlow(x, y, radius, color, alpha) {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, `rgba(255,255,230,${alpha})`);
      gradient.addColorStop(0.25, color.replace('1)', `${alpha * 0.8})`));
      gradient.addColorStop(1, color.replace('1)', '0)'));
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    function frame(time) {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';

      if (time - lastBurst > (mobile ? 1050 : 900)) {
        launch();
        lastBurst = time;
      }

      for (let i = rockets.length - 1; i >= 0; i -= 1) {
        const rocket = rockets[i];
        rocket.trail.push({ x: rocket.x, y: rocket.y });
        if (rocket.trail.length > 7) rocket.trail.shift();
        ctx.strokeStyle = 'rgba(255,230,150,.7)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        rocket.trail.forEach((point, index) => {
          if (index === 0) ctx.moveTo(point.x, point.y);
          else ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();
        drawGlow(rocket.x, rocket.y, 7, 'rgba(255,210,100,1)', 0.9);
        rocket.x += rocket.vx;
        rocket.y += rocket.vy;
        rocket.vy += 0.025;
        const reached = Math.abs(rocket.x - rocket.targetX) < 8 && Math.abs(rocket.y - rocket.targetY) < 10;
        if (reached || rocket.y < rocket.targetY) {
          burst(rocket.x, rocket.y);
          rockets.splice(i, 1);
        }
      }

      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const particle = particles[i];
        const alpha = Math.max(0, particle.life / particle.maxLife);
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += particle.gravity;
        particle.vx *= 0.986;
        particle.vy *= 0.986;
        particle.life -= 1;
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = alpha * 0.25;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 5, 0, Math.PI * 2);
        ctx.fill();
        if (particle.life <= 0) particles.splice(i, 1);
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      animationId = requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });
    if (!reduceMotion) {
      launch();
      animationId = requestAnimationFrame(frame);
    }
  }
};
