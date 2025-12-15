import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Shield, Lock, Server, Eye, CheckCircle, AlertTriangle } from "lucide-react";

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <Shield className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-foreground mb-4">Security at Zest Comply</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your compliance data is sensitive. We take security seriously with enterprise-grade 
            protection at every layer.
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-12">
          <section className="bg-card border border-border rounded-lg p-8">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold text-foreground m-0">Data Encryption</h2>
            </div>
            <ul className="text-muted-foreground space-y-3 mt-4">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong className="text-foreground">Encryption in Transit:</strong> All data transmitted between your browser and our servers is encrypted using TLS 1.3</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong className="text-foreground">Encryption at Rest:</strong> All stored data is encrypted using AES-256 encryption</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong className="text-foreground">Secure Key Management:</strong> Encryption keys are managed using industry-standard key management services</span>
              </li>
            </ul>
          </section>

          <section className="bg-card border border-border rounded-lg p-8">
            <div className="flex items-center gap-3 mb-4">
              <Server className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold text-foreground m-0">Infrastructure Security</h2>
            </div>
            <ul className="text-muted-foreground space-y-3 mt-4">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong className="text-foreground">Cloud Infrastructure:</strong> Hosted on enterprise-grade cloud providers with SOC 2 Type II certification</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong className="text-foreground">Network Security:</strong> Protected by firewalls, intrusion detection, and DDoS mitigation</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong className="text-foreground">Regular Backups:</strong> Automated daily backups with point-in-time recovery capabilities</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong className="text-foreground">Disaster Recovery:</strong> Multi-region redundancy ensures high availability and data durability</span>
              </li>
            </ul>
          </section>

          <section className="bg-card border border-border rounded-lg p-8">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold text-foreground m-0">Access Controls</h2>
            </div>
            <ul className="text-muted-foreground space-y-3 mt-4">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong className="text-foreground">Authentication:</strong> Secure token-based authentication with automatic session expiration</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong className="text-foreground">Role-Based Access:</strong> Granular permissions ensure users only access authorized resources</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong className="text-foreground">Audit Logging:</strong> Comprehensive logging of all access and modifications for accountability</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong className="text-foreground">Employee Access:</strong> Strict internal policies limit employee access to production data on a need-to-know basis</span>
              </li>
            </ul>
          </section>

          <section className="bg-card border border-border rounded-lg p-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold text-foreground m-0">Application Security</h2>
            </div>
            <ul className="text-muted-foreground space-y-3 mt-4">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong className="text-foreground">Secure Development:</strong> Security-first development practices with code reviews and testing</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong className="text-foreground">Vulnerability Scanning:</strong> Regular automated scans and penetration testing</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong className="text-foreground">Dependency Management:</strong> Continuous monitoring and patching of third-party dependencies</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong className="text-foreground">Input Validation:</strong> All user inputs are sanitized to prevent injection attacks</span>
              </li>
            </ul>
          </section>

          <section className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">AI & Data Privacy</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We understand the sensitivity of compliance data. Our AI systems are designed with privacy in mind:
            </p>
            <ul className="text-muted-foreground space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Your data is never used to train our AI models without explicit consent</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Conversations are encrypted and stored securely in isolated tenant environments</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>You can delete your data at any time, and it will be permanently removed from our systems</span>
              </li>
            </ul>
          </section>

          <section className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Third-Party Integrations</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              When you connect cloud storage providers (Google Drive, Dropbox, OneDrive):
            </p>
            <ul className="text-muted-foreground space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>We use OAuth 2.0 for secure authorization without storing your passwords</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Access tokens are encrypted and stored securely</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>You can revoke access at any time from your settings</span>
              </li>
            </ul>
          </section>

          <section className="bg-primary/10 border border-primary/20 rounded-lg p-8">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold text-foreground m-0">Report a Vulnerability</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We appreciate the security research community's efforts in helping keep our platform secure. 
              If you discover a security vulnerability, please report it responsibly:
            </p>
            <div className="text-muted-foreground">
              <p>Email: <a href="mailto:info@zestcyber.com" className="text-primary hover:underline">info@zestcyber.com</a></p>
              <p className="mt-2 text-sm">
                Please include detailed information about the vulnerability and steps to reproduce. 
                We will acknowledge receipt within 48 hours and work with you on remediation.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              For security inquiries or concerns, please contact:
            </p>
            <div className="mt-4 text-muted-foreground">
              <p><strong className="text-foreground">Zest Creations Technologies</strong></p>
              <p>Email: <a href="mailto:info@zestcyber.com" className="text-primary hover:underline">info@zestcyber.com</a></p>
              <p>Phone: <a href="tel:+13462355062" className="text-primary hover:underline">(346) 235-5062</a></p>
            </div>
          </section>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
