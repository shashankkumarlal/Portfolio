import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { SPLIT_ANIM_ENABLED } from '@/config/ui';

interface SplitHeadingProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  split?: 'chars' | 'words';
  delay?: number; // seconds between each child
  duration?: number; // seconds per child
  className?: string;
}

const SplitHeading: React.FC<SplitHeadingProps> = ({
  text,
  as = 'h2',
  split = 'words',
  delay = 0.04,
  duration = 0.5,
  className = '',
}) => {
  const reduce = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  const parts = useMemo(() => (split === 'chars' ? text.split('') : text.split(/(\s+)/)), [text, split]);

  const Child = motion.span;
  const common = { viewport: { once: true, margin: '-10% 0px' } } as const;

  const Tag: any = motion[as] ?? motion.h2;

  if (!SPLIT_ANIM_ENABLED || reduce) {
    // Fall back to static heading
    const StaticTag: any = as;
    return <StaticTag className={className}>{text}</StaticTag>;
  }

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: delay },
        },
      }}
      {...common}
    >
      {parts.map((p, i) => (
        <Child
          key={i}
          aria-hidden={p.trim().length === 0}
          variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration } } }}
          style={{ display: 'inline-block', whiteSpace: 'pre' }}
        >
          {p}
        </Child>
      ))}
      <span className="sr-only">{text}</span>
    </Tag>
  );
};

export default SplitHeading;
