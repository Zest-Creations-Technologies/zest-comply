import { useState } from "react";
import { EvidenceEmptyState, EvidenceFilters, EvidenceTable, defaultEvidenceFilters, filterEvidence } from "./EvidenceShared";
import { useEvidenceStore } from "./evidence-store";

export default function EvidenceLibraryPage() {
  const { records } = useEvidenceStore();
  const [filters, setFilters] = useState(defaultEvidenceFilters());
  const activeRecords = records.filter((record) => record.status !== "archived");
  const filtered = filterEvidence(activeRecords, filters);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Evidence Library</h1>
        <p className="text-muted-foreground">Search, filter, and review active evidence records.</p>
      </div>

      {activeRecords.length === 0 ? (
        <EvidenceEmptyState title="Evidence library is empty" description="Uploaded evidence records that are not archived will appear in this library." />
      ) : (
        <>
          <EvidenceFilters filters={filters} records={activeRecords} onChange={setFilters} />
          {filtered.length === 0 ? (
            <EvidenceEmptyState title="No matching evidence" description="Adjust the filters to view more evidence records." />
          ) : (
            <EvidenceTable records={filtered} />
          )}
        </>
      )}
    </div>
  );
}
