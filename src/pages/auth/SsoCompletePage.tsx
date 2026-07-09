import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { AuthShell, AuthWordmark, authCardClass, authPrimaryButtonClass } from './AuthShell';
import { ssoApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export default function SsoCompletePage() {
  const [searchParams] = useSearchParams();
  const handoffToken = searchParams.get('handoff') ?? '';

  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const attempted = useRef(false);

  useEffect(() => {
    if (attempted.current) return;
    attempted.current = true;

    if (!handoffToken) {
      setError('This sign-in link is missing its token. Please try signing in again.');
      return;
    }

    (async () => {
      try {
        await ssoApi.exchange(handoffToken);
        await refreshUser();
        navigate('/app');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'This sign-in link is invalid or has expired.');
      }
    })();
  }, [handoffToken, navigate, refreshUser]);

  return (
    <AuthShell>
      <Card className={`w-full ${authCardClass}`}>
        <CardHeader className="px-7 pb-5 pt-8 text-center sm:px-9 sm:pt-9">
          <div className="mb-6 flex justify-center">
            <AuthWordmark />
          </div>
          {error ? (
            <>
              <CardTitle className="text-3xl font-semibold tracking-[-0.035em] text-white">Sign-in failed</CardTitle>
              <CardDescription className="text-slate-400">{error}</CardDescription>
            </>
          ) : (
            <>
              <CardTitle className="text-3xl font-semibold tracking-[-0.035em] text-white">Signing you in...</CardTitle>
              <CardDescription className="text-slate-400">Completing your identity provider sign-in.</CardDescription>
            </>
          )}
        </CardHeader>
        <CardContent className="px-7 pb-8 sm:px-9">
          {error ? (
            <Button className={`w-full ${authPrimaryButtonClass}`} onClick={() => navigate('/auth/sso')}>
              Try again
            </Button>
          ) : (
            <div className="flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-white/70" />
            </div>
          )}
        </CardContent>
      </Card>
    </AuthShell>
  );
}
