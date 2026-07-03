import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Loader2, Mail, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { emailVerificationApi } from '@/lib/api';
import { AuthShell, AuthWordmark, authCardClass, authPrimaryButtonClass, authLinkClass, authMutedLinkClass, authIconBubbleClass, authErrorClass } from './AuthShell';

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 60;
const OTP_EXPIRY_MINUTES = 30;

export default function VerifyEmailPage() {
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [expiryTime, setExpiryTime] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Get email and source from navigation state or query params
  const state = location.state as { email?: string; fromLogin?: boolean } | null;
  const emailFromState = state?.email;
  const fromLogin = state?.fromLogin ?? false;
  const emailFromQuery = new URLSearchParams(location.search).get('email');
  const email = emailFromState || emailFromQuery || '';

  // Set initial expiry time and cooldown when component mounts with valid email
  useEffect(() => {
    if (email) {
      setExpiryTime(new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000));
      // Start with cooldown to prevent immediate resend spam
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
    }
  }, [email]);

  // Show a form to enter email if not provided
  if (!email) {
    return (
      <AuthShell>
        <Card className={`w-full ${authCardClass}`}>
          <CardHeader className="px-7 pb-5 pt-8 text-center sm:px-9 sm:pt-9">
            <div className="mb-6 flex justify-center">
              <AuthWordmark />
            </div>
            <CardTitle className="text-3xl font-semibold tracking-[-0.035em] text-white">Verify Your Email</CardTitle>
            <CardDescription>
              Please sign up first to receive a verification code.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-7 text-center sm:px-9">
            <Button asChild className="w-full">
              <Link to="/auth/signup">Go to Sign Up</Link>
            </Button>
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-sm text-slate-500">
              Already have an account?{' '}
              <Link to="/auth/login" className={authLinkClass}>
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </AuthShell>
    );
  }

  // Update time remaining countdown
  useEffect(() => {
    if (!expiryTime) return;

    const updateRemaining = () => {
      const now = Date.now();
      const remaining = expiryTime.getTime() - now;

      if (remaining <= 0) {
        setTimeRemaining('Expired');
        return;
      }

      const minutes = Math.floor(remaining / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);
      setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    };

    updateRemaining();
    const interval = setInterval(updateRemaining, 1000);
    return () => clearInterval(interval);
  }, [expiryTime]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleVerify = useCallback(async () => {
    if (otp.length !== OTP_LENGTH) return;

    setIsVerifying(true);
    setError(null);

    try {
      await emailVerificationApi.verifyEmail({ email, otp });
      setIsVerified(true);
      toast({
        title: 'Email verified!',
        description: 'Redirecting you to login...',
      });

      // Redirect to login after short delay
      setTimeout(() => {
        navigate('/auth/login', { 
          replace: true,
          state: { verified: true, email }
        });
      }, 2000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Verification failed';
      
      if (message.toLowerCase().includes('locked')) {
        setError(message);
        toast({
          title: 'Account locked',
          description: 'Too many failed attempts. Please try again later.',
          variant: 'destructive',
        });
      } else {
        setError('Invalid or expired code. Please try again.');
        setOtp(''); // Clear OTP for retry
      }
    } finally {
      setIsVerifying(false);
    }
  }, [otp, email, navigate, toast]);

  // Auto-submit when OTP is complete
  useEffect(() => {
    if (otp.length === OTP_LENGTH && !isVerifying && !isVerified) {
      handleVerify();
    }
  }, [otp, isVerifying, isVerified, handleVerify]);

  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return;

    setIsResending(true);
    setError(null);

    try {
      await emailVerificationApi.resendOtp({ email });
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
      setExpiryTime(new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000));
      setOtp('');
      toast({
        title: 'Code sent!',
        description: 'A new verification code has been sent to your email.',
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to resend code';
      
      if (message.toLowerCase().includes('rate limit') || message.toLowerCase().includes('429')) {
        setResendCooldown(RESEND_COOLDOWN_SECONDS);
        toast({
          title: 'Please wait',
          description: 'You can request a new code in 60 seconds.',
          variant: 'destructive',
        });
      } else if (message.toLowerCase().includes('locked')) {
        setError(message);
      } else {
        toast({
          title: 'Failed to resend',
          description: message,
          variant: 'destructive',
        });
      }
    } finally {
      setIsResending(false);
    }
  };

  // Success state
  if (isVerified) {
    return (
      <AuthShell>
        <Card className={`w-full ${authCardClass}`}>
          <CardContent className="pt-8 pb-8 text-center">
            <div className={authIconBubbleClass}>
              <CheckCircle className="h-8 w-8 text-[#98d8c5]" />
            </div>
            <h2 className="mb-2 text-3xl font-semibold tracking-[-0.035em] text-white">Email Verified!</h2>
            <p className="mb-4 text-slate-400">
              Your email has been successfully verified.
            </p>
            <p className="text-sm text-slate-500">
              Redirecting to login...
            </p>
          </CardContent>
        </Card>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <Card className={`w-full ${authCardClass}`}>
        <CardHeader className="px-7 pb-5 pt-8 text-center sm:px-9 sm:pt-9">
          <div className="mb-6 flex justify-center">
            <AuthWordmark />
          </div>
          
          <div className={`${authIconBubbleClass} mb-4`}>
            <Mail className="h-7 w-7 text-[#f0d990]" />
          </div>
          
          <CardTitle className="text-3xl font-semibold tracking-[-0.035em] text-white">Verify Your Email</CardTitle>
          <CardDescription className="space-y-1 text-slate-400">
            {fromLogin ? (
              <>
                <p>Your email hasn't been verified yet.</p>
                <p className="font-medium text-slate-100">{email}</p>
                <p className="mt-2 text-xs">Check your inbox or click "Resend code" below.</p>
              </>
            ) : (
              <>
                <p>We sent a verification code to:</p>
                <p className="font-medium text-slate-100">{email}</p>
              </>
            )}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 px-7 sm:px-9">
          {/* OTP Input */}
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm text-slate-500">Enter 6-digit code:</p>
            
            <InputOTP
              maxLength={OTP_LENGTH}
              value={otp}
              onChange={setOtp}
              disabled={isVerifying}
              className={error ? 'animate-shake' : ''}
            >
              <InputOTPGroup className="gap-2">
                {Array.from({ length: OTP_LENGTH }).map((_, i) => (
                  <InputOTPSlot key={i} index={i} />
                ))}
              </InputOTPGroup>
            </InputOTP>

            {/* Error message */}
            {error && (
              <div className={`flex items-center gap-2 ${authErrorClass}`}>
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Verify button */}
          <Button
            onClick={handleVerify}
            disabled={otp.length !== OTP_LENGTH || isVerifying}
            className={`w-full ${authPrimaryButtonClass}`}
          >
            {isVerifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verify Email
          </Button>

          {/* Expiry timer */}
          {timeRemaining && timeRemaining !== 'Expired' && (
            <p className="text-center text-sm text-muted-foreground">
              Code expires in: <span className="font-mono font-medium text-slate-100">{timeRemaining}</span>
            </p>
          )}

          {timeRemaining === 'Expired' && (
            <p className="text-center text-sm text-red-300">
              Code expired. Please request a new one.
            </p>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-4 px-7 pb-8 sm:px-9">
          {/* Resend link */}
          <div className="text-center text-sm">
            <span className="text-slate-400">Didn't receive the code? </span>
            {resendCooldown > 0 ? (
              <span className="text-slate-400">
                Resend in <span className="font-mono">{resendCooldown}s</span>
              </span>
            ) : (
              <button
                onClick={handleResend}
                disabled={isResending}
                className={`${authLinkClass} disabled:opacity-50`}
              >
                {isResending ? 'Sending...' : 'Resend code'}
              </button>
            )}
          </div>

          {/* Back to login/signup */}
          <Link
            to={fromLogin ? "/auth/login" : "/auth/signup"}
            className={`flex items-center justify-center gap-1 text-sm ${authMutedLinkClass}`}
          >
            <ArrowLeft className="h-4 w-4" />
            {fromLogin ? "Back to login" : "Back to signup"}
          </Link>
        </CardFooter>
      </Card>
    </AuthShell>
  );
}
