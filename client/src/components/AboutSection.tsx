import { motion } from 'framer-motion';
import { TypewriterText } from '@/components/TypewriterText';
import ShinyText from '@/components/ShinyText';
import SplitHeading from '@/components/SplitHeading';
import { Card } from '@/components/ui/card';
import { Cloud, Brain, Code, Zap } from 'lucide-react';
import Tilt from '@/components/Tilt';

const features = [
  {
    icon: Cloud,
    title: 'Cloud Architecture',
    description: 'Designing and implementing scalable, secure, and cost-effective cloud solutions on AWS, E2E, and GCP.',
  },
  {
    icon: Brain,
    title: 'Agentic AI',
    description: 'Building autonomous agents and tool-using systems with RAG, workflows, and reasoning to solve complex problems.',
  },
  {
    icon: Code,
    title: 'DevOps & Automation',
    description: 'Streamlining development workflows with CI/CD pipelines, Infrastructure as Code, and containerization.',
  },
  {
    icon: Zap,
    title: 'Performance Optimization',
    description: 'Optimizing applications and infrastructure for maximum efficiency, scalability, and reliability.',
  },
];

export function AboutSection() {
  return (
    <section id="about" className="py-24 px-6 relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-10" style={{ backgroundSize: '50px 50px' }} />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <SplitHeading
            text="About Me"
            as="h2"
            split="words"
            delay={0.04}
            duration={0.45}
            className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6"
          />
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            <ShinyText
              text="Passionate engineer with expertise in cloud computing and artificial intelligence. I transform complex challenges into elegant, scalable solutions that drive business value."
              speed={3}
            />
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <Tilt rotateAmplitude={8} scaleOnHover={1.04}>
                <Card className="p-6 h-full backdrop-blur-sm bg-card/50 border-border hover:border-primary/30 transition-all group hover-elevate">
                  <div className="mb-4 relative">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity animate-glow" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </Card>
              </Tilt>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
