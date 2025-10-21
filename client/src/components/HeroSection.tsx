import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';
import profileImage from '@assets/WhatsApp_Image_2025-10-19_at_23.14.32_7aa574f1-removebg-preview.png';
import { useState, lazy, Suspense, useMemo } from 'react';
import { TypewriterText } from '@/components/TypewriterText';
import { OGL_HERO_ENABLED } from '@/config/ui';
import ShinyText from '@/components/ShinyText';
import SplitHeading from '@/components/SplitHeading';
import Magnet from '@/components/Magnet';

interface TechItem {
  name: string;
  icon: string;
  color: string;
  items: string[];
}

interface TechBadgeProps {
  tech: TechItem;
  index: number;
  isHovered: number | null;
  onHoverStart: (index: number) => void;
  onHoverEnd: () => void;
}

const TechBadge: React.FC<TechBadgeProps> = ({ tech, index, isHovered, onHoverStart, onHoverEnd }) => {
  return (
    <motion.div 
      key={tech.name} 
      className="relative group"
      onHoverStart={() => onHoverStart(index)}
      onHoverEnd={onHoverEnd}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 + (index * 0.1) }}
    >
      <motion.span 
        className="px-4 py-2 rounded-lg bg-gradient-to-r text-white font-medium text-sm cursor-default flex items-center gap-2 relative z-20"
        style={{
          backgroundImage: `linear-gradient(135deg, var(--${tech.color.split(' ')[0].substring(5)}, #000), var(--${tech.color.split(' ')[2] || tech.color.split(' ')[1]}, #000))`
        }}
        whileHover={{ 
          y: -5,
          scale: 1.05,
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <span className="text-lg">{tech.icon}</span>
        <ShinyText text={tech.name} speed={3} />
      </motion.span>
      
      <AnimatePresence>
        {isHovered === index && (
          <motion.div 
            className="absolute bottom-full left-0 mb-2 w-max max-w-xs origin-bottom z-50"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              transition: { 
                type: 'spring',
                stiffness: 400,
                damping: 30
              }
            }}
            exit={{ 
              opacity: 0, 
              y: 0, 
              scale: 0.95,
              transition: { duration: 0.15 }
            }}
          >
            <motion.div 
              className="bg-background border border-border/50 rounded-xl p-4 shadow-2xl backdrop-blur-lg overflow-hidden"
              style={{
                background: 'rgba(var(--background-rgb), 0.9)'
              }}
              initial={{ clipPath: 'inset(0 0 100% 0)' }}
              animate={{ 
                clipPath: 'inset(0 0 0% 0)',
                transition: { 
                  duration: 0.4,
                  ease: [0.4, 0, 0.2, 1]
                }
              }}
              exit={{ 
                clipPath: 'inset(0 0 100% 0)',
                transition: { 
                  duration: 0.2,
                  ease: [0.4, 0, 1, 1]
                }
              }}
            >
              <div className="grid grid-cols-2 gap-3">
                {tech.items.map((item, i) => (
                  <motion.div 
                    key={item} 
                    className="px-3 py-2 bg-muted/30 rounded-lg text-sm font-medium text-foreground/90 backdrop-blur-sm flex items-center justify-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      transition: { 
                        delay: 0.05 * i,
                        type: 'spring',
                        stiffness: 500,
                        damping: 25
                      }
                    }}
                    whileHover={{
                      scale: 1.05,
                      background: 'rgba(var(--primary-rgb), 0.1)',
                      color: 'var(--primary)'
                    }}
                  >
                    {item}
                  </motion.div>
                ))}
              </div>
              <motion.div 
                className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent"
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ 
                  scaleX: 1,
                  transition: { 
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1]
                  }
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const LazyOGLParticles = lazy(() => import('@/components/Particles'));

export const HeroSection: React.FC = () => {
  const [hoveredTech, setHoveredTech] = useState<number | null>(null);
  const reduceMotion = useMemo(() => (
    typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ), []);

  const technologies: TechItem[] = [
    {
      name: 'AWS',
      icon: '☁️',
      color: 'from-orange-500 to-yellow-500',
      items: ['S3', 'EC2', 'Lambda', 'CloudWatch', 'RDS', 'DynamoDB', 'API Gateway', 'CloudFront']
    },
    {
      name: 'Google Cloud',
      icon: '🌐',
      color: 'from-blue-500 to-cyan-400',
      items: ['Compute Engine', 'Cloud Run', 'Cloud Functions', 'Cloud Storage', 'BigQuery', 'Pub/Sub']
    },
    {
      name: 'Agentic AI',
      icon: '🤖',
      color: 'from-orange-400 to-red-500',
      items: ['LangChain', 'CrewAI', 'Agents', 'Tools', 'RAG Pipelines', 'Workflows']
    },
    {
      name: 'Python',
      icon: '🐍',
      color: 'from-red-500 to-orange-500',
      items: ['FastAPI', 'NumPy', 'Pandas', 'AsyncIO', 'OOP', 'Typing']
    },
    {
      name: 'Shell Scripting',
      icon: '🐚',
      color: 'from-blue-400 to-indigo-600',
      items: ['Bash', 'Zsh', 'Cron', 'grep/sed/awk', 'tmux', 'ssh']
    }
  ];
  
  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden px-6 py-20">
      <div className="absolute inset-0 bg-grid-pattern opacity-20" style={{ backgroundSize: '50px 50px' }} />
      {OGL_HERO_ENABLED && !reduceMotion && (
        <div className="absolute inset-0 -z-10">
          <Suspense fallback={null}>
            <LazyOGLParticles
              particleColors={["#78E4FF", "#AFCBFF", "#ffffff"]}
              particleCount={220}
              particleSpread={10}
              speed={0.12}
              particleBaseSize={90}
              sizeRandomness={1}
              moveParticlesOnHover={true}
              particleHoverFactor={0.8}
              alphaParticles={true}
              disableRotation={false}
              className="opacity-90"
            />
          </Suspense>
        </div>
      )}
      
      
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-block mb-4"
            >
              <span className="px-4 py-2 rounded-md bg-primary/10 border border-primary/20 text-primary text-sm font-mono">
                Cloud & AI Engineer
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mb-6"
            >
              <SplitHeading
                text="Building the Future of Tech"
                as="h1"
                split="words"
                delay={0.05}
                duration={0.5}
                className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight"
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed"
            >
              <ShinyText
                text="Architecting scalable cloud infrastructure and cutting-edge AI solutions that transform businesses and drive innovation."
                speed={3}
              />
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Button
                size="lg"
                onClick={scrollToProjects}
                className="group relative overflow-hidden rounded-xl backdrop-blur-sm bg-gradient-to-br from-[#0f2e41]/85 to-[#362a55]/85 border border-cyan-400/30 text-cyan-300 hover:text-cyan-200 hover:border-cyan-400 shadow-[0_8px_24px_rgba(0,255,255,0.08)] hover:shadow-[0_10px_28px_rgba(0,255,255,0.14)] hover:-translate-y-0.5 hover:ring-2 hover:ring-cyan-400/40 transition-all"
                data-testid="button-view-projects"
              >
                View Projects
                <ArrowDown className="ml-2 h-4 w-4 group-hover:translate-y-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={scrollToContact}
                className="backdrop-blur-sm"
                data-testid="button-get-in-touch"
              >
                Get in Touch
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex gap-4 mt-8"
            >
              <Button asChild size="icon" variant="ghost" className="hover-elevate" data-testid="link-github">
                <a href="https://github.com/shashankkumarlal" target="_blank" rel="noopener noreferrer" aria-label="Open GitHub profile">
                  <Github className="h-5 w-5" />
                </a>
              </Button>
              <Button asChild size="icon" variant="ghost" className="hover-elevate" data-testid="link-linkedin">
                <a href="https://www.linkedin.com/in/shashank-kumar-lal/" target="_blank" rel="noopener noreferrer" aria-label="Open LinkedIn profile">
                  <Linkedin className="h-5 w-5" />
                </a>
              </Button>
              <Button asChild size="icon" variant="ghost" className="hover-elevate" data-testid="link-email">
                <a href="mailto:shashanklal309@gmail.com" aria-label="Send email">
                  <Mail className="h-5 w-5" />
                </a>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="mt-6"
            >
              <Magnet padding={360} magnetStrength={4}>
                <Button
                  size="sm"
                  onClick={scrollToContact}
                  aria-label="Hire Me"
                  className="rounded-xl px-6 py-6 bg-gradient-to-br from-primary/90 to-secondary/90 text-white border border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.25)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.35)] hover:-translate-y-0.5 transition-all text-2xl"
                >
                  Hire Me
                </Button>
              </Magnet>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
            className="relative w-full flex flex-col items-center"
          >
            <div className="w-full max-w-md mx-auto">
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-auto max-w-xs mx-auto object-cover aspect-[3/4] rounded-lg"
                style={{
                  objectPosition: 'center 25%',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                }}
              />
            </div>

            {/* Status and Tech Stack - Moved below image */}
            <div className="w-full mt-12 text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                <span className="text-sm font-mono text-muted-foreground">
                  <TypewriterText text="Status: Available for opportunities" speedMs={24} />
                </span>
              </div>
              
              <div className="relative">
                <div className="flex flex-wrap justify-center gap-3 relative z-10">
                  {technologies.map((tech, index) => (
                    <TechBadge 
                      key={tech.name}
                      tech={tech}
                      index={index}
                      isHovered={hoveredTech}
                      onHoverStart={(idx) => setHoveredTech(idx)}
                      onHoverEnd={() => setHoveredTech(null)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float -z-10" />
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-secondary/10 rounded-full blur-3xl animate-float -z-10" style={{ animationDelay: '1s' }} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
