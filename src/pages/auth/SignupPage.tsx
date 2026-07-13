import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2, Eye, EyeOff, Check, X } from 'lucide-react';
import { z } from 'zod';
import { AuthShell, AuthWordmark, authCardClass, authInputClass, authPrimaryButtonClass, authLinkClass, authLabelClass, authErrorClass } from './AuthShell';

const signupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  company_name: z.string().trim().min(1, 'Company name is required').max(255),
  first_name: z.string().max(100).optional(),
  last_name: z.string().max(100).optional(),
});

const passwordRequirements = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'One lowercase letter', test: (p: string) => /[a-z]/.test(p) },
  { label: 'One number', test: (p: string) => /[0-9]/.test(p) },
  { label: 'One special character', test: (p: string) => /[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/.test(p) },
];

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; company_name?: string }>({});

  const { signup } = useAuth();
  const navigate = useNavigate();

  const passwordStrength = passwordRequirements.filter((req) => req.test(password)).length;
  const strengthPercent = (passwordStrength / passwordRequirements.length) * 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = signupSchema.safeParse({ email, password, company_name: companyName, first_name: firstName || undefined, last_name: lastName || undefined });
    if (!result.success) {
      const fieldErrors: { email?: string; password?: string; company_name?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === 'email') fieldErrors.email = err.message;
        if (err.path[0] === 'password') fieldErrors.password = err.message;
        if (err.path[0] === 'company_name') fieldErrors.company_name = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await signup(email, password, companyName.trim(), firstName || undefined, lastName || undefined);
      // Redirect to email verification page with email in state
      navigate('/auth/verify-email', { 
        replace: true,
        state: { email: response.email }
      });
    } catch {
      // Error is handled by AuthContext toast
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
          <CardTitle className="text-3xl font-semibold tracking-[-0.035em] text-white">Set up your organization</CardTitle>
          <CardDescription className="text-slate-400">Start building an all-framework compliance operating system for your company</CardDescription>
        </CardHeader>

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
                aria-invalid={!!errors.company_name}
                aria-describedby={errors.company_name ? "companyName-error" : undefined}
                className={errors.company_name ? `${authInputClass} border-red-400` : authInputClass}
              />
              {errors.company_name && (
                <p id="companyName-error" className={authErrorClass}>{errors.company_name}</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName" className={authLabelClass}>First Name (Optional)</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={isLoading}
                  maxLength={100}
                  className={authInputClass}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className={authLabelClass}>Last Name (Optional)</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={isLoading}
                  maxLength={100}
                  className={authInputClass}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className={authLabelClass}>Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={errors.email ? `${authInputClass} border-red-400` : authInputClass}
              />
              {errors.email && (
                <p id="email-error" className={authErrorClass}>{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className={authLabelClass}>Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  maxLength={128}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  className={errors.password ? `${authInputClass} border-red-400 pr-10` : `${authInputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className={authErrorClass}>{errors.password}</p>
              )}

              {/* Password strength */}
              {password && (
                <div className="space-y-2 pt-2">
                  <Progress value={strengthPercent} className="h-1.5 bg-white/10" />
                  <div className="grid gap-1 sm:grid-cols-2">
                    {passwordRequirements.map((req, i) => (
                      <div key={i} className="flex items-center gap-1 text-xs">
                        {req.test(password) ? (
                          <Check className="h-3 w-3 text-[#98d8c5]" />
                        ) : (
                          <X className="h-3 w-3 text-slate-500" />
                        )}
                        <span className={req.test(password) ? 'text-slate-100' : 'text-slate-500'}>
                          {req.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 px-7 pb-8 sm:px-9">
            <Button type="submit" className={`w-full ${authPrimaryButtonClass}`} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>

            <p className="text-center text-xs text-slate-500">
              By creating an account, you agree to our{' '}
              <Link to="/terms" className={authLinkClass}>Terms of Service</Link>
              {' '}and{' '}
              <Link to="/privacy" className={authLinkClass}>Privacy Policy</Link>.
            </p>

            <p className="text-center text-sm text-slate-400">
              Already have an account?{' '}
              <Link to="/auth/login" className={authLinkClass}>
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </AuthShell>
  );
}
