import React from 'react';
import { ParallaxLayer } from './ParallaxLayer';

export const AuroraLayer: React.FC = () => {
  return (
    <ParallaxLayer speed={0.04} zIndex={-5}>
      <div className="absolute inset-0 opacity-[0.35]">
        {/* Aurora blobs */}
        <div className="absolute -top-1/3 -left-1/3 h-[120vh] w-[120vw] rounded-full blur-3xl"
             style={{ background: 'radial-gradient(60% 60% at 50% 50%, rgba(56,189,248,0.35), rgba(99,102,241,0) 70%)' }} />
        <div className="absolute top-1/4 -right-1/4 h-[90vh] w-[90vw] rounded-full blur-3xl"
             style={{ background: 'radial-gradient(60% 60% at 50% 50%, rgba(168,85,247,0.28), rgba(14,165,233,0) 70%)' }} />
        <div className="absolute bottom-[-20vh] left-1/4 h-[70vh] w-[70vw] rounded-full blur-3xl"
             style={{ background: 'radial-gradient(60% 60% at 50% 50%, rgba(34,197,94,0.18), rgba(14,165,233,0) 70%)' }} />
      </div>
    </ParallaxLayer>
  );
};
