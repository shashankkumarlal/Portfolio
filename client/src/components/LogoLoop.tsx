import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './LogoLoop.css';

// Add global type declarations
declare global {
  interface Window {
    ResizeObserver: typeof ResizeObserver;
  }
}

export type LogoItem =
  | {
      node: React.ReactNode;
      href?: string;
      title?: string;
      ariaLabel?: string;
    }
  | {
      src: string;
      alt?: string;
      href?: string;
      title?: string;
      srcSet?: string;
      sizes?: string;
      width?: number;
      height?: number;
    };

export interface LogoLoopProps {
  logos: LogoItem[];
  speed?: number;
  direction?: 'left' | 'right';
  width?: number | string;
  logoHeight?: number;
  gap?: number;
  pauseOnHover?: boolean;
  fadeOut?: boolean;
  fadeOutColor?: string;
  scaleOnHover?: boolean;
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}

const ANIMATION_CONFIG = {
  // Larger tau => gentler easing toward target velocity (smoother start/stop)
  SMOOTH_TAU: 0.6,
  MIN_COPIES: 2,
  // Extra copies reduce visible seams on wrap
  COPY_HEADROOM: 3,
} as const;

const toCssLength = (value?: number | string): string | undefined =>
  typeof value === 'number' ? `${value}px` : value ?? undefined;

// Add type declaration for window to fix TypeScript errors
declare global {
  interface Window {
    ResizeObserver: typeof ResizeObserver;
  }
}

const useResizeObserver = (
  callback: () => void,
  elements: Array<React.RefObject<Element | null>>,
  dependencies: React.DependencyList
) => {
  useEffect(() => {
    // Skip during SSR
    if (typeof window === 'undefined') return;
    
    const handleResize = () => callback();
    let resizeObserver: ResizeObserver | null = null;
    const observers: ResizeObserver[] = [];
    
    // Fallback for browsers without ResizeObserver
    if (!('ResizeObserver' in window)) {
      (window as Window).addEventListener('resize', handleResize);
      // Initial callback
      const timer = setTimeout(callback, 0);
      return () => {
        (window as Window).removeEventListener('resize', handleResize);
        clearTimeout(timer);
      };
    }

    // Create ResizeObservers for each element
    elements.forEach((ref) => {
      if (!ref.current) return;
      const observer = new ResizeObserver(handleResize);
      observer.observe(ref.current);
      observers.push(observer);
    });

    // Initial callback after observers are set up
    const timer = setTimeout(callback, 0);

    // Cleanup function
    return () => {
      clearTimeout(timer);
      observers.forEach(observer => observer.disconnect());
    };
  }, dependencies);
};

const useImageLoader = (
  seqRef: React.RefObject<HTMLUListElement | null>,
  onLoad: () => void,
  dependencies: React.DependencyList
) => {
  useEffect(() => {
    const images = seqRef.current?.querySelectorAll('img') ?? [];
    if (images.length === 0) {
      onLoad();
      return;
    }
    let remaining = images.length;
    const done = () => {
      remaining -= 1;
      if (remaining === 0) onLoad();
    };
    images.forEach((img) => {
      const el = img as HTMLImageElement;
      if (el.complete) {
        done();
      } else {
        el.addEventListener('load', done, { once: true });
        el.addEventListener('error', done, { once: true });
      }
    });
    return () => {
      images.forEach((img) => {
        img.removeEventListener('load', done);
        img.removeEventListener('error', done);
      });
    };
  }, dependencies);
};

const useAnimationLoop = (
  trackRef: React.RefObject<HTMLDivElement | null>,
  targetVelocity: number,
  seqWidth: number,
  isHovered: boolean,
  pauseOnHover: boolean
) => {
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number | null>(null);
  const offsetRef = useRef(0);
  const velocityRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    if (seqWidth > 0) {
      offsetRef.current = ((offsetRef.current % seqWidth) + seqWidth) % seqWidth;
      track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
    }

    const tick = (ts: number) => {
      if (lastRef.current === null) lastRef.current = ts;
      const dt = Math.max(0, ts - lastRef.current) / 1000;
      lastRef.current = ts;

      const target = pauseOnHover && isHovered ? 0 : targetVelocity;
      const easing = 1 - Math.exp(-dt / ANIMATION_CONFIG.SMOOTH_TAU);
      velocityRef.current += (target - velocityRef.current) * easing;

      if (seqWidth > 0) {
        let next = offsetRef.current + velocityRef.current * dt;
        next = ((next % seqWidth) + seqWidth) % seqWidth;
        offsetRef.current = next;

        // Subpixel translate for smoother GPU interpolation
        const translateX = -offsetRef.current;
        track.style.transform = `translate3d(${translateX}px, 0, 0)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastRef.current = null;
    };
  }, [targetVelocity, seqWidth, isHovered, pauseOnHover]);
};

export const LogoLoop = React.memo<LogoLoopProps>(
  ({
    logos,
    speed = 120,
    direction = 'left',
    width = '100%',
    logoHeight = 28,
    gap = 32,
    pauseOnHover = true,
    fadeOut = false,
    fadeOutColor,
    scaleOnHover = false,
    ariaLabel = 'Partner logos',
    className,
    style,
  }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const seqRef = useRef<HTMLUListElement>(null);

    const [seqWidth, setSeqWidth] = useState(0);
    const [copyCount, setCopyCount] = useState(ANIMATION_CONFIG.MIN_COPIES);
    const [isHovered, setIsHovered] = useState(false);

    const targetVelocity = useMemo(() => {
      const mag = Math.abs(speed);
      const dirMul = direction === 'left' ? 1 : -1;
      const sign = speed < 0 ? -1 : 1;
      return mag * dirMul * sign;
    }, [speed, direction]);

    const updateDimensions = useCallback(() => {
      const containerWidth = containerRef.current?.clientWidth ?? 0;
      const sequenceWidth = seqRef.current?.getBoundingClientRect?.()?.width ?? 0;
      if (sequenceWidth > 0) {
        setSeqWidth(Math.ceil(sequenceWidth));
        const copiesNeeded = Math.ceil(containerWidth / sequenceWidth) + ANIMATION_CONFIG.COPY_HEADROOM;
        setCopyCount(prev => Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded) as 2);
      }
    }, []);

    useResizeObserver(updateDimensions, [containerRef, seqRef], [logos, gap, logoHeight]);
    useImageLoader(seqRef, updateDimensions, [logos, gap, logoHeight]);
    useAnimationLoop(trackRef, targetVelocity, seqWidth, isHovered, pauseOnHover);

    const cssVars = useMemo(
      () =>
        ({
          '--logoloop-gap': `${gap}px`,
          '--logoloop-logoHeight': `${logoHeight}px`,
          ...(fadeOutColor && { '--logoloop-fadeColor': fadeOutColor }),
        }) as React.CSSProperties,
      [gap, logoHeight, fadeOutColor]
    );

    const rootClass = useMemo(
      () => ['logoloop', fadeOut && 'logoloop--fade', scaleOnHover && 'logoloop--scale-hover', className].filter(Boolean).join(' '),
      [fadeOut, scaleOnHover, className]
    );

    const onEnter = useCallback(() => {
      if (pauseOnHover) setIsHovered(true);
    }, [pauseOnHover]);
    const onLeave = useCallback(() => {
      if (pauseOnHover) setIsHovered(false);
    }, [pauseOnHover]);

    const renderLogoItem = useCallback((item: LogoItem, key: React.Key) => {
      const isNode = 'node' in item;
      const content = isNode ? (
        <span className="logoloop__node" aria-hidden={!!item.href && !item.ariaLabel}>
          {item.node}
        </span>
      ) : (
        <img
          src={item.src}
          srcSet={item.srcSet}
          sizes={item.sizes}
          width={item.width}
          height={item.height}
          alt={item.alt ?? ''}
          title={item.title}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      );

      const itemAria = isNode ? item.ariaLabel ?? item.title : item.alt ?? item.title;
      const wrapped = item.href ? (
        <a className="logoloop__link" href={item.href} aria-label={itemAria || 'logo link'} target="_blank" rel="noreferrer noopener">
          {content}
        </a>
      ) : (
        content
      );

      return (
        <li className="logoloop__item" key={key} role="listitem">
          {wrapped}
        </li>
      );
    }, []);

    const logoLists = useMemo(
      () =>
        Array.from({ length: copyCount }, (_, i) => (
          <ul className="logoloop__list" key={`copy-${i}`} role="list" aria-hidden={i > 0} ref={i === 0 ? seqRef : undefined}>
            {logos.map((it, idx) => renderLogoItem(it, `${i}-${idx}`))}
          </ul>
        )),
      [copyCount, logos, renderLogoItem]
    );

    const containerStyle = useMemo((): React.CSSProperties => ({ width: toCssLength(width) ?? '100%', ...cssVars, ...style }), [width, cssVars, style]);

    return (
      <div
        ref={containerRef}
        className={rootClass}
        style={containerStyle}
        role="region"
        aria-label={ariaLabel}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
      >
        <div className="logoloop__track" ref={trackRef}>
          {logoLists}
        </div>
      </div>
    );
  }
);

LogoLoop.displayName = 'LogoLoop';

export default LogoLoop;
