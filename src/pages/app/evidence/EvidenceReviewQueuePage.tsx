import { useState } from "react";
import { EvidenceEmptyState, EvidenceFilters, EvidenceTable, defaultEvidenceFilters, filterEvidence } from "./EvidenceShared";
import { useEvidenceStore } from "./evidence-store";

export default function EvidenceReviewQueuePage() {
  const { records } = useEvidenceStore();
  const [filters, setFilters] = useState(defaultEvidenceFilters());
  const reviewRecords = records.filter((record) => record.status === "pending_review");
  const filtered = filterEvidence(reviewRecords, filters);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Evidence Review Queue</h1>
        <p className="text-muted-foreground">Review evidence submitted for control, package, audit, and governance readiness.</p>
      </div>
      {reviewRecords.length === 0 ? (
        <EvidenceEmptyState title="Review queue is clear" description="Evidence submitted for review will appear here." />
      ) : (
        <>
          <EvidenceFilters filters={filters} records={reviewRecords} onChange={setFilters} />
          {filtered.length === 0 ? <EvidenceEmptyState title="No matching review items" description="Adjust the filters to view more submitted evidence." /> : <EvidenceTable records={filtered} />}
        </>
      )}
    </div>
  );
}
