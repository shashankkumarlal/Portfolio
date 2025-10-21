import React, { useEffect, useMemo, useRef } from 'react';

interface FlyingCardsProps extends React.HTMLAttributes<HTMLDivElement> {
  items: React.ReactNode[];
  height?: number; // px
  cardWidth?: number; // px
  cardHeight?: number; // px
  spacing?: number; // px gap between cards
  rotationAmplitude?: number; // deg
  scrollEase?: number; // 0..1 (lower = smoother inertia)
  active?: boolean; // when true, capture wheel/drag and scroll inside
  loop?: boolean; // when false, clamp to ends and release page scroll at boundaries
}

// A DOM-based analogue of FlyingPosters for card nodes, with inertial vertical loop and gentle 3D rotation.
const FlyingCards: React.FC<FlyingCardsProps> = ({
  items,
  height = 600,
  cardWidth = 280,
  cardHeight = 220,
  spacing = 24,
  rotationAmplitude = 10,
  scrollEase = 0.06,
  active = false,
  loop = true,
  className,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef({ current: 0, target: 0, last: 0, isDown: false, start: 0, position: 0 });
  const rafRef = useRef<number | null>(null);

  const itemCount = items.length;
  const unit = cardHeight + spacing; // vertical step per card
  const total = unit * itemCount;
  const maxScroll = Math.max(0, total - unit); // last card aligned to center

  const duplicates = useMemo(() => {
    // Duplicate list to enable seamless wrap
    return loop ? [...items, ...items, ...items] : [...items];
  }, [items, loop]);

  useEffect(() => {
    const update = () => {
      const state = scrollRef.current;
      state.current = state.current + (state.target - state.current) * scrollEase;
      const t = performance.now() * 0.001; // time for subtle oscillation

      // Position children
      const track = trackRef.current;
      if (track) {
        const children = Array.from(track.children) as HTMLElement[];
        const half = loop ? Math.floor(children.length / 2) : 0;
        children.forEach((el, idx) => {
          // base index within [-half, +half)
          const baseIndex = idx - half;
          let y: number;
          if (loop) {
            y = baseIndex * unit - (state.current % total);
            if (y < -total / 2) y += total;
            if (y > total / 2) y -= total;
          } else {
            // Single stack, centered around container
            y = baseIndex * unit - state.current;
          }

          // map y to rotation/tilt similar to shader-driven rotation progression
          const norm = Math.max(-1, Math.min(1, y / (height / 2)));
          const angle = norm * rotationAmplitude * Math.sin(t + idx * 0.35);
          const xTilt = (norm * rotationAmplitude) / 6;

          el.style.transform = `translate3d(-50%, ${Math.round(y)}px, 0) rotateY(${angle}deg) rotateX(${xTilt}deg)`;
          el.style.opacity = '1';
        });
      }

      rafRef.current = requestAnimationFrame(update);
    };

    rafRef.current = requestAnimationFrame(update);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [height, rotationAmplitude, scrollEase, unit, total]);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (!active) return; // do not intercept when not active

      const dy = e.deltaY;
      const state = scrollRef.current;

      if (!loop) {
        const atStart = state.current <= 0.5;
        const atEnd = state.current >= maxScroll - 0.5;
        // If at boundary and user tries to scroll past it, let the page handle it
        if ((atStart && dy < 0) || (atEnd && dy > 0)) return;
      }

      e.preventDefault();
      const nextTarget = loop ? state.target + dy * 0.1 : Math.max(0, Math.min(maxScroll, state.target + dy * 0.12));
      state.target = nextTarget;
    };
    const onMouseDown = (e: MouseEvent) => {
      if (!active) return;
      scrollRef.current.isDown = true;
      scrollRef.current.start = e.clientY;
      scrollRef.current.position = scrollRef.current.target;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!scrollRef.current.isDown) return;
      const dy = scrollRef.current.start - e.clientY;
      const next = scrollRef.current.position + dy;
      scrollRef.current.target = loop ? next : Math.max(0, Math.min(maxScroll, next));
    };
    const onMouseUp = () => {
      scrollRef.current.isDown = false;
    };

    const el = containerRef.current;
    if (!el) return;

    // Wheel on window to catch scroll even when the pointer isn't strictly over the container
    window.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('wheel', onWheel);
      el.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  const itemStyle: React.CSSProperties = {
    position: 'absolute',
    left: '50%',
    top: height / 2,
    width: cardWidth,
    height: cardHeight,
    transform: 'translate3d(-50%, 0, 0)',
    transformStyle: 'preserve-3d',
    willChange: 'transform',
  };

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: 'relative', height, overflow: 'hidden', perspective: 800 }}
      {...props}
    >
      <div ref={trackRef} style={{ position: 'absolute', inset: 0 }}>
        {duplicates.map((node, idx) => (
          <div key={idx} style={itemStyle}>
            {node}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlyingCards;
