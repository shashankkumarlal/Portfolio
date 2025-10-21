import { motion } from 'framer-motion';
import { TypewriterText } from '@/components/TypewriterText';
import ShinyText from '@/components/ShinyText';
import SplitHeading from '@/components/SplitHeading';
import { Card } from '@/components/ui/card';
import { Briefcase, Calendar, GraduationCap } from 'lucide-react';
import Tilt from '@/components/Tilt';

const experiences = [
  {
    icon: 'school',
    role: 'Kendriya Vidyalaya No.2, Jalahalli East',
    company: 'Primary & Secondary Education',
    period: '2011-2022',
    description:
      'Completed comprehensive schooling with a strong foundation in science, mathematics, and computer fundamentals.',
    achievements: [
      'Actively participated in academic and co-curricular activities, developing leadership and teamwork skills.',
      'Achieved consistent academic excellence and represented the school in science and tech events.',
      'Learned to be atleast jack of all trades being a Kvian.',
    ],
  },
  {
    icon: 'school',
    role: 'REVA University',
    company: 'Bachelor of Technology – Electronics And Computer Engineering',
    period: '2022 - Present',
    description:
      'Gained strong technical foundation in cloud computing, AI, and full-stack development.',
    achievements: [
      'Built and deployed multiple cloud-based and AI-driven projects, including FinBot and Heirloom AI.',
      "Participated in national hackathons like HackVerse’25 and Stack Fusion Fest, securing awards and recognition.",
      'Actively engaged in research, innovation, and internships focused on cloud migration, agentic AI, and automation engineering.',
    ],
  },
  {
    icon: 'work',
    role: 'Hidevs',
    company: 'Cloud Engineer Intern',
    period: 'June 2025 - Sept 2025',
    description:
      'Migrated full-stack applications (Next.js frontend & Node.js backend) from AWS to E2E Networks, optimizing performance and costs.',
    achievements: [
      "Configured HTTPS, Nginx, and Let's Encrypt for production-grade deployment across multiple subdomains.",
      'Restored and managed MongoDB databases, ensuring seamless data recovery and user profile integration.',
      'Collaborated on deploying and maintaining GenAI backend services, integrating AI-powered features into live applications.',
    ],
  },
];

export function ExperienceSection() {
  return (
    <section id="experience" className="py-24 px-6 relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-10" style={{ backgroundSize: '50px 50px' }} />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <SplitHeading
            text="Education and Professional Journey"
            as="h2"
            split="words"
            delay={0.04}
            duration={0.45}
            className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6"
          />
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            <ShinyText
              text="A timeline of innovation, growth, and impactful contributions across leading tech organizations."
              speed={3}
            />
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent" />

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.role}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className={`relative ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12 md:ml-auto'} md:w-1/2`}
                data-testid={`card-experience-${index}`}
              >
                <div className="absolute left-0 md:left-auto md:right-0 md:-mr-2 top-6 w-4 h-4 rounded-full bg-primary border-4 border-background animate-glow" />
                
                <Tilt rotateAmplitude={8} scaleOnHover={1.04}>
                  <Card className="p-6 backdrop-blur-sm bg-card/50 border-border hover:border-primary/30 transition-all hover-elevate">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        {exp.icon === 'school' ? (
                          <GraduationCap className="h-5 w-5 text-primary" />
                        ) : (
                          <Briefcase className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold">{exp.role}</h3>
                        <p className="text-sm text-muted-foreground">{exp.company}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span className="font-mono">{exp.period}</span>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">{exp.description}</p>

                    <div className="space-y-2">
                      {exp.achievements.map((achievement, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <div className="mt-2 h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" />
                          <p className="text-sm leading-relaxed">{achievement}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                </Tilt>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
