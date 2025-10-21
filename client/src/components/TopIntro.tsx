import React from 'react';
import TextPressure from '@/components/TextPressure';

export const TopIntro: React.FC = () => {
  return (
    <section className="relative w-full h-[260px] md:h-[320px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-10" style={{ backgroundSize: '50px 50px' }} />
      <div className="relative z-10 w-full" style={{ height: '100%' }}>
        <TextPressure
          text="HELLO!"
          flex={true}
          alpha={false}
          stroke={false}
          width={true}
          weight={true}
          italic={true}
          textColor="#ffffff"
          strokeColor="#ff0000"
          minFontSize={36}
        />
      </div>
    </section>
  );
};
