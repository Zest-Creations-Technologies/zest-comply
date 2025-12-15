import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from '@/components/Logo';

export function LandingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-sm' 
          : 'bg-background/80 backdrop-blur-md border-b border-border'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Logo size="lg" textClassName="text-foreground" />

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {[
              { href: '#why', label: 'Why ZestComply' },
              { href: '#how-it-works', label: 'How It Works' },
              { href: '#pricing', label: 'Pricing' },
            ].map((link) => (
              <a 
                key={link.href}
                href={link.href} 
                className="text-foreground font-bold hover:text-primary transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </a>
            ))}
            <a 
              href="/documents/ZestCreations_Capability_Statement.pdf" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-foreground font-bold hover:text-primary transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            >
              Capability Statement
            </a>
            <a 
              href="https://www.zestcyber.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-foreground font-bold hover:text-primary transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            >
              Corporate Home
            </a>
            <a 
              href="https://www.zestcreationstechnologies.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-foreground font-bold hover:text-primary transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            >
              Secure Cloud & Hosting
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <Button asChild className="transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5">
                <Link to="/app">Go to Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild className="transition-all duration-200 hover:bg-primary/10">
                  <Link to="/auth/login">Sign In</Link>
                </Button>
                <Button asChild className="transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5">
                  <Link to="/auth/signup">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 transition-transform duration-200 active:scale-95"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
            mobileMenuOpen ? 'max-h-96 opacity-100 py-4' : 'max-h-0 opacity-0 py-0'
          } border-t border-border`}
        >
          <nav className="flex flex-col gap-4">
            <a href="#why" className="text-foreground font-bold hover:text-primary transition-colors duration-200">
              Why ZestComply
            </a>
            <a href="#how-it-works" className="text-foreground font-bold hover:text-primary transition-colors duration-200">
              How It Works
            </a>
            <a href="#pricing" className="text-foreground font-bold hover:text-primary transition-colors duration-200">
              Pricing
            </a>
            <a href="/documents/ZestCreations_Capability_Statement.pdf" target="_blank" rel="noopener noreferrer" className="text-foreground font-bold hover:text-primary transition-colors duration-200">
              Capability Statement
            </a>
            <a href="https://www.zestcyber.com/" target="_blank" rel="noopener noreferrer" className="text-foreground font-bold hover:text-primary transition-colors duration-200">
              Corporate Home
            </a>
            <a href="https://www.zestcreationstechnologies.com/" target="_blank" rel="noopener noreferrer" className="text-foreground font-bold hover:text-primary transition-colors duration-200">
              Secure Cloud & Hosting
            </a>
            <div className="flex flex-col gap-2 pt-4 border-t border-border">
              {isAuthenticated ? (
                <Button asChild>
                  <Link to="/app">Go to Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link to="/auth/login">Sign In</Link>
                  </Button>
                  <Button asChild>
                    <Link to="/auth/signup">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
