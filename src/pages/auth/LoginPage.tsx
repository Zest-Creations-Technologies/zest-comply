import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { z } from 'zod';
import { AuthShell, AuthWordmark, authCardClass, authInputClass, authPrimaryButtonClass, authLinkClass, authMutedLinkClass, authLabelClass, authErrorClass } from './AuthShell';
import { useToast } from '@/hooks/use-toast';

// Clear any stale mock tokens on login page load
const clearStaleTokens = () => {
  const accessToken = localStorage.getItem('access_token');
  if (accessToken?.startsWith('mock-')) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    console.log('Cleared stale mock tokens');
  }
};

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [showVerifiedMessage, setShowVerifiedMessage] = useState(false);

  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string }; verified?: boolean; email?: string })?.from?.pathname || '/app';

  // Check if user just verified their email
  useEffect(() => {
    const state = location.state as { verified?: boolean; email?: string } | null;
    if (state?.verified) {
      setShowVerifiedMessage(true);
      if (state.email) {
        setEmail(state.email);
      }
      // Clear the state to prevent showing message on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Clear any stale mock tokens on mount
  useEffect(() => {
    clearStaleTokens();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === 'email') fieldErrors.email = err.message;
        if (err.path[0] === 'password') fieldErrors.password = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password, rememberMe);
      navigate(from, { replace: true });
    } catch (error) {
      // Check if it's an email not verified error
      const message = error instanceof Error ? error.message : '';
      if (message.toLowerCase().includes('email not verified') || 
          message.toLowerCase().includes('verify your email')) {
        toast({
          title: 'Email verification required',
          description: 'Please verify your email to continue.',
        });
        // Redirect to verification page with fromLogin flag
        navigate('/auth/verify-email', {
          replace: true,
          state: { email, fromLogin: true }
        });
      }
      // Other errors are handled by AuthContext toast
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
          
          {/* Show verified message */}
          {showVerifiedMessage && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-[#98d8c5]/25 bg-[#98d8c5]/10 p-3 text-sm">
              <CheckCircle className="h-5 w-5 flex-shrink-0 text-[#98d8c5]" />
              <span className="text-slate-100">Email verified successfully! You can now sign in.</span>
            </div>
          )}
          
          <CardTitle className="text-3xl font-semibold tracking-[-0.035em] text-white">Welcome back</CardTitle>
          <CardDescription className="text-slate-400">Sign in to continue managing compliance operations</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
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
                className={errors.email ? `${authInputClass} border-red-400` : authInputClass}
              />
              {errors.email && (
                <p className={authErrorClass}>{errors.email}</p>
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
                  className={errors.password ? `${authInputClass} border-red-400 pr-10` : `${authInputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className={authErrorClass}>{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                />
                <Label htmlFor="remember" className="cursor-pointer text-sm font-normal text-slate-300">
                  Remember me
                </Label>
              </div>
              <Link to="/auth/forgot-password" className={`text-sm ${authLinkClass}`}>
                Forgot password?
              </Link>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 px-7 pb-8 sm:px-9">
            <Button type="submit" className={`w-full ${authPrimaryButtonClass}`} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>

            <p className="text-center text-sm text-slate-400">
              Don't have an account?{' '}
              <Link to="/auth/signup" className={authLinkClass}>
                Sign up
              </Link>
            </p>

            <p className="text-center text-xs text-slate-500">
              <Link to="/privacy" className={authLinkClass}>Privacy</Link>
              {' '}•{' '}
              <Link to="/terms" className={authLinkClass}>Terms</Link>
              {' '}•{' '}
              <Link to="/security" className={authLinkClass}>Security</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </AuthShell>
  );
}
