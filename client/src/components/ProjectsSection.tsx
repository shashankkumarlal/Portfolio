import { motion } from 'framer-motion';
import { TypewriterText } from '@/components/TypewriterText';
import ShinyText from '@/components/ShinyText';
import SplitHeading from '@/components/SplitHeading';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';

const projects = [
  {
    title: 'Real-Time Multilingual Query Handler for 110+ Languages (Jun 2025)',
    description: 'AI-powered multilingual support tool using Python, LangChain, and Groq LLaMA 3. Auto-detection, Streamlit UI, CSV logs, and AI-generated replies.',
    tags: ['Python', 'LangChain', 'Groq', 'LLaMA 3', 'Streamlit'],
    gradient: 'from-primary/20 to-secondary/20',
    url: 'https://github.com/shashankkumarlal/Real-Time-Multilingual-Query-Handler_HiDevs',
  },
  {
    title: 'AWS EC2 Monitoring & Cost Analysis (Feb 2025 – Mar 2025)',
    description: 'EC2 launch, CloudWatch monitoring, IAM/security configuration, and billing tracking with alarms to manage cloud costs. Includes BASH scripting.',
    tags: ['AWS', 'EC2', 'CloudWatch', 'IAM', 'Bash'],
    gradient: 'from-secondary/20 to-accent/20',
    url: 'https://github.com/shashankkumarlal/AWS-EC2-Monitoring-Cost-Analysis',
  },
  {
    title: 'Automated Weather Data Collection with AWS & R (Feb 2025 – Mar 2025)',
    description: 'Cloud-integrated weather analytics pipeline with AWS Lambda, S3, API Gateway, and R for real-time data collection and JSON processing every 5 minutes.',
    tags: ['AWS', 'Lambda', 'API Gateway', 'S3', 'R'],
    gradient: 'from-accent/20 to-primary/20',
    url: 'https://github.com/shashankkumarlal/Cloud-Integrated-Weather-Analytics-Pipeline',
  },
  {
    title: 'Website Uptime Monitoring with AWS (Mar 2025)',
    description: 'AWS-based monitoring for REVA University website using Lambda, S3, SNS, and CloudWatch for live status checks and instant alerts.',
    tags: ['AWS', 'Lambda', 'SNS', 'S3', 'CloudWatch'],
    gradient: 'from-primary/20 via-secondary/20 to-accent/20',
    url: 'https://github.com/shashankkumarlal/Website-Uptime-Monitoring-with-AWS-Lambda-and-S3',
  },
  {
    title: 'CLOUD and IOT based smart farm Monitoring (Nov 2024)',
    description: 'IoT-enabled platform with ESP8266 and Python uploading sensor data to Google Firebase for real-time farm automation and resource optimization.',
    tags: ['IoT', 'ESP8266', 'Python', 'Firebase'],
    gradient: 'from-secondary/20 to-primary/20',
    url: 'https://github.com/shashankkumarlal/Cloud-and-IOT-based-smart-Farming',
  },
  {
    title: 'Marketing-Strategist-Ai-Agent (May 19, 2025)',
    description: 'AI-powered marketing strategist chatbot using Groq’s LLaMA 3 and live web search for competitor analysis, campaign planning, and real-time insights.',
    tags: ['AI Agent', 'Groq', 'LLaMA 3', 'Search'],
    gradient: 'from-accent/20 to-secondary/20',
    url: 'https://github.com/shashankkumarlal/Marketing-Strategist-Ai-Agent',
  },
  {
    title: 'sales-outreach-ai (May 17, 2025)',
    description: 'AI-driven agent to automate personalized cold emails and follow-ups for sales outreach using LangChain and Groq-hosted LLaMA 3.',
    tags: ['AI Agent', 'LangChain', 'Groq', 'Email'],
    gradient: 'from-primary/20 to-secondary/20',
    url: 'https://github.com/shashankkumarlal/sales-outreach-ai',
  },
  {
    title: 'CampusEventer_webknot (Sep 6, 2025)',
    description: 'All-in-one campus event management platform with AI-powered chatbot assistance for efficient event handling.',
    tags: ['Web', 'Chatbot', 'Events'],
    gradient: 'from-secondary/20 to-accent/20',
    url: 'https://github.com/shashankkumarlal/CampusEventer_webknot',
  },
  {
    title: 'fit5F (Mar 22, 2025)',
    description: 'Gamified fitness website using pose estimation to track exercises and reward users with experience points and levels.',
    tags: ['Fitness', 'Pose Estimation', 'Web'],
    gradient: 'from-accent/20 to-primary/20',
    url: 'https://github.com/shashankkumarlal/fit5F',
  },
];

export function ProjectsSection() {
  return (
    <section id="projects" className="py-24 px-6 relative">
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
            text="Featured Projects"
            as="h2"
            split="words"
            delay={0.04}
            duration={0.45}
            className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6"
          />
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            <ShinyText
              text="A showcase of innovative solutions leveraging cloud computing, artificial intelligence, and modern DevOps practices."
              speed={3}
            />
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <Card className="p-6 h-full flex flex-col backdrop-blur-sm bg-card/50 border-border hover:border-primary/30 transition-all group hover-elevate" data-testid={`card-project-${index}`}>
                <div className={`h-2 w-16 rounded-full bg-gradient-to-r ${project.gradient} mb-6 group-hover:w-full transition-all duration-500`} />
                
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{project.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 rounded-md bg-muted/50 border border-border text-xs font-mono"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex mt-auto">
                  <Button asChild size="sm" variant="outline" className="flex-1 hover-elevate" data-testid={`button-view-project-${index}`}>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open GitHub for ${project.title}`}
                    >
                      <Github className="h-4 w-4 mr-2" />
                      <ShinyText text="View" speed={3} />
                    </a>
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
