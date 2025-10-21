import React, { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const ChatWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Hi! I'm your site assistant. Ask me anything about Shashank, projects, skills, or experience." }
  ]);
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [pupil, setPupil] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [angle, setAngle] = useState(0); // deg rotation for head
  const [peek, setPeek] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open]);

  // Track mouse to move robot pupils slightly toward the cursor
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const btn = buttonRef.current;
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const len = Math.hypot(dx, dy) || 1;
      const ux = dx / len;
      const uy = dy / len;
      const max = 3; // max pupil offset in px
      // Smooth a bit by easing toward target
      setPupil(prev => ({ x: ux * max, y: uy * max }));

      // Head rotation toward cursor (clamped)
      const rad = Math.atan2(dy, dx);
      const deg = (rad * 180) / Math.PI;
      const clamped = Math.max(-22, Math.min(22, deg));
      setAngle(clamped);
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  // Idle peek animation every ~12s
  useEffect(() => {
    const id = window.setInterval(() => {
      // Only peek when closed
      if (!open) {
        setPeek(true);
        window.setTimeout(() => setPeek(false), 1500);
      }
    }, 12000);
    return () => window.clearInterval(id);
  }, [open]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setLoading(true);
    try {
      const resp = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const data = await resp.json();
      const reply = data?.reply || 'Sorry, I could not get an answer right now.';
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Network error. Please try again later.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        className="fixed bottom-5 right-[24px] z-50 h-20 w-20 rounded-2xl bg-gradient-to-br from-cyan-500/30 via-purple-500/20 to-blue-500/30 text-primary-foreground shadow-2xl ring-1 ring-cyan-400/30 backdrop-blur-md transition-transform duration-300 flex items-center justify-center"
        aria-label={open ? 'Close chat' : 'Open chat'}
        style={{ transform: !open ? `translateX(${hovering || peek ? '0' : '25%'})` : undefined }}
      >
        {open ? (
          <X className="h-7 w-7" />
        ) : (
          // Cute robot face with tracking eyes
          <span className="relative inline-block" aria-hidden style={{ transform: `rotate(${angle}deg)`, transition: 'transform 120ms ease-out' }}>
            {/* Head */}
            <span className="block h-14 w-14 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 shadow-md border border-cyan-300" />
            {/* Side ears */}
            <span className="absolute left-[-6px] top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-orange-400 border border-orange-300" />
            <span className="absolute right-[-6px] top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-orange-400 border border-orange-300" />
            {/* Antenna */}
            <span className="absolute -top-1 left-1/2 -translate-x-1/2 h-3 w-[2px] bg-cyan-200 rounded-full" />
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-orange-400 border border-orange-300" />
            {/* Eyes */}
            <span className="absolute inset-0 flex items-center justify-center gap-1.5">
              {/* Left eye - very big */}
              <span className="relative h-7 w-7 rounded-full bg-white border border-white/40 overflow-hidden">
                <span
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{ width: '18px', height: '18px', backgroundColor: 'black', transform: `translate(calc(-50% + ${pupil.x}px), calc(-50% + ${pupil.y}px))`, transition: 'transform 80ms ease-out' }}
                />
              </span>
              {/* Right eye - very big */}
              <span className="relative h-7 w-7 rounded-full bg-white border border-white/40 overflow-hidden">
                <span
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{ width: '18px', height: '18px', backgroundColor: 'black', transform: `translate(calc(-50% + ${pupil.x}px), calc(-50% + ${pupil.y}px))`, transition: 'transform 80ms ease-out' }}
                />
              </span>
            </span>
            {/* Smile */}
            <span className="pointer-events-none absolute bottom-1 left-1/2 h-[3px] w-6 -translate-x-1/2 rounded-full bg-black/50" />
            {/* Presence dot */}
            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-primary animate-pulse" />
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-20 right-5 z-50 w-[min(90vw,380px)] h-[480px] rounded-xl border border-border bg-background/95 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-border font-semibold">Assistant</div>
          <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                <div className={`inline-block px-3 py-2 rounded-lg text-sm ${m.role === 'user' ? 'bg-primary/15 border border-primary/30' : 'bg-muted/30 border border-muted/40'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="text-left">
                <div className="inline-block px-3 py-2 rounded-lg text-sm bg-muted/30 border border-muted/40">Thinking…</div>
              </div>
            )}
          </div>
          <div className="p-3 border-t border-border flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about Shashank, projects, skills…"
              className="flex-1 h-10 px-3 rounded-md bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <button
              onClick={sendMessage}
              className="h-10 px-3 rounded-md bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-60"
              disabled={loading || !input.trim()}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
