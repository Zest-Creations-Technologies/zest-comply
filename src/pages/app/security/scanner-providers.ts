export interface ScannerProvider {
  id: string;
  name: string;
  description: string;
  websiteUrl?: string;
  recommended?: boolean;
}

// ZestComply is not limited to ZestRecon - any scanner that exposes an API
// can be connected. ZestRecon is listed first as ZestComply's own product,
// not as a requirement.
export const SCANNER_PROVIDERS: ScannerProvider[] = [
  {
    id: "zestrecon",
    name: "ZestRecon",
    description: "ZestComply's own security scanning product.",
    websiteUrl: "https://zestrecon.com",
    recommended: true,
  },
  { id: "qualys", name: "Qualys", description: "Vulnerability management and cloud security." },
  { id: "tenable", name: "Tenable Nessus", description: "Vulnerability scanning and exposure management." },
  { id: "wiz", name: "Wiz", description: "Cloud security and attack surface visibility." },
  { id: "rapid7", name: "Rapid7 InsightVM", description: "Vulnerability risk management." },
  { id: "custom", name: "Other / custom scanner", description: "Connect any scanner that exposes an API." },
];

export function getScannerProvider(id: string): ScannerProvider {
  return SCANNER_PROVIDERS.find((provider) => provider.id === id) ?? SCANNER_PROVIDERS[0];
}
