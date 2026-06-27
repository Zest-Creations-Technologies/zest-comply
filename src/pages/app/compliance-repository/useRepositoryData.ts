import { useMemo } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import { humanValidationApi, packagesApi, type ValidationAuditEvent } from "@/lib/api";
import { buildRepositoryDocuments } from "./repository-utils";

export function useRepositoryData() {
  const packagesQuery = useQuery({
    queryKey: ["compliance-repository", "packages"],
    queryFn: () => packagesApi.listPackages({ limit: 100 }),
  });

  const queueQuery = useQuery({
    queryKey: ["compliance-repository", "governance-queue"],
    queryFn: humanValidationApi.getQueue,
  });

  const approvedProfiles = useMemo(
    () => (queueQuery.data?.profiles ?? []).filter((profile) => profile.status === "approved" || profile.status === "signed_off"),
    [queueQuery.data?.profiles],
  );

  const auditQueries = useQueries({
    queries: approvedProfiles.map((profile) => ({
      queryKey: ["compliance-repository", "audit", profile.id],
      queryFn: () => humanValidationApi.getAuditTrail(profile.id),
      enabled: Boolean(profile.id),
    })),
  });

  const auditByProfile = useMemo(() => {
    return approvedProfiles.reduce<Record<string, ValidationAuditEvent[]>>((acc, profile, index) => {
      acc[profile.id] = auditQueries[index]?.data ?? [];
      return acc;
    }, {});
  }, [approvedProfiles, auditQueries]);

  const documents = useMemo(
    () =>
      buildRepositoryDocuments({
        packages: packagesQuery.data?.packages ?? [],
        profiles: queueQuery.data?.profiles ?? [],
        auditByProfile,
      }),
    [auditByProfile, packagesQuery.data?.packages, queueQuery.data?.profiles],
  );

  return {
    documents,
    packages: packagesQuery.data?.packages ?? [],
    profiles: queueQuery.data?.profiles ?? [],
    isLoading: packagesQuery.isLoading || queueQuery.isLoading || auditQueries.some((query) => query.isLoading),
    isError: packagesQuery.isError || queueQuery.isError || auditQueries.some((query) => query.isError),
    error: packagesQuery.error || queueQuery.error || auditQueries.find((query) => query.error)?.error,
  };
}
