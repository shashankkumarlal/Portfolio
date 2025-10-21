import React, { useEffect, useMemo, useRef, useState } from 'react';
import { PARALLAX_INTENSITY, PARALLAX_MOUSE_TILT } from '@/config/ui';

interface ParallaxLayerProps {
  speed?: number; // positive: slower than scroll, negative: opposite
  zIndex?: number;
  className?: string;
  children?: React.ReactNode;
}

export const ParallaxLayer: React.FC<ParallaxLayerProps> = ({ speed = 0.1, zIndex = -3, className = '', children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const prefersReduced = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);

  useEffect(() => {
    let rafId = 0;
    const el = ref.current;
    if (!el) return;

    let lastY = window.scrollY;
    let tx = 0, ty = 0;

    const onScroll = () => {
      lastY = window.scrollY;
      schedule();
    };

    const onMouse = (e: MouseEvent) => {
      setMouse({ x: e.clientX, y: e.clientY });
      schedule();
    };

    const schedule = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        const scrollOffset = -lastY * speed;
        let mx = 0, my = 0;
        if (PARALLAX_MOUSE_TILT && !prefersReduced) {
          // Normalize mouse to [-0.5, 0.5]
          const nx = mouse.x / (window.innerWidth || 1) - 0.5;
          const ny = mouse.y / (window.innerHeight || 1) - 0.5;
          const factor = 20 * PARALLAX_INTENSITY; // px
          mx = nx * factor;
          my = ny * factor;
        }
        tx = mx;
        ty = scrollOffset + my;
        el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMouse, { passive: true });
    schedule();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouse);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [speed, prefersReduced, mouse.x, mouse.y]);

  return (
    <div ref={ref} className={`fixed inset-0 pointer-events-none will-change-transform ${className}`} style={{ zIndex }}>
      {children}
    </div>
  );
};
