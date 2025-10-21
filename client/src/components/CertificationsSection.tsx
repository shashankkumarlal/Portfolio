import React, { useCallback, useEffect, useRef } from 'react';
import { TypewriterText } from '@/components/TypewriterText';
import SplitHeading from '@/components/SplitHeading';
import ShinyText from '@/components/ShinyText';
import { motion } from 'framer-motion';

const ORGS = [
  'Oracle Cloud',
  'Oracle',
  'Google Cloud',
  'Google',
  'AWS',
  'CISCO',
  'Simplilearn',
  'MATLAB',
];

function EmphasizeOrg({ label }: { label: string }) {
  // Wrap known organization tokens in <em>
  const parts: Array<{ text: string; italic: boolean }> = [];
  let remaining = label;
  while (remaining.length) {
    let foundIdx = -1;
    let foundOrg = '';
    for (const org of ORGS) {
      const idx = remaining.indexOf(org);
      if (idx !== -1 && (foundIdx === -1 || idx < foundIdx)) {
        foundIdx = idx;
        foundOrg = org;
      }
    }
    if (foundIdx === -1) {
      parts.push({ text: remaining, italic: false });
      break;
    }
    if (foundIdx > 0) {
      parts.push({ text: remaining.slice(0, foundIdx), italic: false });
    }
    parts.push({ text: foundOrg, italic: true });
    remaining = remaining.slice(foundIdx + foundOrg.length);
  }
  return (
    <>
      {parts.map((p, i) =>
        p.italic ? (
          <em key={i} className="italic not-italic:font-normal">
            {p.text}
          </em>
        ) : (
          <span key={i}>{p.text}</span>
        ),
      )}
    </>
  );
}

const items: { label: string; href: string }[] = [
  {
    label: 'Oracle Cloud Infrastructure Certified AI Foundations Associate',
    href: 'https://catalog-education.oracle.com/ords/certview/sharebadge?id=4755FD094DD3AD29C656A9A0CC9A24A4F97D25C2B1A2808996178D0092BF0D16',
  },
  {
    label: 'Oracle Certified Foundations Associate',
    href: 'https://catalog-education.oracle.com/ords/certview/sharebadge?id=C9EAE47421B26A987CF2818372B91C258715C76B62F848F774A66E188520075E',
  },
  {
    label: 'Google Cloud: Cloud Computing Foundations Certificate',
    href: 'https://www.credly.com/badges/78dc1976-6f41-4592-b26a-ea6f901eb2c7/linked_in_profile',
  },
  {
    label: 'Google Cloud: Introduction to Gen AI',
    href: '#',
  },
  {
    label: 'Google Cloud: Gemini Multimodal and Image Generation Badge',
    href: '#',
  },
  {
    label: 'AWS Educate: Getting Started With Compute',
    href: 'https://www.credly.com/badges/9615b898-f3c0-427b-b281-ce1e3b268293/linked_in_profile',
  },
  {
    label: 'AWS Educate: Getting Started with Serverless',
    href: 'https://www.credly.com/badges/14e70030-fee3-4d9d-a05d-d40f81979e79/linked_in_profile',
  },
  {
    label: 'AWS Educate Cloud Ops',
    href: 'https://www.credly.com/badges/3ea30933-4ed3-4326-b1d6-98f2474a753e/linked_in_profile',
  },
  {
    label: 'MATLAB Onramp Certification',
    href: '#',
  },
  {
    label: 'CISCO Networking Basics',
    href: 'https://www.credly.com/badges/92e4baa8-46c1-435b-abd6-a3a078fc876e/linked_in_profile',
  },
  {
    label: 'DevOps by Simplilearn',
    href: 'https://www.simplilearn.com/skillup-certificate-landing?token=eyJjb3Vyc2VfaWQiOiIzMjc1IiwiY2VydGlmaWNhdGVfdXJsIjoiaHR0cHM6XC9cL2NlcnRpZmljYXRlcy5zaW1wbGljZG4ubmV0XC9zaGFyZVwvNzU1NzEzOF83NzU0NjIwMTczMTUxMjg3MzYwNS5wbmciLCJ1c2VybmFtZSI6IlNoYXNoYW5rIEt1bWFyIExhbCJ9&referrer=https%3A%2F%2Flms.simplilearn.com%2Fcourses%2F6073%2FDevOps-101%3A-What-is-DevOps%253F%2Fcertificate%2Fdownload-skillup&%24web_only=true',
  },
  {
    label: 'Scrum Foundation by Certiprof',
    href: 'https://www.credly.com/badges/1de666b6-e987-4ea0-8ab4-f14750180a9e/linked_in_profile',
  },
];

function ManualStrip({ reverse = false }: { reverse?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const runningRef = useRef(false);
  const pausedRef = useRef(false);
  const lastTsRef = useRef(0);
  const SPEED_PX_PER_SEC = 115; // +20% more auto speed

  const start = useCallback(() => {
    if (runningRef.current) return;
    runningRef.current = true;
    lastTsRef.current = performance.now();
    const tick = (ts: number) => {
      rafRef.current = null;
      const el = containerRef.current;
      if (!el) return;
      if (pausedRef.current) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const dt = Math.min(50, ts - lastTsRef.current); // clamp delta
      lastTsRef.current = ts;
      const delta = (SPEED_PX_PER_SEC * dt) / 1000;
      const maxLeft = el.scrollWidth - el.clientWidth;
      const half = Math.floor(el.scrollWidth / 2);
      let next = reverse ? el.scrollLeft - delta : el.scrollLeft + delta;
      if (!reverse) {
        if (next >= maxLeft) {
          next = next - half;
          if (next < 0) next = 0;
        }
      } else {
        if (next <= 0) {
          next = next + half;
          if (next > maxLeft) next = maxLeft;
        }
      }
      el.scrollLeft = Math.max(0, Math.min(maxLeft, next));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const stop = useCallback(() => {
    runningRef.current = false;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    // Start/stop when in view
    const io = new IntersectionObserver((entries) => {
      const vis = entries.some((en) => en.isIntersecting);
      if (vis) start(); else stop();
    }, { root: null, threshold: 0.2 });
    io.observe(el);
    // Pause on hover for readability (optional but nice UX)
    const onEnter = () => { pausedRef.current = true; };
    const onLeave = () => { pausedRef.current = false; };
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      io.disconnect();
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
      stop();
    };
  }, [start, stop]);

  return (
    <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw]">
      <div
        ref={containerRef}
        className="overflow-x-hidden overflow-y-hidden whitespace-nowrap no-scrollbar py-3"
      >
        {items.map((it, idx) => (
          <span key={`${it.label}-${idx}`} className="inline-flex items-center">
            <a
              href={it.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/95 font-sans leading-none text-4xl md:text-5xl lg:text-6xl tracking-tight hover:opacity-100 opacity-95 transition-transform duration-200 hover:scale-105 hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.35)] px-3"
            >
              <ShinyText text={it.label} speed={3} />
            </a>
            <span aria-hidden="true" className="text-white select-none text-5xl md:text-6xl lg:text-7xl leading-none">|</span>
          </span>
        ))}
        {items.map((it, idx) => (
          <span key={`dup-${it.label}-${idx}`} className="inline-flex items-center">
            <a
              href={it.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/95 font-sans leading-none text-4xl md:text-5xl lg:text-6xl tracking-tight hover:opacity-100 transition-transform duration-200 hover:scale-105 px-3"
            >
              <ShinyText text={it.label} speed={3} />
            </a>
            <span aria-hidden="true" className="text-white select-none text-5xl md:text-6xl lg:text-7xl leading-none">|</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function CertificationsSection() {
  return (
    <section id="certifications" className="py-20 px-0">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <SplitHeading
            text="My Certifications and Badges"
            as="h2"
            split="words"
            delay={0.04}
            duration={0.45}
            className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tight mb-2"
          />
        </motion.div>
      </div>
      <div className="space-y-2">
        <ManualStrip />
        <ManualStrip reverse />
      </div>
    </section>
  );
}
