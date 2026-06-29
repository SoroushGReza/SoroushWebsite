import { useEffect, useRef } from "react";
import styles from "../../styles/AnimatedHero.module.css";

const HERO_THEMES = {
  gold: {
    accent: "#c9a84c",
    accentBright: "#ffe066",
    baseRgb: [180, 140, 40],
    shimmerRgb: [75, 84, 62],
    orbOne: "#c9a84c0a",
    orbTwo: "#ffe06608",
    orbThree: "#c9a84c05",
    grid: "#c9a84c06",
  },
  cyan: {
    accent: "#0dcaf0",
    accentBright: "#67e8f9",
    baseRgb: [13, 170, 200],
    shimmerRgb: [60, 80, 55],
    orbOne: "#0dcaf00f",
    orbTwo: "#67e8f90a",
    orbThree: "#0dcaf006",
    grid: "#0dcaf008",
  },
  purple: {
    accent: "#a855f7",
    accentBright: "#d8b4fe",
    baseRgb: [168, 85, 247],
    shimmerRgb: [70, 80, 8],
    orbOne: "#a855f70f",
    orbTwo: "#d8b4fe0a",
    orbThree: "#a855f706",
    grid: "#a855f708",
  },
  green: {
    accent: "#22c55e",
    accentBright: "#86efac",
    baseRgb: [34, 197, 94],
    shimmerRgb: [100, 58, 50],
    orbOne: "#22c55e0f",
    orbTwo: "#86efac0a",
    orbThree: "#22c55e06",
    grid: "#22c55e08",
  },
  blue: {
    accent: "#3b82f6",
    accentBright: "#93c5fd",
    baseRgb: [59, 130, 246],
    shimmerRgb: [60, 80, 9],
    orbOne: "#3b82f60f",
    orbTwo: "#93c5fd0a",
    orbThree: "#3b82f606",
    grid: "#3b82f608",
  },
  rose: {
    accent: "#f43f5e",
    accentBright: "#fda4af",
    baseRgb: [244, 63, 94],
    shimmerRgb: [11, 100, 100],
    orbOne: "#f43f5e0f",
    orbTwo: "#fda4af0a",
    orbThree: "#f43f5e06",
    grid: "#f43f5e08",
  },
  orange: {
    accent: "#f97316",
    accentBright: "#fdba74",
    baseRgb: [249, 115, 22],
    shimmerRgb: [6, 109, 80],
    orbOne: "#f973160f",
    orbTwo: "#fdba740a",
    orbThree: "#f9731606",
    grid: "#f9731608",
  },
};

function AnimatedHero({
  canvasText = "SOROUSH",
  topLabel = "Data Science Student · Fullstack Developer",
  theme = "gold",
}) {
  const heroRef = useRef(null);
  const bgCanvasRef = useRef(null);
  const mainCanvasRef = useRef(null);
  const cursorRef = useRef(null);
  const colors = HERO_THEMES[theme] || HERO_THEMES.gold;

  useEffect(() => {
    const hero = heroRef.current;
    const bgCanvas = bgCanvasRef.current;
    const mainCanvas = mainCanvasRef.current;
    const cursor = cursorRef.current;

    if (!hero || !bgCanvas || !mainCanvas || !cursor) {
      return;
    }

    const bgCtx = bgCanvas.getContext("2d");
    const ctx = mainCanvas.getContext("2d");

    let width = 0;
    let height = 0;
    let mouseX = 0;
    let mouseY = 0;
    let particles = [];
    let glints = [];
    let offscreenCanvas;
    let offscreenCtx;
    let animationFrameId;
    let lastGlint = 0;
    let fontTimer;

    function buildOffscreenText() {
      offscreenCanvas = document.createElement("canvas");
      offscreenCanvas.width = width;
      offscreenCanvas.height = height;
      offscreenCtx = offscreenCanvas.getContext("2d");

      const text = canvasText.toUpperCase();
      let fontSize = Math.min(height * 2.62, 320);
      const textY = height * 0.64;

      offscreenCtx.clearRect(0, 0, width, height);
      offscreenCtx.fillStyle = "#ffffff";
      offscreenCtx.textAlign = "center";
      offscreenCtx.textBaseline = "middle";
      offscreenCtx.font = `900 ${fontSize}px "Bebas Neue", sans-serif`;

      while (
        offscreenCtx.measureText(text).width > width * 0.9 &&
        fontSize > 80
      ) {
        fontSize -= 8;
        offscreenCtx.font = `900 ${fontSize}px "Bebas Neue", sans-serif`;
      }

      offscreenCtx.fillText(text, width / 2, textY);
    }

    function initParticles() {
      particles = [];

      if (!offscreenCtx) {
        return;
      }

      const sample = width < 576 ? 7 : width < 992 ? 5 : 4;
      const imageData = offscreenCtx.getImageData(0, 0, width, height).data;

      for (let y = 0; y < height; y += sample) {
        for (let x = 0; x < width; x += sample) {
          const index = (y * width + x) * 4;

          if (imageData[index + 3] > 128) {
            particles.push({
              originX: x,
              originY: y,
              x: x + (Math.random() - 0.5) * width * 1.2,
              y: y + (Math.random() - 0.5) * height * 1.2,
              velocityX: 0,
              velocityY: 0,
              size: Math.random() * 1.6 + 0.6,
              speed: Math.random() * 0.04 + 0.06,
              phase: Math.random() * Math.PI * 2,
            });
          }
        }
      }
    }

    function resize() {
      const rect = hero.getBoundingClientRect();

      width = Math.floor(rect.width);
      height = Math.floor(rect.height);

      bgCanvas.width = width;
      bgCanvas.height = height;
      mainCanvas.width = width;
      mainCanvas.height = height;

      mouseX = width / 2;
      mouseY = height / 2;

      buildOffscreenText();
      initParticles();
      drawBackground();
    }

    function updateMousePosition(clientX, clientY) {
      const rect = hero.getBoundingClientRect();

      mouseX = clientX - rect.left;
      mouseY = clientY - rect.top;

      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;
    }

    function handleMouseMove(event) {
      cursor.classList.add(styles.visible);
      updateMousePosition(event.clientX, event.clientY);
    }

    function handleMouseEnter() {
      cursor.classList.add(styles.visible);
    }

    function handleMouseLeave() {
      cursor.classList.remove(styles.visible);
      cursor.classList.remove("big");

      mouseX = -9999;
      mouseY = -9999;
    }

    function handleTouchMove(event) {
      const touch = event.touches[0];

      if (touch) {
        updateMousePosition(touch.clientX, touch.clientY);
      }
    }

    function handleMouseDown() {
      cursor.classList.add(styles.big);
    }

    function handleMouseUp() {
      cursor.classList.remove(styles.big);
    }

    function spawnGlint(x, y) {
      for (let i = 0; i < 5; i += 1) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1;

        glints.push({
          x,
          y,
          velocityX: Math.cos(angle) * speed,
          velocityY: Math.sin(angle) * speed,
          life: 1,
          radius: Math.random() * 2 + 1,
        });
      }
    }

    function drawBackground() {
      bgCtx.clearRect(0, 0, width, height);
      bgCtx.fillStyle = "#050508";
      bgCtx.fillRect(0, 0, width, height);

      const orbs = [
        {
          x: width * 0.2,
          y: height * 0.3,
          radius: width * 0.45,
          color: colors.orbOne,
        },
        {
          x: width * 0.8,
          y: height * 0.7,
          radius: width * 0.4,
          color: colors.orbTwo,
        },
        {
          x: width * 0.5,
          y: height * 0.5,
          radius: width * 0.3,
          color: colors.orbThree,
        },
      ];

      orbs.forEach((orb) => {
        const gradient = bgCtx.createRadialGradient(
          orb.x,
          orb.y,
          0,
          orb.x,
          orb.y,
          orb.radius,
        );

        gradient.addColorStop(0, orb.color);
        gradient.addColorStop(1, "transparent");

        bgCtx.fillStyle = gradient;
        bgCtx.fillRect(0, 0, width, height);
      });

      bgCtx.strokeStyle = colors.grid;
      bgCtx.lineWidth = 1;

      const gridSize = 80;

      for (let x = 0; x < width; x += gridSize) {
        bgCtx.beginPath();
        bgCtx.moveTo(x, 0);
        bgCtx.lineTo(x, height);
        bgCtx.stroke();
      }

      for (let y = 0; y < height; y += gridSize) {
        bgCtx.beginPath();
        bgCtx.moveTo(0, y);
        bgCtx.lineTo(width, y);
        bgCtx.stroke();
      }
    }

    function animate(timestamp) {
      const time = timestamp * 0.001;

      ctx.clearRect(0, 0, width, height);

      const repelRadius = 100;
      const repelRadiusSquared = repelRadius * repelRadius;

      particles.forEach((particle) => {
        let dx = particle.originX - particle.x;
        let dy = particle.originY - particle.y;

        const cursorDx = particle.x - mouseX;
        const cursorDy = particle.y - mouseY;
        const cursorDistanceSquared = cursorDx * cursorDx + cursorDy * cursorDy;

        if (cursorDistanceSquared < repelRadiusSquared) {
          const cursorDistance = Math.max(Math.sqrt(cursorDistanceSquared), 1);
          const force = ((repelRadius - cursorDistance) / repelRadius) * 8;

          dx += (cursorDx / cursorDistance) * force * 30;
          dy += (cursorDy / cursorDistance) * force * 30;
        }

        particle.velocityX += dx * particle.speed;
        particle.velocityY += dy * particle.speed;
        particle.velocityX *= 0.78;
        particle.velocityY *= 0.78;
        particle.x += particle.velocityX;
        particle.y += particle.velocityY;

        const shimmer = (Math.sin(time * 2.4 + particle.phase) + 1) * 0.5;

        const red = Math.round(
          colors.baseRgb[0] + shimmer * colors.shimmerRgb[0],
        );
        const green = Math.round(
          colors.baseRgb[1] + shimmer * colors.shimmerRgb[1],
        );
        const blue = Math.round(
          colors.baseRgb[2] + shimmer * colors.shimmerRgb[2],
        );
        const alpha = 0.55 + shimmer * 0.45;

        ctx.beginPath();
        ctx.arc(
          particle.x,
          particle.y,
          particle.size + shimmer * 0.8,
          0,
          Math.PI * 2,
        );
        ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
        ctx.fill();
      });

      for (let i = glints.length - 1; i >= 0; i -= 1) {
        const glint = glints[i];

        glint.x += glint.velocityX;
        glint.y += glint.velocityY;
        glint.velocityY += 0.08;
        glint.life -= 0.028;

        if (glint.life <= 0) {
          glints.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = glint.life * 0.8;
        ctx.translate(glint.x, glint.y);
        ctx.rotate(time * 2 + i);
        ctx.fillStyle = colors.accentBright;

        for (let starPoint = 0; starPoint < 4; starPoint += 1) {
          ctx.rotate(Math.PI / 2);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(glint.radius * 0.3, glint.radius * 2.5);
          ctx.lineTo(0, glint.radius * 0.5);
          ctx.lineTo(-glint.radius * 0.3, glint.radius * 2.5);
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(animate);
    }

    hero.addEventListener("mouseenter", handleMouseEnter);
    hero.addEventListener("mouseleave", handleMouseLeave);
    hero.addEventListener("mousemove", handleMouseMove);
    hero.addEventListener("touchmove", handleTouchMove, { passive: true });
    hero.addEventListener("mousedown", handleMouseDown);
    hero.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("resize", resize);

    resize();

    fontTimer = window.setTimeout(() => {
      buildOffscreenText();
      initParticles();
    }, 400);

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      hero.removeEventListener("mouseenter", handleMouseEnter);
      hero.removeEventListener("mouseleave", handleMouseLeave);
      hero.removeEventListener("mousemove", handleMouseMove);
      hero.removeEventListener("touchmove", handleTouchMove);
      hero.removeEventListener("mousedown", handleMouseDown);
      hero.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("resize", resize);
      window.clearTimeout(fontTimer);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [canvasText, colors]);

  return (
    <section
      ref={heroRef}
      className={styles.animatedHero}
      style={{
        "--animated-hero-accent": colors.accent,
        "--animated-hero-accent-bright": colors.accentBright,
      }}
    >
      <div ref={cursorRef} className={styles.animatedHeroCursor} />

      <div className={styles.animatedHeroTopBar}>
        <div className={styles.animatedHeroDot} />
        <span className={styles.animatedHeroTopLabel}>{topLabel}</span>
        <div className={styles.animatedHeroDot} />
      </div>

      <canvas ref={bgCanvasRef} className={styles.animatedHeroBg} />
      <canvas ref={mainCanvasRef} className={styles.animatedHeroMain} />
    </section>
  );
}

export default AnimatedHero;
