import { useScrollReveal } from '@/hooks/useScrollReveal';
import ibmSilverPartnerLogo from '@/assets/ibm-silver-partner.jpg';

interface Partner {
  name: string;
  logo: string;
  url: string;
}

const partners: Partner[] = [
  {
    name: 'IBM Silver Partner',
    logo: ibmSilverPartnerLogo,
    url: 'https://www.ibm.com',
  },
  // Add more partners here
];

// Duplicate partners for seamless infinite scroll
const duplicatedPartners = [...partners, ...partners, ...partners, ...partners];

export function PartnersSection() {
  const [sectionRef, isVisible] = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      className={`py-8 overflow-hidden transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="container mx-auto px-4 mb-4">
        <p className="text-center text-muted-foreground text-xs font-medium uppercase tracking-wider">
          Trusted by Industry Leaders
        </p>
      </div>

      {/* Sliding Logo Carousel */}
      <div className="relative w-full flex justify-center">
        {/* Gradient fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        {/* Scrolling container */}
        <div className="flex animate-scroll-logos w-max">
          {duplicatedPartners.map((partner, index) => (
            <a
              key={`${partner.name}-${index}`}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 mx-12 group"
              aria-label={`Visit ${partner.name}`}
            >
              <div className="relative w-32 h-16 flex items-center justify-center p-4 rounded-lg transition-transform duration-300 group-hover:scale-110">
                {/* Metal shine overlay */}
                <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                </div>
                
                {/* Logo */}
                <img
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  className="max-w-full max-h-full object-contain filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
