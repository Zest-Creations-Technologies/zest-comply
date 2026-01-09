import { Logo } from "@/components/Logo";
import { Mail, Phone, Globe } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Link } from "react-router-dom";
import ibmPartnerLogo from "@/assets/ibm-silver-partner.jpg";

export function LandingFooter() {
  const [footerRef, footerVisible] = useScrollReveal<HTMLElement>();

  return (
    <footer 
      ref={footerRef}
      className={`py-12 bg-background border-t border-border transition-all duration-700 ease-out ${
        footerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-5 gap-8">
          <div className="col-span-1">
            <div className="mb-4">
              <Logo size="md" textClassName="text-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-2">AI-powered compliance documentation made simple.</p>
            <p className="text-xs text-muted-foreground">
              A product of{" "}
              <a
                href="https://www.zestcyber.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline transition-colors duration-200"
              >
                Zest Creations Technologies
              </a>
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#how-it-works"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
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
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
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
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-2 group"
                >
                  <Mail className="h-4 w-4 transition-colors duration-200 group-hover:text-primary" />
                  info@zestcyber.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+13462355062"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-2 group"
                >
                  <Phone className="h-4 w-4 transition-colors duration-200 group-hover:text-primary" />
                  (346) 235-5062
                </a>
              </li>
              <li>
                <a
                  href="https://www.zestcyber.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-2 group"
                >
                  <Globe className="h-4 w-4 transition-colors duration-200 group-hover:text-primary" />
                  https://www.zestcyber.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/security" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* IBM Business Partner Section */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="max-w-md">
            <h4 className="font-semibold text-foreground mb-3 text-sm">IBM Business Partner</h4>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
              Zest Creations Technologies LLC is an authorized IBM Service Business Partner, delivering consulting, implementation, and managed services aligned with IBM technologies.
            </p>
            <img
              src={ibmPartnerLogo}
              alt="IBM Business Partner"
              className="h-32"
            />
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Zest Creations Technologies, LLC. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground/70">
              IBM is a trademark or registered trademark of International Business Machines Corporation. Zest Creations Technologies LLC is an independent IBM Business Partner.
            </p>
          </div>
          <div className="flex items-center gap-4">
            {['Twitter', 'LinkedIn', 'GitHub'].map((social) => (
              <a 
                key={social}
                href="#" 
                className="text-muted-foreground hover:text-foreground transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
