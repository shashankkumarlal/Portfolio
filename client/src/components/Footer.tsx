import { Github, Linkedin, Mail, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Footer() {
  return (
    <footer className="border-t border-border py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-white font-black">&gt;_</span>
              </div>
              <span className="font-black text-lg">Shashank</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Cloud & AI Engineer building innovative solutions for tomorrow's challenges.
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <div className="space-y-2">
              {['About', 'Projects', 'Skills', 'Experience', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })}
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                  data-testid={`footer-link-${item.toLowerCase()}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-4">Connect</h3>
            <div className="flex gap-2">
              <Button size="icon" variant="ghost" className="hover-elevate" data-testid="footer-github">
                <Github className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" className="hover-elevate" data-testid="footer-linkedin">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" className="hover-elevate" data-testid="footer-twitter">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" className="hover-elevate" data-testid="footer-mail">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Shashank. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
