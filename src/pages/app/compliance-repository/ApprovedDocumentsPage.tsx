import { useMemo, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DocumentTable,
  RepositoryEmptyState,
  RepositoryFilters,
  RepositoryLoading,
  useDocumentFilters,
} from "./RepositoryShared";
import { useRepositoryData } from "./useRepositoryData";

export default function ApprovedDocumentsPage() {
  const { documents, isLoading, isError, error } = useRepositoryData();
  const [search, setSearch] = useState("");
  const [framework, setFramework] = useState("all");
  const [status, setStatus] = useState("all");
  const [documentType, setDocumentType] = useState("all");
  const [sort, setSort] = useState("name");

  const frameworks = useMemo(() => [...new Set(documents.map((document) => document.framework))].sort(), [documents]);
  const statuses = useMemo(() => [...new Set(documents.map((document) => document.status))].sort(), [documents]);
  const documentTypes = useMemo(() => [...new Set(documents.map((document) => document.documentType))].sort(), [documents]);
  const filteredDocuments = useDocumentFilters(documents, { search, framework, status, documentType, sort });

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Approved Documents</h1>
        <p className="text-muted-foreground">Search, filter, and review approved compliance repository documents.</p>
      </div>

      {isLoading && <RepositoryLoading />}

      {isError && (
        <Alert variant="destructive">
          <AlertDescription>{error instanceof Error ? error.message : "Failed to load approved documents."}</AlertDescription>
        </Alert>
      )}

      {!isLoading && !isError && documents.length === 0 && (
        <RepositoryEmptyState
          title="No approved documents yet"
          description="Approve a Governance & Approvals profile linked to a package to populate this repository."
        />
      )}

      {!isLoading && !isError && documents.length > 0 && (
        <>
          <RepositoryFilters
            search={search}
            framework={framework}
            status={status}
            documentType={documentType}
            sort={sort}
            frameworks={frameworks}
            statuses={statuses}
            documentTypes={documentTypes}
            onSearchChange={setSearch}
            onFrameworkChange={setFramework}
            onStatusChange={setStatus}
            onDocumentTypeChange={setDocumentType}
            onSortChange={setSort}
          />

          {filteredDocuments.length === 0 ? (
            <RepositoryEmptyState
              title="No matching documents"
              description="Adjust the search, filters, or sort options to broaden the result set."
            />
          ) : (
            <DocumentTable documents={filteredDocuments} />
          )}
        </>
      )}
    </div>
  );
}
