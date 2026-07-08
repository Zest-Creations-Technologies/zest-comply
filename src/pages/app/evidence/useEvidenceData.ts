import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { evidenceApi } from "@/lib/api";
import type { EvidenceCreateInput, EvidenceItem, EvidenceListResponse, EvidenceStatus } from "@/lib/api";

const QUERY_KEY = ["evidence"];

function upsert(current: EvidenceListResponse | undefined, record: EvidenceItem): EvidenceListResponse {
  const records = current?.records ?? [];
  const exists = records.some((item) => item.id === record.id);
  return {
    records: exists ? records.map((item) => (item.id === record.id ? record : item)) : [record, ...records],
    count: exists ? records.length : records.length + 1,
  };
}

export function useEvidenceData() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => evidenceApi.list(),
  });

  const createMutation = useMutation({
    mutationFn: (input: EvidenceCreateInput) => evidenceApi.create(input),
    onSuccess: (record) => {
      queryClient.setQueryData<EvidenceListResponse>(QUERY_KEY, (current) => upsert(current, record));
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: EvidenceStatus }) => evidenceApi.updateStatus(id, status),
    onSuccess: (record) => {
      queryClient.setQueryData<EvidenceListResponse>(QUERY_KEY, (current) => upsert(current, record));
    },
  });

  const versionMutation = useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) => evidenceApi.replaceVersion(id, file),
    onSuccess: (record) => {
      queryClient.setQueryData<EvidenceListResponse>(QUERY_KEY, (current) => upsert(current, record));
    },
  });

  return {
    records: query.data?.records ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    createEvidence: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateStatus: (id: string, status: EvidenceStatus) => statusMutation.mutateAsync({ id, status }),
    replaceVersion: (id: string, file: File) => versionMutation.mutateAsync({ id, file }),
  };
}

export function useEvidenceItem(evidenceId: string | undefined) {
  return useQuery({
    queryKey: ["evidence", evidenceId],
    queryFn: () => evidenceApi.get(evidenceId as string),
    enabled: Boolean(evidenceId),
  });
}
