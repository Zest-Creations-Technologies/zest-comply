import { useState } from "react";
import { EvidenceEmptyState, EvidenceFilters, EvidenceTable, defaultEvidenceFilters, filterEvidence } from "./EvidenceShared";
import { useEvidenceStore } from "./evidence-store";

export default function EvidenceRequestsPage() {
  const { records } = useEvidenceStore();
  const [filters, setFilters] = useState(defaultEvidenceFilters());
  const requestRecords = records.filter((record) => record.status === "draft" || record.status === "rejected" || record.status === "expired");
  const filtered = filterEvidence(requestRecords, filters);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Evidence Requests</h1>
        <p className="text-muted-foreground">Track evidence that needs collection, replacement, or review submission.</p>
      </div>
      {requestRecords.length === 0 ? (
        <EvidenceEmptyState title="No evidence requests" description="Draft, rejected, or expired evidence records will appear here for follow-up." />
      ) : (
        <>
          <EvidenceFilters filters={filters} records={requestRecords} onChange={setFilters} />
          {filtered.length === 0 ? <EvidenceEmptyState title="No matching requests" description="Adjust the filters to view more evidence requests." /> : <EvidenceTable records={filtered} />}
        </>
      )}
    </div>
  );
}
