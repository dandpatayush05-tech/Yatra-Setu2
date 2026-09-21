import React, { useEffect, useRef } from 'react';

interface SmokeBackgroundProps {
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  maxSize: number;
  life: number;
  maxLife: number;
  alpha: number;
  seed: number;
}

export const SmokeBackground: React.FC<SmokeBackgroundProps> = ({ intensity = 'medium', className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const isVisibleRef = useRef<boolean>(true);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;

    const getParticleCount = () => {
      const isMobile = window.innerWidth < 768;
      switch (intensity) {
        case 'low': return isMobile ? 15 : 30;
        case 'high': return isMobile ? 45 : 90;
        case 'medium':
        default:
          return isMobile ? 30 : 60;
      }
    };

    const initCanvas = () => {
      width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.parentElement?.clientHeight || window.innerHeight;
      
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      
      ctx.scale(dpr, dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    const createParticle = (reset: boolean = false): Particle => {
      return {
        x: Math.random() * width,
        y: reset ? height + Math.random() * 50 : Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -(Math.random() * 0.5 + 0.2), // Rising slowly
        size: Math.random() * 30 + 20,
        maxSize: Math.random() * 100 + 80,
        life: reset ? 0 : Math.random() * 1000,
        maxLife: Math.random() * 800 + 400,
        alpha: Math.random() * 0.15 + 0.05,
        seed: Math.random() * Math.PI * 2
      };
    };

    const initParticles = () => {
      const count = getParticleCount();
      particlesRef.current = Array.from({ length: count }, () => createParticle(false));
    };

    const drawStaticSmoke = () => {
      ctx.clearRect(0, 0, width, height);
      const gradient = ctx.createLinearGradient(0, height, 0, 0);
      gradient.addColorStop(0, 'rgba(0,0,0,0.1)');
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    };

    const updateAndDraw = () => {
      if (!isVisibleRef.current) {
        animationRef.current = requestAnimationFrame(updateAndDraw);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      particlesRef.current.forEach((p, i) => {
        p.life++;
        p.x += p.vx + Math.sin(p.life * 0.01 + p.seed) * 0.5;
        p.y += p.vy;

        // Growth
        if (p.size < p.maxSize) {
          p.size += 0.2;
        }

        // Fade out
        let currentAlpha = p.alpha;
        if (p.life > p.maxLife * 0.7) {
          currentAlpha = p.alpha * (1 - (p.life - p.maxLife * 0.7) / (p.maxLife * 0.3));
        }
        if (p.life < p.maxLife * 0.1) {
          currentAlpha = p.alpha * (p.life / (p.maxLife * 0.1));
        }

        if (p.life >= p.maxLife || p.y + p.size < 0) {
          particlesRef.current[i] = createParticle(true);
        } else if (currentAlpha > 0) {
          ctx.beginPath();
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
          gradient.addColorStop(0, `rgba(0, 0, 0, ${currentAlpha})`);
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = gradient;
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationRef.current = requestAnimationFrame(updateAndDraw);
    };

    initCanvas();

    if (prefersReducedMotion) {
      drawStaticSmoke();
      window.addEventListener('resize', () => {
        initCanvas();
        drawStaticSmoke();
      });
      return;
    }

    initParticles();
    updateAndDraw();

    const handleResize = () => {
      initCanvas();
      // Ensure we have correct number of particles on resize (especially mobile <-> desktop)
      const count = getParticleCount();
      if (particlesRef.current.length < count) {
        particlesRef.current.push(...Array.from({ length: count - particlesRef.current.length }, () => createParticle(true)));
      } else if (particlesRef.current.length > count) {
        particlesRef.current.length = count;
      }
    };

    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden;
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none z-0 ${className}`}
      aria-hidden="true"
    />
  );
};
