import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useState, useEffect, useRef, type ReactNode } from 'react';

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
];

export function Navigation() {
  const mouseX = useMotionValue(Infinity);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const DockNavItem = ({ children, onClick }: { children: ReactNode; onClick: () => void }) => {
    const ref = useRef<HTMLDivElement>(null);
    const distance = 200; // influence radius in px
    const peakScale = 1.32; // peak magnification at cursor

    const mouseDistance = useTransform(mouseX, (val) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return Infinity;
      const center = rect.left + rect.width / 2;
      return val - center;
    });

    const targetScale = useTransform(mouseDistance, [-distance, 0, distance], [1, peakScale, 1]);
    const scale = useSpring(targetScale, { mass: 0.15, stiffness: 200, damping: 20 });

    return (
      <motion.div ref={ref} style={{ scale }}>
        <Button variant="ghost" onClick={onClick} className="hover-elevate">
          {children}
        </Button>
      </motion.div>
    );
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const id = href.replace('#', '');
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'backdrop-blur-xl bg-background/80 border-b border-border shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex items-center gap-2"
            >
              <span
                className="tracking-tight text-[2rem] md:text-[2.5rem] leading-none font-black"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                {">_ Shashank"}
              </span>
            </motion.div>

            <motion.div
              className="hidden md:flex items-center gap-1"
              onMouseMove={(e) => mouseX.set(e.pageX)}
              onMouseLeave={() => mouseX.set(Infinity)}
            >
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05, duration: 0.4 }}
                >
                  <DockNavItem onClick={() => scrollToSection(item.href)}>
                    <span data-testid={`nav-${item.label.toLowerCase()}`}>{item.label}</span>
                  </DockNavItem>
                </motion.div>
              ))}
            </motion.div>

            <div className="md:hidden">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="hover-elevate"
                data-testid="button-mobile-menu"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-[73px] left-0 right-0 z-40 md:hidden backdrop-blur-xl bg-background/95 border-b border-border shadow-lg"
        >
          <div className="px-6 py-4 space-y-2">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                onClick={() => scrollToSection(item.href)}
                className="w-full justify-start hover-elevate"
                data-testid={`mobile-nav-${item.label.toLowerCase()}`}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </motion.div>
      )}
    </>
  );
}
