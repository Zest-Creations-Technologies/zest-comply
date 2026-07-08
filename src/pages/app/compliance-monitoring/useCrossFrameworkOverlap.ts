import { useQuery } from "@tanstack/react-query";
import { crossFrameworkApi } from "@/lib/api";

export function useCrossFrameworkOverlap() {
  const query = useQuery({
    queryKey: ["cross-framework-overlap"],
    queryFn: () => crossFrameworkApi.getOverlap(),
  });

  return {
    frameworks: query.data?.frameworks ?? [],
    pairs: query.data?.pairs ?? [],
    reuseSummary: query.data?.reuse_summary ?? [],
    methodology: query.data?.methodology ?? "",
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

export function useSharedEvidence(frameworkA: string | null, frameworkB: string | null) {
  const query = useQuery({
    queryKey: ["shared-evidence", frameworkA, frameworkB],
    queryFn: () => crossFrameworkApi.getSharedEvidence(frameworkA!, frameworkB!),
    enabled: Boolean(frameworkA && frameworkB),
  });

  return {
    evidence: query.data?.evidence ?? [],
    isLoading: query.isLoading,
  };
}
