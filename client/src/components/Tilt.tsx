import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface TiltProps {
  children: React.ReactNode;
  className?: string;
  rotateAmplitude?: number; // degrees
  scaleOnHover?: number; // e.g., 1.05
  containerWidth?: React.CSSProperties['width'];
  containerHeight?: React.CSSProperties['height'];
  disableTooltip?: boolean;
}

const springCfg = { stiffness: 200, damping: 24, mass: 0.8 };

const Tilt: React.FC<TiltProps> = ({
  children,
  className,
  rotateAmplitude = 10,
  scaleOnHover = 1.04,
  containerWidth,
  containerHeight,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const rotateX = useSpring(0, springCfg);
  const rotateY = useSpring(0, springCfg);
  const scale = useSpring(1, springCfg);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;
    const rX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
    const rY = (offsetX / (rect.width / 2)) * rotateAmplitude;
    rotateX.set(rX);
    rotateY.set(rY);
  };

  const handleEnter = () => {
    scale.set(scaleOnHover);
  };
  const handleLeave = () => {
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <div
      className={className}
      style={{ perspective: 800, width: containerWidth, height: containerHeight }}
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <motion.div
        ref={ref}
        style={{ rotateX, rotateY, scale, transformStyle: 'preserve-3d' as const }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default Tilt;
