import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft } from 'lucide-react';
import { z } from 'zod';
import { AuthShell, AuthWordmark, authCardClass, authInputClass, authPrimaryButtonClass, authMutedLinkClass, authLabelClass, authErrorClass } from './AuthShell';
import { ssoApi } from '@/lib/api';

const emailSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
});

export default function SsoLoginPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setNotFound(false);

    const result = emailSchema.safeParse({ email });
    if (!result.success) {
      setError(result.error.errors[0]?.message ?? 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      const response = await ssoApi.discover(email);
      if (response.sso_available && response.login_url) {
        window.location.href = response.login_url;
        return;
      }
      setNotFound(true);
    } catch {
      setError('Could not check SSO availability. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell>
      <Card className={authCardClass}>
        <CardHeader className="space-y-3 px-7 pt-8 sm:px-9">
          <div className="mb-2 flex justify-center">
            <AuthWordmark />
          </div>
          <CardTitle className="text-3xl font-semibold tracking-[-0.035em] text-white">Sign in with SSO</CardTitle>
          <CardDescription className="text-slate-400">
            Enter your work email and we'll redirect you to your organization's identity provider.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5 px-7 sm:px-9">
            <div className="space-y-2">
              <Label htmlFor="email" className={authLabelClass}>Work email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                aria-invalid={!!error}
                aria-describedby={error ? "email-error" : undefined}
                className={error ? `${authInputClass} border-red-400` : authInputClass}
              />
              {error && <p id="email-error" className={authErrorClass}>{error}</p>}
              {notFound && (
                <p className={authErrorClass}>
                  SSO isn't set up for this email's organization yet. Try signing in with a password instead.
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 px-7 pb-8 sm:px-9">
            <Button type="submit" className={`w-full ${authPrimaryButtonClass}`} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Continue
            </Button>

            <Link
              to="/auth/login"
              className={`inline-flex items-center gap-1 text-sm ${authMutedLinkClass}`}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to password sign-in
            </Link>
          </CardFooter>
        </form>
      </Card>
    </AuthShell>
  );
}
