import { Link } from "react-router-dom";
import { Mail, Phone } from "lucide-react";
import logoIcon from "@/assets/logo-icon.png";

function FooterWordmark() {
  return (
    <div className="flex items-center gap-3">
      <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-amber-200/30 bg-gradient-to-br from-slate-950 via-slate-900 to-[#153b38]">
        <img src={logoIcon} alt="" className="relative h-6 w-6 opacity-95" />
      </span>
      <span className="text-xl font-semibold tracking-[-0.035em] text-white">
        Zest<span className="bg-gradient-to-r from-[#d6b66a] via-[#f7e5ad] to-[#8bd6c2] bg-clip-text text-transparent">Comply</span>
      </span>
    </div>
  );
}

export function LandingFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#071112] py-14 text-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.3fr_0.7fr_0.7fr_0.8fr]">
          <div>
            <FooterWordmark />
            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
              AI-assisted compliance operations for framework intelligence, policy generation, evidence management, human validation, monitoring, and reporting.
            </p>
          </div>

          <div>
            <h4 className="font-semibold">Platform</h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li><a href="#platform" className="hover:text-white">Capabilities</a></li>
              <li><a href="#workflow" className="hover:text-white">Workflow</a></li>
              <li><a href="#evidence" className="hover:text-white">Evidence</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold">Legal</h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
              <li><Link to="/security" className="hover:text-white">Security</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold">Contact</h4>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li>
                <a href="mailto:info@zestcyber.com" className="flex items-center gap-2 hover:text-white">
                  <Mail className="h-4 w-4" />
                  info@zestcyber.com
                </a>
              </li>
              <li>
                <a href="tel:+13462355062" className="flex items-center gap-2 hover:text-white">
                  <Phone className="h-4 w-4" />
                  (346) 235-5062
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-sm text-slate-500">
          © {new Date().getFullYear()} Zest Creations Technologies, LLC. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
