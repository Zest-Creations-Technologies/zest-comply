import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import logoIcon from "@/assets/logo-icon.png";

const navItems = [
  { href: "#platform", label: "Platform" },
  { href: "#workflow", label: "Workflow" },
  { href: "#evidence", label: "Evidence" },
  { href: "#reporting", label: "Reporting" },
];

function LandingWordmark() {
  return (
    <Link to="/" className="group flex items-center gap-3" aria-label="ZestComply home">
      <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-amber-200/30 bg-gradient-to-br from-slate-950 via-slate-900 to-[#153b38] shadow-lg shadow-emerald-950/30">
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_15%,rgba(250,204,21,0.38),transparent_34%),radial-gradient(circle_at_75%_80%,rgba(94,234,212,0.24),transparent_36%)]" />
        <img src={logoIcon} alt="" className="relative h-6 w-6 opacity-95" />
      </span>
      <span className="flex items-baseline text-[1.28rem] font-semibold tracking-[-0.035em] text-white">
        <span>Zest</span>
        <span className="bg-gradient-to-r from-[#d6b66a] via-[#f7e5ad] to-[#8bd6c2] bg-clip-text text-transparent">Comply</span>
      </span>
    </Link>
  );
}

export function LandingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const dashboardTarget = isAuthenticated ? "/app" : "/auth/signup";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-[#071112]/88 shadow-2xl shadow-slate-950/30 backdrop-blur-2xl"
          : "border-b border-white/5 bg-[#071112]/62 backdrop-blur-xl"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <LandingWordmark />

        <nav className="hidden items-center rounded-full border border-white/10 bg-white/[0.04] px-2 py-2 shadow-inner shadow-white/[0.03] lg:flex">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="rounded-full px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/[0.07] hover:text-white">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {!isAuthenticated && (
            <Button asChild variant="ghost" className="text-slate-200 hover:bg-white/10 hover:text-white">
              <Link to="/auth/login">Sign In</Link>
            </Button>
          )}
          <Button asChild className="bg-[#d8b45d] text-slate-950 shadow-lg shadow-amber-950/20 hover:bg-[#f0d990]">
            <Link to={dashboardTarget}>{isAuthenticated ? "Open Platform" : "Request Access"}</Link>
          </Button>
        </div>

        <button
          className="rounded-md p-2 text-slate-200 transition-colors hover:bg-white/10 lg:hidden"
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-white/10 bg-[#071112] px-5 py-5 lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-3">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-200 hover:bg-white/10" onClick={() => setMobileMenuOpen(false)}>
                {item.label}
              </a>
            ))}
            <div className="mt-2 grid gap-2 border-t border-white/10 pt-4">
              {!isAuthenticated && (
                <Button asChild variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10">
                  <Link to="/auth/login">Sign In</Link>
                </Button>
              )}
              <Button asChild className="bg-[#d8b45d] text-slate-950 hover:bg-[#f0d990]">
                <Link to={dashboardTarget}>{isAuthenticated ? "Open Platform" : "Request Access"}</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
