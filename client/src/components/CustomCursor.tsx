'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const startedRef = useRef(false);
  const lastMousePosition = useRef({ x: 0, y: 0 });
  const cursorPosition = useRef({ x: 0, y: 0 });
  const dotPosition = useRef({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isDown, setIsDown] = useState(false);
  const [visible, setVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const visibleRef = useRef(true);
  const lastTime = useRef(0);

  // Smoothing factors (adjusted for better control)
  const CURSOR_SMOOTHING = 0.2;  // Slightly faster response
  const DOT_SMOOTHING = 0.15;     // Slightly faster dot follow
  const TARGET_FPS = 144;
  
  // For interactive elements, we'll use direct positioning
  const isHoveringRef = useRef(false);
  
  // Mouse move handler also determines hover state via elementFromPoint to reduce flicker
  const handleMouseMove = useCallback((e: MouseEvent) => {
    lastMousePosition.current = { x: e.clientX, y: e.clientY };
    if (!visibleRef.current) {
      visibleRef.current = true;
      setVisible(true);
    }
    if (!startedRef.current) {
      // Initialize positions on first interaction and start RAF loop
      cursorPosition.current = { x: e.clientX, y: e.clientY };
      dotPosition.current = { x: e.clientX, y: e.clientY };
      startedRef.current = true;
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
    // We no longer toggle visual hover state to avoid re-render jitter
    const isClickable = target?.closest('a, button, [role="button"]') != null;
    isHoveringRef.current = !!isClickable;
  }, []);

  // Handle hover states with better detection
  const handleMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const isClickable = target.closest('a, button, [role="button"], [onclick], .clickable, .card, .project-card, .btn, button, a');
    const shouldHover = !!isClickable;
    
    if (shouldHover !== isHoveringRef.current) {
      isHoveringRef.current = shouldHover;
      setIsHovering(shouldHover);
    }
  }, []);

  // Animation loop using requestAnimationFrame with time-based updates
  const animate = useCallback((timestamp: number) => {
    const deltaTime = Math.min(timestamp - lastTime.current, 1000 / 30);
    lastTime.current = timestamp;
    
    // Always lock the main cursor to the exact pointer to avoid any hover jitter
    cursorPosition.current = {
      x: lastMousePosition.current.x,
      y: lastMousePosition.current.y
    };
    
    // Dot follows with a slight delay
    dotPosition.current = {
      x: dotPosition.current.x + (cursorPosition.current.x - dotPosition.current.x) * 0.3,
      y: dotPosition.current.y + (cursorPosition.current.y - dotPosition.current.y) * 0.3
    };
    
    // Apply transforms with hardware acceleration
    if (cursorRef.current && dotRef.current) {
      const scale = 1;
      // Use left/top so the cursor remains centered with translate(-50%, -50%)
      cursorRef.current.style.left = `${cursorPosition.current.x}px`;
      cursorRef.current.style.top = `${cursorPosition.current.y}px`;
      cursorRef.current.style.transform = `translate3d(-50%, -50%, 0) scale(${scale})`;

      dotRef.current.style.left = `${dotPosition.current.x}px`;
      dotRef.current.style.top = `${dotPosition.current.y}px`;
      dotRef.current.style.transform = `translate3d(-50%, -50%, 0)`;
      
      // Force reflow to ensure smooth animation
      cursorRef.current.style.willChange = 'transform';
      dotRef.current.style.willChange = 'transform';
    }
    
    // Continue the animation loop
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [isHovering, isDown]);

  // Set up event listeners and start animation
  useEffect(() => {
    // Respect prefers-reduced-motion: disable custom cursor entirely
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateReduced = () => setReducedMotion(mql.matches);
    updateReduced();
    mql.addEventListener?.('change', updateReduced);

    if (mql.matches) {
      return () => {
        mql.removeEventListener?.('change', updateReduced);
      };
    }

    // Add event listeners with passive: true for better performance
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    // No separate mouseover listener; we detect hover from elementFromPoint in mousemove
    const onMouseDown = (e: MouseEvent) => {
      setIsDown(true);
      // Click ring effect
      if (ringRef.current) {
        ringRef.current.style.opacity = '0.35';
        ringRef.current.style.left = `${lastMousePosition.current.x}px`;
        ringRef.current.style.top = `${lastMousePosition.current.y}px`;
        ringRef.current.style.transform = `translate3d(-50%, -50%, 0) scale(0.3)`;
        // Force reflow then expand
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        ringRef.current.offsetHeight;
        ringRef.current.style.transform = `translate3d(-50%, -50%, 0) scale(1.25)`;
        ringRef.current.style.opacity = '0';
      }
    };
    const onMouseUp = () => {
      setIsDown(false);
    };
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });
    window.addEventListener('mouseleave', onLeave, { passive: true });
    window.addEventListener('mouseenter', onEnter, { passive: true });
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      // no-op
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('mouseenter', onEnter);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      mql.removeEventListener?.('change', updateReduced);
    };
  }, []);

  // Add global styles to hide default cursor
  useEffect(() => {
    if (reducedMotion) return;
    const style = document.createElement('style');
    style.innerHTML = `
      * { cursor: none !important; }
      @media (hover: none) and (pointer: coarse) {
        .custom-cursor, .custom-cursor-dot, .custom-cursor-ring { display: none !important; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <>
      <div
        ref={cursorRef}
        className="custom-cursor hidden md:block"
        style={{
          position: 'fixed',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          border: '2px solid rgba(255, 255, 255, 0.85)',
          pointerEvents: 'none',
          zIndex: 9999,
          transform: 'translate3d(-50%, -50%, 0)',
          transition: 'transform 0.08s ease-out, opacity 0.15s ease',
          willChange: 'transform, opacity',
          backfaceVisibility: 'hidden',
          transformStyle: 'preserve-3d',
          contain: 'layout style',
          isolation: 'isolate',
          filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.5))',
          opacity: visible ? 1 : 0,
        }}
      />
      <div
        ref={dotRef}
        className="custom-cursor-dot hidden md:block"
        style={{
          position: 'fixed',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 1)',
          pointerEvents: 'none',
          zIndex: 9998,
          transform: 'translate3d(-50%, -50%, 0)',
          transition: 'transform 0.08s ease-out',
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          transformStyle: 'preserve-3d',
          contain: 'layout style',
          filter: 'drop-shadow(0 0 3px rgba(255, 255, 255, 0.7))',
          opacity: visible ? 1 : 0,
        }}
      />
      <div
        ref={ringRef}
        className="custom-cursor-ring hidden md:block"
        style={{
          position: 'fixed',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: '2px solid rgba(255,255,255,0.6)',
          pointerEvents: 'none',
          zIndex: 9997,
          transform: 'translate3d(-50%, -50%, 0) scale(0.3)',
          transition: 'transform 350ms cubic-bezier(0.22, 1, 0.36, 1), opacity 350ms ease',
          willChange: 'transform, opacity',
          backfaceVisibility: 'hidden',
          transformStyle: 'preserve-3d',
          contain: 'layout style',
          opacity: 0,
        }}
      />
    </>
  );
}
