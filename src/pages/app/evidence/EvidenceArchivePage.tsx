import { useState } from "react";
import { EvidenceEmptyState, EvidenceFilters, EvidenceTable, defaultEvidenceFilters, filterEvidence } from "./EvidenceShared";
import { useEvidenceData } from "./useEvidenceData";

export default function EvidenceArchivePage() {
  const { records } = useEvidenceData();
  const [filters, setFilters] = useState(defaultEvidenceFilters());
  const archiveRecords = records.filter((record) => record.status === "archived");
  const filtered = filterEvidence(archiveRecords, filters);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Evidence Archive</h1>
        <p className="text-muted-foreground">View evidence retained for historical compliance and audit traceability.</p>
      </div>
      {archiveRecords.length === 0 ? (
        <EvidenceEmptyState title="Archive is empty" description="Archived evidence records will appear here for historical reference." />
      ) : (
        <>
          <EvidenceFilters filters={filters} records={archiveRecords} onChange={setFilters} />
          {filtered.length === 0 ? <EvidenceEmptyState title="No matching archived evidence" description="Adjust the filters to view more archived records." /> : <EvidenceTable records={filtered} />}
        </>
      )}
    </div>
  );
}
