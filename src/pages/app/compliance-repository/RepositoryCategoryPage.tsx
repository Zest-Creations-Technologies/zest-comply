import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DocumentTable,
  RepositoryEmptyState,
  RepositoryFilters,
  RepositoryLoading,
  useDocumentFilters,
} from "./RepositoryShared";
import { documentMatchesCategory, isRepositoryCategory, repositoryCategories } from "./repository-utils";
import { useRepositoryData } from "./useRepositoryData";

export default function RepositoryCategoryPage() {
  const { category } = useParams<{ category: string }>();
  const { documents, isLoading, isError, error } = useRepositoryData();
  const [search, setSearch] = useState("");
  const [framework, setFramework] = useState("all");
  const [status, setStatus] = useState("all");
  const [documentType, setDocumentType] = useState("all");
  const [sort, setSort] = useState("name");
  const hasCategory = isRepositoryCategory(category);
  const categoryMeta = hasCategory ? repositoryCategories[category] : null;
  const categoryDocuments = useMemo(
    () => (hasCategory ? documents.filter((document) => documentMatchesCategory(document, category)) : []),
    [category, documents, hasCategory],
  );
  const frameworks = useMemo(() => [...new Set(categoryDocuments.map((document) => document.framework))].sort(), [categoryDocuments]);
  const statuses = useMemo(() => [...new Set(categoryDocuments.map((document) => document.status))].sort(), [categoryDocuments]);
  const documentTypes = useMemo(() => [...new Set(categoryDocuments.map((document) => document.documentType))].sort(), [categoryDocuments]);
  const filteredDocuments = useDocumentFilters(categoryDocuments, { search, framework, status, documentType, sort });

  if (!hasCategory || !categoryMeta) {
    return (
      <div className="mx-auto max-w-6xl p-6">
        <RepositoryEmptyState title="Repository section not found" description="Choose an available Compliance Repository section from the sidebar." />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">{categoryMeta.title}</h1>
        <p className="text-muted-foreground">{categoryMeta.description}</p>
      </div>

      {isLoading && <RepositoryLoading />}

      {isError && (
        <Alert variant="destructive">
          <AlertDescription>{error instanceof Error ? error.message : `Failed to load ${categoryMeta.title.toLowerCase()}.`}</AlertDescription>
        </Alert>
      )}

      {!isLoading && !isError && categoryDocuments.length === 0 && (
        <RepositoryEmptyState
          title={`No ${categoryMeta.title.toLowerCase()} yet`}
          description="Approved package artifacts matching this repository section will appear here."
        />
      )}

      {!isLoading && !isError && categoryDocuments.length > 0 && (
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
            <RepositoryEmptyState title="No matching documents" description="Adjust the filters to view more repository artifacts." />
          ) : (
            <DocumentTable documents={filteredDocuments} />
          )}
        </>
      )}
    </div>
  );
}
