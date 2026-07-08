import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { readinessScoreApi } from "@/lib/api";

export function useReadinessScores() {
  const query = useQuery({
    queryKey: ["readiness-scores"],
    queryFn: () => readinessScoreApi.getCurrentScores(),
  });

  return {
    scores: query.data?.scores ?? [],
    methodology: query.data?.methodology ?? "",
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

export function useReadinessScoreHistory(framework: string | null) {
  const query = useQuery({
    queryKey: ["readiness-score-history", framework],
    queryFn: () => readinessScoreApi.getHistory(framework!),
    enabled: Boolean(framework),
  });

  return {
    history: query.data?.history ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

export function useRecomputeReadinessScores() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => readinessScoreApi.recompute(),
    onSuccess: (data) => {
      queryClient.setQueryData(["readiness-scores"], data);
      queryClient.invalidateQueries({ queryKey: ["readiness-score-history"] });
    },
  });
}
