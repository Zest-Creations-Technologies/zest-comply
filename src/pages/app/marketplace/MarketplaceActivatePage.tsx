import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, Loader2, ShieldAlert, Store } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  marketplaceApi,
  marketplacePlanDisplayName,
  type MarketplaceResolvedSubscription,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AuthShell,
  AuthWordmark,
  authCardClass,
  authPrimaryButtonClass,
  authIconBubbleClass,
} from "@/pages/auth/AuthShell";

type Step = "resolving" | "confirm" | "activating" | "success" | "error" | "not-admin";

// Landing page Microsoft redirects an admin to after "Get It Now" on the
// Azure Marketplace listing (?token=<purchase token>). See
// zct-backend/app/api/v1/marketplace_azure.py and
// docs/azure/00-marketplace-fulfillment-scoping.md for the full fulfillment
// flow this page is step one of. Rendered inside <ProtectedRoute> (needs a
// logged-in session) but outside AppLayout, using the same dark/gold shell
// as login/signup/invite - matches the marketing site, not the app interior.
export default function MarketplaceActivatePage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { user } = useAuth();

  const [step, setStep] = useState<Step>("resolving");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resolved, setResolved] = useState<MarketplaceResolvedSubscription | null>(null);

  useEffect(() => {
    if (user && user.org_role !== "admin") {
      setStep("not-admin");
      return;
    }

    if (!token) {
      setErrorMessage("This link is missing its activation token. Please return to Azure Marketplace and try again.");
      setStep("error");
      return;
    }

    marketplaceApi
      .resolve(token)
      .then((data) => {
        setResolved(data);
        setStep("confirm");
      })
      .catch((err) => {
        setErrorMessage(err instanceof Error ? err.message : "We couldn't verify this purchase link.");
        setStep("error");
      });
  }, [token, user]);

  const handleConfirm = async () => {
    if (!resolved || !user?.organization_id) return;
    setStep("activating");
    try {
      await marketplaceApi.activate({
        azure_subscription_id: resolved.azure_subscription_id,
        azure_plan_id: resolved.azure_plan_id,
        quantity: resolved.quantity,
        organization_id: user.organization_id,
      });
      setStep("success");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Activation failed. Please try again.");
      setStep("error");
    }
  };

  return (
    <AuthShell>
      <Card className={`w-full ${authCardClass}`}>
        {step === "resolving" && (
          <CardContent className="px-7 py-14 text-center sm:px-9">
            <Loader2 className="mx-auto h-6 w-6 animate-spin text-[#d8b45d]" />
            <p className="mt-4 text-slate-400">Verifying your Azure Marketplace purchase&hellip;</p>
          </CardContent>
        )}

        {step === "confirm" && resolved && (
          <>
            <CardHeader className="px-7 pb-5 pt-8 text-center sm:px-9 sm:pt-9">
              <div className="mb-6 flex justify-center">
                <AuthWordmark />
              </div>
              <div className={`${authIconBubbleClass} mb-4`}>
                <Store className="h-7 w-7 text-[#f0d990]" />
              </div>
              <CardTitle className="text-3xl font-semibold tracking-[-0.035em] text-white">
                Activate your subscription
              </CardTitle>
              <CardDescription className="text-slate-400">
                Confirm the plan below to finish setting up your organization, purchased through Azure Marketplace.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 px-7 sm:px-9">
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.045] px-4 py-3">
                <span className="text-sm text-slate-400">Plan</span>
                <span className="font-semibold text-white">{marketplacePlanDisplayName(resolved.azure_plan_id)}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.045] px-4 py-3">
                <span className="text-sm text-slate-400">Seats</span>
                <span className="font-semibold text-white">{resolved.quantity}</span>
              </div>
            </CardContent>
            <CardFooter className="px-7 pb-8 pt-6 sm:px-9">
              <Button onClick={handleConfirm} className={`w-full ${authPrimaryButtonClass}`}>
                Confirm &amp; activate
              </Button>
            </CardFooter>
          </>
        )}

        {step === "activating" && (
          <CardContent className="px-7 py-14 text-center sm:px-9">
            <Loader2 className="mx-auto h-6 w-6 animate-spin text-[#d8b45d]" />
            <p className="mt-4 text-slate-400">Activating your subscription&hellip;</p>
          </CardContent>
        )}

        {step === "success" && (
          <CardContent className="px-7 pb-10 pt-8 text-center sm:px-9">
            <div className={authIconBubbleClass}>
              <CheckCircle className="h-8 w-8 text-[#98d8c5]" />
            </div>
            <h2 className="mb-2 mt-4 text-3xl font-semibold tracking-[-0.035em] text-white">Subscription activated</h2>
            <p className="mb-6 text-slate-400">Your organization is all set. You can head to your dashboard now.</p>
            <Button asChild className={authPrimaryButtonClass}>
              <Link to="/app">Go to dashboard</Link>
            </Button>
          </CardContent>
        )}

        {step === "not-admin" && (
          <CardContent className="px-7 pb-10 pt-8 text-center sm:px-9">
            <div className={authIconBubbleClass}>
              <ShieldAlert className="h-8 w-8 text-[#f0b990]" />
            </div>
            <h2 className="mb-2 mt-4 text-3xl font-semibold tracking-[-0.035em] text-white">Admin access required</h2>
            <p className="mb-6 text-slate-400">
              Only an organization admin can activate a Marketplace subscription. Ask your admin to complete this
              step.
            </p>
            <Button asChild variant="outline" className="border-white/18 bg-white/[0.04] text-white hover:bg-white/[0.09]">
              <Link to="/app">Go to dashboard</Link>
            </Button>
          </CardContent>
        )}

        {step === "error" && (
          <CardContent className="px-7 pb-10 pt-8 text-center sm:px-9">
            <div className={authIconBubbleClass}>
              <ShieldAlert className="h-8 w-8 text-red-300" />
            </div>
            <h2 className="mb-2 mt-4 text-3xl font-semibold tracking-[-0.035em] text-white">Something went wrong</h2>
            <p className="mb-6 text-slate-400">{errorMessage}</p>
            <Button asChild variant="outline" className="border-white/18 bg-white/[0.04] text-white hover:bg-white/[0.09]">
              <Link to="/app">Go to dashboard</Link>
            </Button>
          </CardContent>
        )}
      </Card>
    </AuthShell>
  );
}
