import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { z } from 'zod';
import { AuthShell, AuthWordmark, authCardClass, authInputClass, authPrimaryButtonClass, authLinkClass, authLabelClass, authErrorClass } from './AuthShell';
import { authApi } from '@/lib/api/auth';
import { useAuth } from '@/contexts/AuthContext';

const acceptInviteSchema = z.object({
  first_name: z.string().trim().min(1, 'First name is required').max(100),
  last_name: z.string().trim().min(1, 'Last name is required').max(100),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type FormErrors = Partial<Record<keyof z.infer<typeof acceptInviteSchema>, string>>;

export default function AcceptInvitePage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  if (!token) {
    return (
      <AuthShell>
        <Card className={`w-full ${authCardClass}`}>
          <CardHeader className="px-7 pb-5 pt-8 text-center sm:px-9 sm:pt-9">
            <div className="mb-6 flex justify-center">
              <AuthWordmark />
            </div>
            <CardTitle className="text-3xl font-semibold tracking-[-0.035em] text-white">Invalid invite link</CardTitle>
            <CardDescription className="text-slate-400">
              This link is missing its invite token. Ask your admin to resend the invite.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-7 pb-8 sm:px-9">
            <Button className={`w-full ${authPrimaryButtonClass}`} onClick={() => navigate('/auth/login')}>
              Back to sign in
            </Button>
          </CardContent>
        </Card>
      </AuthShell>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setApiError(null);

    const result = acceptInviteSchema.safeParse({
      first_name: firstName,
      last_name: lastName,
      password,
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
      await authApi.acceptInvite({
        token,
        password: result.data.password,
        first_name: result.data.first_name,
        last_name: result.data.last_name,
      });
      await refreshUser();
      navigate('/app');
    } catch (error) {
      setApiError(
        error instanceof Error ? error.message : 'This invite link is invalid or has expired.'
      );
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
          <CardTitle className="text-3xl font-semibold tracking-[-0.035em] text-white">Join your team</CardTitle>
          <CardDescription className="text-slate-400">
            Set your name and password to finish creating your account
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5 px-7 sm:px-9">
            {apiError && (
              <Alert variant="destructive" className="border-red-400/40 bg-red-950/40 text-red-200">
                <AlertDescription>{apiError}</AlertDescription>
              </Alert>
            )}

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
                  className={errors.first_name ? `${authInputClass} border-red-400` : authInputClass}
                />
                {errors.first_name && <p className={authErrorClass}>{errors.first_name}</p>}
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
                  className={errors.last_name ? `${authInputClass} border-red-400` : authInputClass}
                />
                {errors.last_name && <p className={authErrorClass}>{errors.last_name}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className={authLabelClass}>Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className={errors.password ? `${authInputClass} border-red-400` : authInputClass}
              />
              {errors.password && <p className={authErrorClass}>{errors.password}</p>}
            </div>

            <Button type="submit" className={`w-full ${authPrimaryButtonClass}`} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create account
            </Button>

            <p className="text-center text-sm text-slate-400">
              Already have access?{' '}
              <Link to="/auth/login" className={authLinkClass}>
                Sign in
              </Link>
            </p>
          </CardContent>
        </form>
      </Card>
    </AuthShell>
  );
}
