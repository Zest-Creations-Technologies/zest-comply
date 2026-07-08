import { useQuery } from "@tanstack/react-query";
import { aiGovernanceApi } from "@/lib/api";

export function useAIGovernanceDocuments() {
  const query = useQuery({
    queryKey: ["ai-governance-documents"],
    queryFn: () => aiGovernanceApi.getDocuments(),
  });

  return {
    documents: query.data?.documents ?? [],
    methodology: query.data?.methodology ?? "",
    isLoading: query.isLoading,
  };
}

export function useAIGovernanceSummary() {
  const query = useQuery({
    queryKey: ["ai-governance-summary"],
    queryFn: () => aiGovernanceApi.getSummary(),
  });

  return {
    summary: query.data,
    isLoading: query.isLoading,
  };
}
