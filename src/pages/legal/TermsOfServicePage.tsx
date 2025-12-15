import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold text-foreground mb-8">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: December 15, 2025</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using Zest Comply ("the Service"), operated by Zest Creations Technologies, 
              you agree to be bound by these Terms of Service. If you do not agree to these terms, 
              please do not use our Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Description of Service</h2>
            <p className="text-muted-foreground leading-relaxed">
              Zest Comply is an AI-powered compliance documentation platform that assists organizations in 
              generating, managing, and maintaining compliance documentation across various regulatory frameworks. 
              The Service includes AI-assisted document generation, framework recommendations, and document 
              storage integration.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Account Registration</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">To use the Service, you must:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Be at least 18 years of age</li>
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Promptly update any changes to your information</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Subscription and Payment</h2>
            <h3 className="text-xl font-medium text-foreground mb-3">4.1 Billing</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Paid subscriptions are billed in advance on a monthly or annual basis. You authorize us to 
              charge your payment method for all fees associated with your subscription.
            </p>
            
            <h3 className="text-xl font-medium text-foreground mb-3">4.2 Cancellation</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You may cancel your subscription at any time. Upon cancellation, you will retain access to 
              paid features until the end of your current billing period. No refunds are provided for 
              partial billing periods.
            </p>

            <h3 className="text-xl font-medium text-foreground mb-3">4.3 Price Changes</h3>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify pricing with 30 days' advance notice. Continued use of the 
              Service after price changes constitutes acceptance of the new pricing.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Acceptable Use</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">You agree not to:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Use the Service for any unlawful purpose</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon intellectual property rights of others</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Upload malicious code or content</li>
              <li>Use the Service to generate false or misleading compliance documentation</li>
              <li>Share account credentials with unauthorized users</li>
              <li>Reverse engineer or attempt to extract source code</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Intellectual Property</h2>
            <h3 className="text-xl font-medium text-foreground mb-3">6.1 Our Property</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              The Service, including its design, features, and content, is owned by Zest Creations Technologies 
              and protected by intellectual property laws. You may not copy, modify, or distribute our 
              proprietary materials without written permission.
            </p>

            <h3 className="text-xl font-medium text-foreground mb-3">6.2 Your Content</h3>
            <p className="text-muted-foreground leading-relaxed">
              You retain ownership of content you create using the Service. By using the Service, you grant 
              us a limited license to process and store your content as necessary to provide the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. AI-Generated Content Disclaimer</h2>
            <p className="text-muted-foreground leading-relaxed">
              Zest Comply uses artificial intelligence to assist in generating compliance documentation. 
              While we strive for accuracy, AI-generated content should be reviewed by qualified professionals 
              before implementation. We do not guarantee that generated documents will meet all regulatory 
              requirements or be suitable for your specific situation. You are solely responsible for 
              reviewing, validating, and implementing any compliance documentation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, ZEST CREATIONS TECHNOLOGIES SHALL NOT BE LIABLE FOR 
              ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT 
              LIMITED TO LOSS OF PROFITS, DATA, OR BUSINESS OPPORTUNITIES. OUR TOTAL LIABILITY SHALL NOT 
              EXCEED THE AMOUNT PAID BY YOU FOR THE SERVICE IN THE TWELVE MONTHS PRECEDING THE CLAIM.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Disclaimer of Warranties</h2>
            <p className="text-muted-foreground leading-relaxed">
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER 
              EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR 
              A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE 
              UNINTERRUPTED, ERROR-FREE, OR COMPLETELY SECURE.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">10. Indemnification</h2>
            <p className="text-muted-foreground leading-relaxed">
              You agree to indemnify and hold harmless Zest Creations Technologies, its officers, directors, 
              employees, and agents from any claims, damages, losses, or expenses arising from your use of 
              the Service or violation of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">11. Termination</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may suspend or terminate your access to the Service at any time for violation of these 
              Terms or for any other reason at our discretion. Upon termination, your right to use the 
              Service will immediately cease. Provisions that by their nature should survive termination 
              shall remain in effect.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">12. Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the State of 
              Texas, without regard to conflict of law principles. Any disputes shall be resolved in the 
              courts located in Harris County, Texas.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">13. Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify these Terms at any time. Material changes will be communicated 
              via email or through the Service. Continued use after changes constitutes acceptance of the 
              modified Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">14. Contact Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              For questions about these Terms, please contact us at:
            </p>
            <div className="mt-4 text-muted-foreground">
              <p><strong className="text-foreground">Zest Creations Technologies</strong></p>
              <p>Email: <a href="mailto:info@zestcyber.com" className="text-primary hover:underline">info@zestcyber.com</a></p>
              <p>Phone: <a href="tel:+13462355062" className="text-primary hover:underline">(346) 235-5062</a></p>
              <p>Website: <a href="https://www.zestcyber.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://www.zestcyber.com</a></p>
            </div>
          </section>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
