import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Eye, EyeOff, ArrowLeft, CheckCircle, RefreshCw } from 'lucide-react';
import { z } from 'zod';
import { AuthShell, AuthWordmark, authCardClass, authInputClass, authPrimaryButtonClass, authLinkClass, authMutedLinkClass, authLabelClass, authErrorClass, authIconBubbleClass } from './AuthShell';
import { passwordResetApi } from '@/lib/api/password-reset';
import { useToast } from '@/hooks/use-toast';

const RESEND_COOLDOWN_SECONDS = 60;

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
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
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
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send reset email';
      toast({ title: 'Error', description: message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = useCallback(async () => {
    if (resendCooldown > 0 || isResending) return;

    setIsResending(true);
    try {
      await passwordResetApi.initiate(email);
      toast({
        title: 'Code resent',
        description: 'A new reset code has been sent to your email.',
      });
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to resend code';
      toast({ title: 'Error', description: message, variant: 'destructive' });
    } finally {
      setIsResending(false);
    }
  }, [email, resendCooldown, isResending, toast]);

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

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
    <AuthShell>
      <Card className={`w-full ${authCardClass}`}>
        <CardHeader className="px-7 pb-5 pt-8 text-center sm:px-9 sm:pt-9">
          <div className="mb-6 flex justify-center">
            <AuthWordmark />
          </div>
          {step === 'email' && (
            <>
              <CardTitle className="text-3xl font-semibold tracking-[-0.035em] text-white">Forgot password?</CardTitle>
              <CardDescription className="text-slate-400">Enter your email and we'll send you a reset code</CardDescription>
            </>
          )}
          {step === 'verify' && (
            <>
              <CardTitle className="text-3xl font-semibold tracking-[-0.035em] text-white">Reset your password</CardTitle>
              <CardDescription className="text-slate-400">Enter the code we sent to {email}</CardDescription>
            </>
          )}
          {step === 'success' && (
            <>
              <div className="flex justify-center mb-2">
                <CheckCircle className="h-12 w-12 text-[#98d8c5]" />
              </div>
              <CardTitle className="text-3xl font-semibold tracking-[-0.035em] text-white">Password reset!</CardTitle>
              <CardDescription className="text-slate-400">You can now sign in with your new password</CardDescription>
            </>
          )}
        </CardHeader>

        {step === 'email' && (
          <form onSubmit={handleEmailSubmit}>
            <CardContent className="space-y-5 px-7 sm:px-9">
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
            </CardContent>

            <CardFooter className="flex flex-col gap-4 px-7 pb-8 sm:px-9">
              <Button type="submit" className={`w-full ${authPrimaryButtonClass}`} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Reset Code
              </Button>

              <Link
                to="/auth/login"
                className={`inline-flex items-center gap-1 text-sm ${authMutedLinkClass}`}
              >
                <ArrowLeft className="h-4 w-4" />
                Back to login
              </Link>
            </CardFooter>
          </form>
        )}

        {step === 'verify' && (
          <form onSubmit={handleVerifySubmit}>
            <CardContent className="space-y-5 px-7 sm:px-9">
              <div className="space-y-2">
                <Label htmlFor="otp" className={authLabelClass}>Reset Code</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter the code from your email"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={isLoading}
                  aria-invalid={!!errors.otp}
                  aria-describedby={errors.otp ? "otp-error" : undefined}
                  className={errors.otp ? `${authInputClass} border-red-400` : authInputClass}
                />
                {errors.otp && (
                  <p id="otp-error" className={authErrorClass}>{errors.otp}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className={authLabelClass}>New Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className={authLabelClass}>Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                    aria-invalid={!!errors.confirmPassword}
                    aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                    className={errors.confirmPassword ? `${authInputClass} border-red-400 pr-10` : `${authInputClass} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p id="confirmPassword-error" className={authErrorClass}>{errors.confirmPassword}</p>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 px-7 pb-8 sm:px-9">
              <Button type="submit" className={`w-full ${authPrimaryButtonClass}`} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Reset Password
              </Button>

              <div className="flex w-full items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className={`inline-flex items-center gap-1 text-sm ${authMutedLinkClass}`}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Use different email
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0 || isResending}
                  className={`inline-flex items-center gap-1 text-sm disabled:cursor-not-allowed disabled:opacity-50 ${authMutedLinkClass}`}
                >
                  {isResending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  {resendCooldown > 0 ? `Resend (${resendCooldown}s)` : 'Resend code'}
                </button>
              </div>
            </CardFooter>
          </form>
        )}

        {step === 'success' && (
          <CardFooter className="flex flex-col gap-4 px-7 pb-8 sm:px-9">
            <Button className={`w-full ${authPrimaryButtonClass}`} onClick={() => navigate('/auth/login')}>
              Go to Login
            </Button>
          </CardFooter>
        )}
      </Card>
    </AuthShell>
  );
}
