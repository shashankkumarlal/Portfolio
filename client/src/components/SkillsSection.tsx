import { motion } from 'framer-motion';
import { TypewriterText } from '@/components/TypewriterText';
import ShinyText from '@/components/ShinyText';
import SplitHeading from '@/components/SplitHeading';
import { Card } from '@/components/ui/card';
import Tilt from '@/components/Tilt';

const skillCategories = [
  {
    category: 'Cloud Platforms',
    skills: [
      { name: 'AWS', level: 90 },
      { name: 'E2E', level: 90 },
      { name: 'Google Cloud', level: 85 },
      { name: 'Hybrid Cloud', level: 80 },
    ],
  },
  {
    category: 'Agentic AI',
    skills: [
      { name: 'Langchain', level: 92 },
      { name: 'RAG pipeline', level: 70 },
      { name: 'Agents', level: 88 },
      { name: 'Workflows And Tools', level: 85 },
    ],
  },
  {
    category: 'DevOps & Tools',
    skills: [
      { name: 'Kubernetes', level: 93 },
      { name: 'Docker', level: 95 },
      { name: 'Terraform', level: 90 },
      { name: 'Jenkins', level: 87 },
    ],
  },
  {
    category: 'Programming',
    skills: [
      { name: 'Python', level: 95 },
      { name: 'Shell Scripting', level: 90 },
      { name: 'C++', level: 85 },
      { name: 'C', level: 75 },
    ],
  },
];

export function SkillsSection() {
  return (
    <section id="skills" className="py-24 px-6 relative">
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
            text="Skills & Expertise"
            as="h2"
            split="words"
            delay={0.04}
            duration={0.45}
            className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6"
          />
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            <ShinyText
              text="Comprehensive technical expertise across cloud platforms, AI/ML frameworks, and modern development tools."
              speed={3}
            />
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, x: categoryIndex % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: categoryIndex * 0.1, duration: 0.6 }}
            >
              <Tilt rotateAmplitude={8} scaleOnHover={1.04}>
                <Card className="p-6 backdrop-blur-sm bg-card/50 border-border hover:border-primary/30 transition-all" data-testid={`card-skill-category-${categoryIndex}`}>
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <span className="h-1 w-8 bg-gradient-to-r from-primary to-secondary rounded-full" />
                    {category.category}
                  </h3>
                  
                  <div className="space-y-4">
                    {category.skills.map((skill, skillIndex) => (
                      <div key={skill.name} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-mono text-sm">{skill.name}</span>
                          <span className="text-xs text-muted-foreground font-mono">{skill.level}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            viewport={{ once: true }}
                            transition={{ delay: categoryIndex * 0.1 + skillIndex * 0.05, duration: 0.8, ease: 'easeOut' }}
                            className="h-full bg-gradient-to-r from-primary via-secondary to-accent rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </Tilt>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
