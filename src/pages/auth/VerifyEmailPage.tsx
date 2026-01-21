import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Loader2, Mail, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { emailVerificationApi } from '@/lib/api';
import { Logo } from '@/components/Logo';

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

  // Get email from navigation state or query params
  const emailFromState = (location.state as { email?: string })?.email;
  const emailFromQuery = new URLSearchParams(location.search).get('email');
  const email = emailFromState || emailFromQuery || '';

  // Set initial expiry time when component mounts with valid email
  useEffect(() => {
    if (email) {
      setExpiryTime(new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000));
    }
  }, [email]);

  // Show a form to enter email if not provided
  if (!email) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        
        <Card className="w-full max-w-md relative z-10 bg-card/80 backdrop-blur-sm border-border">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Logo size="lg" textClassName="text-foreground" />
            </div>
            <CardTitle className="text-2xl text-foreground">Verify Your Email</CardTitle>
            <CardDescription>
              Please sign up first to receive a verification code.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild className="w-full">
              <Link to="/auth/signup">Go to Sign Up</Link>
            </Button>
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/auth/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
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
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        
        <Card className="w-full max-w-md relative z-10 bg-card/80 backdrop-blur-sm border-border">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Email Verified!</h2>
            <p className="text-muted-foreground mb-4">
              Your email has been successfully verified.
            </p>
            <p className="text-sm text-muted-foreground">
              Redirecting to login...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <Mail className="h-7 w-7 text-primary" />
          </div>
          
          <CardTitle className="text-2xl text-foreground">Verify Your Email</CardTitle>
          <CardDescription className="space-y-1">
            <p>We sent a verification code to:</p>
            <p className="font-medium text-foreground">{email}</p>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* OTP Input */}
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm text-muted-foreground">Enter 6-digit code:</p>
            
            <InputOTP
              maxLength={OTP_LENGTH}
              value={otp}
              onChange={setOtp}
              disabled={isVerifying}
              className={error ? 'animate-shake' : ''}
            >
              <InputOTPGroup>
                {Array.from({ length: OTP_LENGTH }).map((_, i) => (
                  <InputOTPSlot key={i} index={i} />
                ))}
              </InputOTPGroup>
            </InputOTP>

            {/* Error message */}
            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Verify button */}
          <Button
            onClick={handleVerify}
            disabled={otp.length !== OTP_LENGTH || isVerifying}
            className="w-full"
          >
            {isVerifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verify Email
          </Button>

          {/* Expiry timer */}
          {timeRemaining && timeRemaining !== 'Expired' && (
            <p className="text-center text-sm text-muted-foreground">
              Code expires in: <span className="font-mono font-medium text-foreground">{timeRemaining}</span>
            </p>
          )}

          {timeRemaining === 'Expired' && (
            <p className="text-center text-sm text-destructive">
              Code expired. Please request a new one.
            </p>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          {/* Resend link */}
          <div className="text-center text-sm">
            <span className="text-muted-foreground">Didn't receive the code? </span>
            {resendCooldown > 0 ? (
              <span className="text-muted-foreground">
                Resend in <span className="font-mono">{resendCooldown}s</span>
              </span>
            ) : (
              <button
                onClick={handleResend}
                disabled={isResending}
                className="text-primary hover:underline disabled:opacity-50"
              >
                {isResending ? 'Sending...' : 'Resend code'}
              </button>
            )}
          </div>

          {/* Back to signup */}
          <Link
            to="/auth/signup"
            className="flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to signup
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
