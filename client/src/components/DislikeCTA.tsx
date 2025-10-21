import React from 'react';
import FallingText from '@/components/FallingText';

export const DislikeCTA: React.FC = () => {
  return (
    <section className="relative w-full py-16 md:py-20">
      <div className="absolute inset-0 bg-grid-pattern opacity-10" style={{ backgroundSize: '50px 50px' }} />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="rounded-xl border border-white/10 bg-white/0 p-6 md:p-10">
          <div style={{ height: 220 }}>
            <FallingText
              text={"NOT IMPRESSED ? CLICK HERE TO DISLIKE"}
              highlightWords={["NOT", "CLICK", "TO", "DISLIKE"]}
              highlightClass="text-cyan-400"
              trigger="hover"
              backgroundColor="transparent"
              wireframes={false}
              gravity={0.56}
              fontSize="2rem"
              mouseConstraintStiffness={0.9}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
