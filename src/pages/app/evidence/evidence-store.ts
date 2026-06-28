import { useCallback, useMemo, useState } from "react";

export type EvidenceStatus = "draft" | "pending_review" | "approved" | "rejected" | "expired" | "archived";

export interface EvidenceRecord {
  id: string;
  title: string;
  description: string;
  framework: string;
  controlId: string;
  packageName: string;
  evidenceType: string;
  owner: string;
  reviewer: string;
  status: EvidenceStatus;
  dueDate: string;
  expirationDate: string;
  uploadedBy: string;
  uploadedDate: string;
  lastUpdated: string;
  version: string;
  notes: string;
  fileName: string;
}

export interface EvidenceInput {
  title: string;
  description: string;
  framework: string;
  controlId: string;
  packageName: string;
  evidenceType: string;
  owner: string;
  reviewer: string;
  dueDate: string;
  expirationDate: string;
  uploadedBy: string;
  notes: string;
  fileName: string;
}

const STORAGE_KEY = "zestcomply.evidence.records.v1";

function readEvidence(): EvidenceRecord[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeEvidence(records: EvidenceRecord[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `evidence-${Date.now()}`;
}

export const evidenceStatusLabels: Record<EvidenceStatus, string> = {
  draft: "Draft",
  pending_review: "Pending Review",
  approved: "Approved",
  rejected: "Rejected",
  expired: "Expired",
  archived: "Archived",
};

export function useEvidenceStore() {
  const [records, setRecords] = useState<EvidenceRecord[]>(() => readEvidence());

  const persist = useCallback((nextRecords: EvidenceRecord[]) => {
    setRecords(nextRecords);
    writeEvidence(nextRecords);
  }, []);

  const createEvidence = useCallback((input: EvidenceInput) => {
    const now = new Date().toISOString();
    const record: EvidenceRecord = {
      ...input,
      id: createId(),
      status: "draft",
      uploadedDate: now,
      lastUpdated: now,
      version: "1.0",
    };
    persist([record, ...records]);
    return record;
  }, [persist, records]);

  const updateStatus = useCallback((id: string, status: EvidenceStatus) => {
    const now = new Date().toISOString();
    persist(records.map((record) => (
      record.id === id ? { ...record, status, lastUpdated: now } : record
    )));
  }, [persist, records]);

  const replaceVersion = useCallback((id: string, fileName: string) => {
    const now = new Date().toISOString();
    persist(records.map((record) => {
      if (record.id !== id) return record;
      const nextVersion = (Number(record.version) + 0.1).toFixed(1);
      return { ...record, fileName, version: nextVersion, uploadedDate: now, lastUpdated: now, status: "draft" };
    }));
  }, [persist, records]);

  const byId = useMemo(() => new Map(records.map((record) => [record.id, record])), [records]);

  return {
    records,
    byId,
    createEvidence,
    updateStatus,
    replaceVersion,
  };
}
