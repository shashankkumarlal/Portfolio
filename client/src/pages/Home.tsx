import { Navigation } from '@/components/Navigation';
import { ParticleBackground } from '@/components/ParticleBackground';
import { HeroSection } from '@/components/HeroSection';
import { AboutSection } from '@/components/AboutSection';
import { ProjectsSection } from '@/components/ProjectsSection';
import { SkillsSection } from '@/components/SkillsSection';
import { ExperienceSection } from '@/components/ExperienceSection';
import { CertificationsSection } from '@/components/CertificationsSection';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';
import { ChatWidget } from '@/components/ChatWidget';
import { PARALLAX_ENABLED } from '@/config/ui';
import { AuroraLayer } from '@/components/parallax/AuroraLayer';
import { CloudsLayer } from '@/components/parallax/CloudsLayer';
import { GridLayer } from '@/components/parallax/GridLayer';
import { DislikeCTA } from '@/components/DislikeCTA';
import { TechLogosSection } from '@/components/TechLogosSection';

export default function Home() {
  return (
    <div className="relative min-h-screen" id="home">
      {PARALLAX_ENABLED && (
        <>
          <GridLayer />
          <AuroraLayer />
          <CloudsLayer />
        </>
      )}
      <ParticleBackground />
      <Navigation />
      <main className="relative z-10">
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <SkillsSection />
        <TechLogosSection />
        <ExperienceSection />
        <CertificationsSection />
        <ContactSection />
        <DislikeCTA />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
