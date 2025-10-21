import React from 'react';
import { ParallaxLayer } from './ParallaxLayer';

// Lightweight SVG clouds with subtle horizontal drift
export const CloudsLayer: React.FC = () => {
  return (
    <ParallaxLayer speed={0.08} zIndex={-4}>
      <style>{`
        @keyframes driftL {
          0% { transform: translateX(-10%); }
          50% { transform: translateX(5%); }
          100% { transform: translateX(-10%); }
        }
        @keyframes driftR {
          0% { transform: translateX(10%); }
          50% { transform: translateX(-5%); }
          100% { transform: translateX(10%); }
        }
      `}</style>
      <div className="absolute inset-0 opacity-[0.18]">
        {/* Cloud 1 */}
        <svg width="420" height="160" viewBox="0 0 420 160" className="absolute top-[12%] left-[5%]" style={{ animation: 'driftL 18s ease-in-out infinite' }}>
          <defs>
            <linearGradient id="cg1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.2)" />
            </linearGradient>
          </defs>
          <path fill="url(#cg1)" d="M90,120 C40,120 20,90 30,70 C20,50 40,35 65,40 C80,20 120,20 140,35 C160,10 210,10 230,35 C270,25 310,45 310,70 C360,70 380,90 370,110 C360,130 320,130 300,120 C280,140 220,145 190,125 C150,145 110,145 90,120 Z"/>
        </svg>
        {/* Cloud 2 */}
        <svg width="380" height="150" viewBox="0 0 420 160" className="absolute top-[28%] right-[10%]" style={{ animation: 'driftR 20s ease-in-out infinite' }}>
          <defs>
            <linearGradient id="cg2" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.75)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.15)" />
            </linearGradient>
          </defs>
          <path fill="url(#cg2)" d="M80,115 C35,120 20,90 30,70 C20,50 40,35 65,40 C80,20 120,20 140,35 C160,10 210,10 230,35 C270,25 300,45 300,70 C340,70 360,90 350,110 C340,130 300,130 280,120 C260,140 210,145 180,125 C140,145 100,145 80,115 Z"/>
        </svg>
        {/* Cloud 3 */}
        <svg width="260" height="110" viewBox="0 0 420 160" className="absolute bottom-[18%] left-[12%]" style={{ animation: 'driftL 22s ease-in-out infinite' }}>
          <defs>
            <linearGradient id="cg3" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.12)" />
            </linearGradient>
          </defs>
          <path fill="url(#cg3)" d="M70,105 C30,110 20,90 28,72 C20,55 35,40 55,45 C70,30 100,28 120,40 C135,22 170,24 185,40 C210,35 230,48 232,62 C260,65 270,78 265,92 C258,108 228,110 215,102 C198,118 160,122 138,108 C110,125 86,122 70,105 Z"/>
        </svg>
      </div>
    </ParallaxLayer>
  );
};
