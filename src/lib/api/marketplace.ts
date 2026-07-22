import { apiClient } from "./client";

export interface MarketplaceResolvedSubscription {
  azure_subscription_id: string;
  azure_plan_id: string;
  quantity: number;
  purchaser_email: string | null;
  subscription_name: string | null;
}

export interface MarketplaceSubscriptionResponse {
  id: string;
  organization_id: string;
  azure_subscription_id: string;
  azure_plan_id: string;
  quantity: number;
  purchaser_email: string | null;
  status: string;
}

export const marketplaceApi = {
  resolve(marketplaceToken: string): Promise<MarketplaceResolvedSubscription> {
    return apiClient.post<MarketplaceResolvedSubscription>("/integrations/marketplace/azure/resolve", {
      marketplace_token: marketplaceToken,
    });
  },

  activate(params: {
    azure_subscription_id: string;
    azure_plan_id: string;
    quantity: number;
    organization_id: string;
  }): Promise<MarketplaceSubscriptionResponse> {
    return apiClient.post<MarketplaceSubscriptionResponse>("/integrations/marketplace/azure/activate", params);
  },
};

// Mirrors PLAN_ID_TO_TIER in zct-backend/app/services/azure_marketplace.py -
// keep these two lists in sync if a plan id is ever added/renamed there.
export const MARKETPLACE_PLAN_NAMES: Record<string, string> = {
  "business-starter": "Business Starter",
  "business-growth": "Business Growth",
  "business-pro": "Business Pro",
  enterprise: "Enterprise",
  "enterprise-plus": "Enterprise+",
  government: "Government",
};

export function marketplacePlanDisplayName(azurePlanId: string): string {
  return MARKETPLACE_PLAN_NAMES[azurePlanId] ?? azurePlanId;
}
