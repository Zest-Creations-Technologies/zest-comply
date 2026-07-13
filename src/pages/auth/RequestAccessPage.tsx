import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Loader2 } from 'lucide-react';
import { z } from 'zod';
import { AuthShell, AuthWordmark, authCardClass, authInputClass, authPrimaryButtonClass, authLinkClass, authLabelClass, authErrorClass } from './AuthShell';
import { accessRequestsApi } from '@/lib/api/access-requests';
import { useToast } from '@/hooks/use-toast';

const requestAccessSchema = z.object({
  company_name: z.string().trim().min(1, 'Company name is required').max(255),
  contact_first_name: z.string().trim().min(1, 'First name is required').max(100),
  contact_last_name: z.string().trim().min(1, 'Last name is required').max(100),
  email: z.string().email('Please enter a valid email address'),
  company_size: z.string().optional(),
  message: z.string().max(2000).optional(),
});

type FormErrors = Partial<Record<keyof z.infer<typeof requestAccessSchema>, string>>;

const companySizeOptions = [
  '1-10 employees (Startup)',
  '11-50 employees (Small Business)',
  '51-250 employees (Growing Business)',
  '251-1,000 employees (Mid-Market)',
  '1,001-5,000 employees (Enterprise)',
  '5,001-10,000 employees',
  '10,000+ employees',
  'Government Agency',
  'Prime Contractor',
  'Managed Service Provider (MSP/MSSP)',
  'Compliance Consultant / CPA Firm',
];

export default function RequestAccessPage() {
  const [companyName, setCompanyName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = requestAccessSchema.safeParse({
      company_name: companyName,
      contact_first_name: firstName,
      contact_last_name: lastName,
      email,
      company_size: companySize || undefined,
      message: message || undefined,
    });
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.errors.forEach((err) => {
        const key = err.path[0] as keyof FormErrors;
        if (key) fieldErrors[key] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      await accessRequestsApi.submit({
        company_name: companyName.trim(),
        contact_first_name: firstName.trim(),
        contact_last_name: lastName.trim(),
        email: email.trim(),
        company_size: companySize || undefined,
        message: message.trim() || undefined,
      });
      setSubmitted(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit request';
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell>
      <Card className={`w-full ${authCardClass}`}>
        <CardHeader className="px-7 pb-5 pt-8 text-center sm:px-9 sm:pt-9">
          <div className="mb-6 flex justify-center">
            <AuthWordmark />
          </div>
          {submitted ? (
            <>
              <div className="mb-2 flex justify-center">
                <CheckCircle className="h-12 w-12 text-[#98d8c5]" />
              </div>
              <CardTitle className="text-3xl font-semibold tracking-[-0.035em] text-white">Request received</CardTitle>
              <CardDescription className="text-slate-400">
                Thanks! We'll review your request and reach out to {email} to get your organization set up.
              </CardDescription>
            </>
          ) : (
            <>
              <CardTitle className="text-3xl font-semibold tracking-[-0.035em] text-white">Request access</CardTitle>
              <CardDescription className="text-slate-400">
                Tell us about your organization and we'll set up your compliance workspace
              </CardDescription>
            </>
          )}
        </CardHeader>

        {submitted ? (
          <CardFooter className="flex flex-col gap-4 px-7 pb-8 sm:px-9">
            <Button className={`w-full ${authPrimaryButtonClass}`} onClick={() => navigate('/')}>
              Back to home
            </Button>
          </CardFooter>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5 px-7 sm:px-9">
              <div className="space-y-2">
                <Label htmlFor="companyName" className={authLabelClass}>Company / Organization Name</Label>
                <Input
                  id="companyName"
                  type="text"
                  placeholder="Acme Inc"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  disabled={isLoading}
                  maxLength={255}
                  className={errors.company_name ? `${authInputClass} border-red-400` : authInputClass}
                />
                {errors.company_name && <p className={authErrorClass}>{errors.company_name}</p>}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className={authLabelClass}>First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={isLoading}
                    maxLength={100}
                    className={errors.contact_first_name ? `${authInputClass} border-red-400` : authInputClass}
                  />
                  {errors.contact_first_name && <p className={authErrorClass}>{errors.contact_first_name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className={authLabelClass}>Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={isLoading}
                    maxLength={100}
                    className={errors.contact_last_name ? `${authInputClass} border-red-400` : authInputClass}
                  />
                  {errors.contact_last_name && <p className={authErrorClass}>{errors.contact_last_name}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className={authLabelClass}>Work Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className={errors.email ? `${authInputClass} border-red-400` : authInputClass}
                />
                {errors.email && <p className={authErrorClass}>{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="companySize" className={authLabelClass}>Company Size / Type (Optional)</Label>
                <Select value={companySize} onValueChange={setCompanySize} disabled={isLoading}>
                  <SelectTrigger id="companySize" className={authInputClass}>
                    <SelectValue placeholder="Select a range" />
                  </SelectTrigger>
                  <SelectContent>
                    {companySizeOptions.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className={authLabelClass}>What are you looking to achieve? (Optional)</Label>
                <Textarea
                  id="message"
                  placeholder="e.g. SOC 2 and HIPAA coverage before our Q3 audit"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isLoading}
                  maxLength={2000}
                  rows={3}
                  className={`${authInputClass} min-h-0 resize-none`}
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 px-7 pb-8 sm:px-9">
              <Button type="submit" className={`w-full ${authPrimaryButtonClass}`} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Request Access
              </Button>

              <p className="text-center text-sm text-slate-400">
                Already have access?{' '}
                <Link to="/auth/login" className={authLinkClass}>
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        )}
      </Card>
    </AuthShell>
  );
}
