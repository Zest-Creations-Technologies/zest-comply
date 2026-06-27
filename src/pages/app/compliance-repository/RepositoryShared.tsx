import { Link } from "react-router-dom";
import { Archive, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { RepositoryDocument, RepositoryDocumentStatus } from "./repository-utils";
import { formatDate, repositoryStatusLabels } from "./repository-utils";

const statusVariant: Record<RepositoryDocumentStatus, "default" | "secondary" | "outline" | "destructive"> = {
  approved: "default",
  published: "default",
  in_review: "secondary",
  draft: "outline",
};

export function RepositoryStatusBadge({ status }: { status: RepositoryDocumentStatus }) {
  return <Badge variant={statusVariant[status]}>{repositoryStatusLabels[status]}</Badge>;
}

export function RepositoryLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-72 w-full" />
    </div>
  );
}

export function RepositoryEmptyState({ title, description }: { title: string; description: string }) {
  return (
    <Card className="bg-card">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <Archive className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
        <p className="max-w-md text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export function RepositoryFilters({
  search,
  framework,
  status,
  documentType,
  sort,
  frameworks,
  statuses,
  documentTypes,
  onSearchChange,
  onFrameworkChange,
  onStatusChange,
  onDocumentTypeChange,
  onSortChange,
}: {
  search: string;
  framework: string;
  status: string;
  documentType: string;
  sort: string;
  frameworks: string[];
  statuses: string[];
  documentTypes: string[];
  onSearchChange: (value: string) => void;
  onFrameworkChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onDocumentTypeChange: (value: string) => void;
  onSortChange: (value: string) => void;
}) {
  return (
    <Card className="bg-card">
      <CardContent className="grid gap-3 p-4 lg:grid-cols-[minmax(220px,1.3fr)_repeat(4,minmax(150px,1fr))]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by document title..."
            className="pl-10"
          />
        </div>
        <Select value={framework} onValueChange={onFrameworkChange}>
          <SelectTrigger><SelectValue placeholder="Framework" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All frameworks</SelectItem>
            {frameworks.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {statuses.map((item) => <SelectItem key={item} value={item}>{repositoryStatusLabels[item as RepositoryDocumentStatus]}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={documentType} onValueChange={onDocumentTypeChange}>
          <SelectTrigger><SelectValue placeholder="Document Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {documentTypes.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={onSortChange}>
          <SelectTrigger><SelectValue placeholder="Sort" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Sort by name</SelectItem>
            <SelectItem value="approval_date">Sort by approval date</SelectItem>
            <SelectItem value="last_updated">Sort by last updated</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}

export function useDocumentFilters(documents: RepositoryDocument[], filters: {
  search: string;
  framework: string;
  status: string;
  documentType: string;
  sort: string;
}) {
  const query = filters.search.trim().toLowerCase();
  return documents
    .filter((document) => {
      const matchesSearch = !query || document.title.toLowerCase().includes(query);
      const matchesFramework = filters.framework === "all" || document.framework === filters.framework;
      const matchesStatus = filters.status === "all" || document.status === filters.status;
      const matchesType = filters.documentType === "all" || document.documentType === filters.documentType;
      return matchesSearch && matchesFramework && matchesStatus && matchesType;
    })
    .sort((a, b) => {
      if (filters.sort === "approval_date") {
        return (b.approvalDate ?? "").localeCompare(a.approvalDate ?? "");
      }
      if (filters.sort === "last_updated") {
        return b.lastUpdated.localeCompare(a.lastUpdated);
      }
      return a.title.localeCompare(b.title);
    });
}

export function DocumentTable({ documents }: { documents: RepositoryDocument[] }) {
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle>Approved Documents</CardTitle>
        <CardDescription>{documents.length} document{documents.length === 1 ? "" : "s"} available.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document Title</TableHead>
              <TableHead>Framework</TableHead>
              <TableHead>Document Type</TableHead>
              <TableHead>Current Version</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Reviewer</TableHead>
              <TableHead>Approver</TableHead>
              <TableHead>Approval Date</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((document) => (
              <TableRow key={document.id}>
                <TableCell className="max-w-[260px] font-medium text-foreground">
                  <span className="line-clamp-2">{document.title}</span>
                </TableCell>
                <TableCell>{document.framework}</TableCell>
                <TableCell>{document.documentType}</TableCell>
                <TableCell>{document.currentVersion}</TableCell>
                <TableCell><RepositoryStatusBadge status={document.status} /></TableCell>
                <TableCell>{document.owner}</TableCell>
                <TableCell>{document.reviewer}</TableCell>
                <TableCell>{document.approver}</TableCell>
                <TableCell>{formatDate(document.approvalDate)}</TableCell>
                <TableCell>{formatDate(document.lastUpdated)}</TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/app/compliance-repository/documents/${document.id}`}>Open</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export function SimpleBarChart({ title, description, data }: { title: string; description: string; data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map((item) => item.value), 1);
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground">No data available.</p>
        ) : data.map((item) => (
          <div key={item.label} className="space-y-2">
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="truncate text-muted-foreground">{item.label}</span>
              <span className="font-medium text-foreground">{item.value}</span>
            </div>
            <div className="h-2 rounded-full bg-muted">
              <div className="h-2 rounded-full bg-primary" style={{ width: `${(item.value / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
