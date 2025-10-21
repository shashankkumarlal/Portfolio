import React from 'react';
import { ParallaxLayer } from './ParallaxLayer';

export const GridLayer: React.FC = () => {
  return (
    <ParallaxLayer speed={0.02} zIndex={-6}>
      <div className="absolute inset-0 opacity-[0.18]">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(56,189,248,0.15)" strokeWidth="1"/>
            </pattern>
            <radialGradient id="fade" cx="50%" cy="50%" r="70%">
              <stop offset="60%" stopColor="rgba(0,0,0,0)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.5)" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <rect width="100%" height="100%" fill="url(#fade)" />
        </svg>
      </div>
    </ParallaxLayer>
  );
};
