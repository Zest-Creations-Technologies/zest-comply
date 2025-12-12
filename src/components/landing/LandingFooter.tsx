import { Logo } from '@/components/Logo';
import { Mail, Phone, Globe } from 'lucide-react';

export function LandingFooter() {
  return (
    <footer className="py-12 bg-background border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-5 gap-8">
          <div className="col-span-1">
            <div className="mb-4">
              <Logo size="md" textClassName="text-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              AI-powered compliance documentation made simple.
            </p>
            <p className="text-xs text-muted-foreground">
              A product of{' '}
              <a 
                href="https://www.zestcyber.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Zest Cyber
              </a>
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Frameworks
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://www.zestcyber.com/about-us" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Contact</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="mailto:info@zestcyber.com" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  info@zestcyber.com
                </a>
              </li>
              <li>
                <a 
                  href="tel:+13462355062" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <Phone className="h-4 w-4" />
                  (346) 235-5062
                </a>
              </li>
              <li>
                <a 
                  href="https://www.zestcyber.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <Globe className="h-4 w-4" />
                  zestcyber.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Security
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Zest Comply. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Twitter
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              LinkedIn
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}