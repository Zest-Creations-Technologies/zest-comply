import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react';
import { z } from 'zod';
import { Logo } from '@/components/Logo';
import { passwordResetApi } from '@/lib/api/password-reset';
import { useToast } from '@/hooks/use-toast';

const emailSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
});

const resetSchema = z.object({
  otp: z.string().trim().min(4, 'OTP must be at least 4 characters').max(10, 'OTP must be at most 10 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type Step = 'email' | 'verify' | 'success';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { toast } = useToast();
  const navigate = useNavigate();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = emailSchema.safeParse({ email });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      await passwordResetApi.initiate(email);
      toast({
        title: 'Check your email',
        description: 'If an account exists, we sent you a password reset code.',
      });
      setStep('verify');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send reset email';
      toast({ title: 'Error', description: message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = resetSchema.safeParse({ otp, password, confirmPassword });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      await passwordResetApi.verify(email, otp, password);
      setStep('success');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to reset password';
      toast({ title: 'Error', description: message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <Card className="w-full max-w-md relative z-10 bg-card/80 backdrop-blur-sm border-border">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Logo size="lg" textClassName="text-foreground" />
          </div>
          {step === 'email' && (
            <>
              <CardTitle className="text-2xl text-foreground">Forgot password?</CardTitle>
              <CardDescription>Enter your email and we'll send you a reset code</CardDescription>
            </>
          )}
          {step === 'verify' && (
            <>
              <CardTitle className="text-2xl text-foreground">Reset your password</CardTitle>
              <CardDescription>Enter the code we sent to {email}</CardDescription>
            </>
          )}
          {step === 'success' && (
            <>
              <div className="flex justify-center mb-2">
                <CheckCircle className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-2xl text-foreground">Password reset!</CardTitle>
              <CardDescription>You can now sign in with your new password</CardDescription>
            </>
          )}
        </CardHeader>

        {step === 'email' && (
          <form onSubmit={handleEmailSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Reset Code
              </Button>

              <Link
                to="/auth/login"
                className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to login
              </Link>
            </CardFooter>
          </form>
        )}

        {step === 'verify' && (
          <form onSubmit={handleVerifySubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Reset Code</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter the code from your email"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={isLoading}
                  className={errors.otp ? 'border-destructive' : ''}
                />
                {errors.otp && (
                  <p className="text-sm text-destructive">{errors.otp}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                    className={errors.confirmPassword ? 'border-destructive pr-10' : 'pr-10'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Reset Password
              </Button>

              <button
                type="button"
                onClick={() => setStep('email')}
                className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
              >
                <ArrowLeft className="h-4 w-4" />
                Use different email
              </button>
            </CardFooter>
          </form>
        )}

        {step === 'success' && (
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" onClick={() => navigate('/auth/login')}>
              Go to Login
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
