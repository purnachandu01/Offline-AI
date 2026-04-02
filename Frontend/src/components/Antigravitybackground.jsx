import { useEffect, useRef } from "react";

export default function AntigravityBackground() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = window.innerWidth;
    let height = window.innerHeight;
    let mouse = { x: width / 2, y: height / 2, active: false };

    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * DPR;
      canvas.height = height * DPR;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      initParticles();
    };

    const PARTICLE_GAP = 60;
    const INTERACTION_RADIUS = 140;
    const RETURN_SPEED = 0.06;
    const REPEL_STRENGTH = 7.5;
    const particles = [];

    class Particle {
      constructor(x, y) {
        this.baseX = x;
        this.baseY = y;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.size = 1.6;
      }

      update() {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;

        if (mouse.active && dist < INTERACTION_RADIUS) {
          const force = (INTERACTION_RADIUS - dist) / INTERACTION_RADIUS;
          this.vx += (dx / dist) * force * REPEL_STRENGTH;
          this.vy += (dy / dist) * force * REPEL_STRENGTH;
        }

        this.vx += (this.baseX - this.x) * RETURN_SPEED;
        this.vy += (this.baseY - this.y) * RETURN_SPEED;

        this.vx *= 0.84;
        this.vy *= 0.84;

        this.x += this.vx;
        this.y += this.vy;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.fill();
      }
    }

    function initParticles() {
      particles.length = 0;
      for (let y = 0; y <= height + PARTICLE_GAP; y += PARTICLE_GAP) {
        for (let x = 0; x <= width + PARTICLE_GAP; x += PARTICLE_GAP) {
          particles.push(new Particle(x, y));
        }
      }
    }

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distSq = dx * dx + dy * dy;

          if (distSq < 5200) {
            const opacity = 1 - distSq / 5200;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255,255,255,${opacity * 0.14})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      const gradient = ctx.createRadialGradient(
        width * 0.5,
        height * 0.45,
        80,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.75
      );
      gradient.addColorStop(0, "rgba(28, 40, 90, 0.16)");
      gradient.addColorStop(0.45, "rgba(8, 14, 32, 0.06)");
      gradient.addColorStop(1, "rgba(2, 4, 12, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      particles.forEach((particle) => {
        particle.update();
      });

      drawConnections();

      particles.forEach((particle) => {
        particle.draw();
      });

      animationRef.current = requestAnimationFrame(animate);
    }

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    resize();
    animate();

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="antigravity-canvas" />;
}