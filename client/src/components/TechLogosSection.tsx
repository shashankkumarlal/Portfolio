import React from 'react';
import LogoLoop from '@/components/LogoLoop';
import { SiJenkins, SiKubernetes, SiDocker, SiTerraform, SiPython, SiGnubash, SiCplusplus, SiC, SiGooglecloud, SiLangchain } from 'react-icons/si';

export const TechLogosSection: React.FC = () => {
  // Custom SVG component for E2E Networks logo
  const E2ENetworksLogo = () => (
    <svg viewBox="0 0 200 50" className="w-full h-full">
      <text x="10" y="35" fontSize="32" fontWeight="bold" fill="currentColor" fontFamily="Ubuntu, sans-serif">
        E2E
      </text>
    </svg>
  );

  // Prefer official image logos for brands without a good icon or for accuracy
  const imageLogos = [
    { src: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg', alt: 'AWS', href: 'https://aws.amazon.com' },
    { src: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg', alt: 'Google Cloud', href: 'https://cloud.google.com' },
  ];

  const iconLogos = [
    { node: <E2ENetworksLogo />, title: 'E2E Networks', href: 'https://www.e2enetworks.com' },
    { node: <SiLangchain />, title: 'LangChain', href: 'https://www.langchain.com' },
    { node: <SiJenkins />, title: 'Jenkins', href: 'https://www.jenkins.io' },
    { node: <SiKubernetes />, title: 'Kubernetes', href: 'https://kubernetes.io' },
    { node: <SiDocker />, title: 'Docker', href: 'https://www.docker.com' },
    { node: <SiTerraform />, title: 'Terraform', href: 'https://www.terraform.io' },
    { node: <SiPython />, title: 'Python', href: 'https://www.python.org' },
    { node: <SiGnubash />, title: 'Shell Scripting (Bash)', href: 'https://www.gnu.org/software/bash/' },
    { node: <SiCplusplus />, title: 'C++', href: 'https://isocpp.org/' },
    { node: <SiC />, title: 'C', href: 'https://en.wikipedia.org/wiki/C_(programming_language)' },
    { node: <SiGooglecloud />, title: 'Google Cloud', href: 'https://cloud.google.com' }
  ];

  const logos = [
    ...imageLogos,
    ...iconLogos,
  ];

  return (
    <section className="relative py-2 px-0">
      <div className="absolute inset-0 bg-grid-pattern opacity-10" style={{ backgroundSize: '50px 50px' }} />
      <div className="relative z-10 w-screen left-1/2 right-1/2 -ml-[50vw]">
        <LogoLoop
          logos={logos}
          speed={140}
          direction="left"
          width="100%"
          logoHeight={44}
          gap={48}
          pauseOnHover
          scaleOnHover
          fadeOut
          ariaLabel="Technology & tools"
        />
      </div>
    </section>
  );
};
