import React, { useEffect, useState } from 'react';

interface TypewriterTextProps {
  text: string;
  className?: string;
  speedMs?: number; // per character
  startDelayMs?: number;
  loop?: boolean;
  pauseMs?: number; // pause at full text before resetting when loop
  cursorClassName?: string;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  className = '',
  speedMs = 30,
  startDelayMs = 0,
  loop = false,
  pauseMs = 1200,
  cursorClassName = 'text-primary',
}) => {
  const [count, setCount] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let mounted = true;
    let t1: number | null = null;
    let t2: number | null = null;
    let t3: number | null = null;

    const begin = () => {
      if (!mounted) return;
      if (startDelayMs > 0) {
        t1 = window.setTimeout(tick, startDelayMs);
      } else {
        tick();
      }
    };

    const tick = () => {
      if (!mounted) return;
      setCount((c) => {
        if (c < text.length) {
          t2 = window.setTimeout(tick, speedMs);
          return c + 1;
        }
        if (loop) {
          t3 = window.setTimeout(() => setCount(0), pauseMs);
        }
        return c;
      });
    };

    begin();

    const blink = window.setInterval(() => setShowCursor((s) => !s), 500);

    return () => {
      mounted = false;
      if (t1) window.clearTimeout(t1);
      if (t2) window.clearTimeout(t2);
      if (t3) window.clearTimeout(t3);
      window.clearInterval(blink);
    };
  }, [text, speedMs, startDelayMs, loop, pauseMs]);

  return (
    <span className={className}>
      {text.slice(0, count)}
      <span className={cursorClassName} aria-hidden>
        {showCursor ? '|' : ' '}
      </span>
    </span>
  );
};
