import { Link } from "react-router-dom";
import { Archive, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { EvidenceItem, EvidenceStatus } from "@/lib/api";

export const evidenceTypes = [
  "Access Review",
  "Audit Report",
  "Configuration Export",
  "Evidence Matrix",
  "Policy Attestation",
  "Risk Assessment",
  "Screenshot",
  "System Report",
  "Vendor Document",
];

export const evidenceStatusLabels: Record<EvidenceStatus, string> = {
  draft: "Draft",
  pending_review: "Pending Review",
  approved: "Approved",
  rejected: "Rejected",
  expired: "Expired",
  archived: "Archived",
};

const statusVariant: Record<EvidenceStatus, "default" | "secondary" | "outline" | "destructive"> = {
  draft: "outline",
  pending_review: "secondary",
  approved: "default",
  rejected: "destructive",
  expired: "destructive",
  archived: "outline",
};

export function EvidenceStatusBadge({ status }: { status: EvidenceStatus }) {
  return <Badge variant={statusVariant[status]}>{evidenceStatusLabels[status]}</Badge>;
}

export function formatDate(value?: string | null) {
  if (!value) return "Not set";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function EvidenceEmptyState({ title, description }: { title: string; description: string }) {
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

export interface EvidenceFiltersState {
  search: string;
  framework: string;
  control: string;
  status: string;
  owner: string;
  evidenceType: string;
  sort: string;
}

export function defaultEvidenceFilters(): EvidenceFiltersState {
  return {
    search: "",
    framework: "all",
    control: "all",
    status: "all",
    owner: "all",
    evidenceType: "all",
    sort: "uploaded_date",
  };
}

export function EvidenceFilters({
  filters,
  records,
  onChange,
}: {
  filters: EvidenceFiltersState;
  records: EvidenceItem[];
  onChange: (next: EvidenceFiltersState) => void;
}) {
  const frameworks = [...new Set(records.flatMap((record) => record.frameworks))].sort();
  const controls = [...new Set(records.flatMap((record) => record.control_ids))].sort();
  const owners = [...new Set(records.map((record) => record.owner).filter(Boolean))].sort() as string[];
  const types = [...new Set(records.map((record) => record.evidence_type).filter(Boolean))].sort() as string[];

  const update = (key: keyof EvidenceFiltersState, value: string) => onChange({ ...filters, [key]: value });

  return (
    <Card className="bg-card">
      <CardContent className="grid gap-3 p-4 xl:grid-cols-[minmax(220px,1.4fr)_repeat(6,minmax(140px,1fr))]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={filters.search} onChange={(event) => update("search", event.target.value)} className="pl-10" aria-label="Search by evidence title" />
        </div>
        <Select value={filters.framework} onValueChange={(value) => update("framework", value)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All frameworks</SelectItem>
            {frameworks.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filters.control} onValueChange={(value) => update("control", value)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All controls</SelectItem>
            {controls.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filters.status} onValueChange={(value) => update("status", value)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {Object.entries(evidenceStatusLabels).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filters.owner} onValueChange={(value) => update("owner", value)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All owners</SelectItem>
            {owners.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filters.evidenceType} onValueChange={(value) => update("evidenceType", value)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All evidence types</SelectItem>
            {types.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filters.sort} onValueChange={(value) => update("sort", value)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="uploaded_date">Sort by uploaded date</SelectItem>
            <SelectItem value="due_date">Sort by due date</SelectItem>
            <SelectItem value="expiration_date">Sort by expiration date</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}

export function filterEvidence(records: EvidenceItem[], filters: EvidenceFiltersState) {
  const query = filters.search.trim().toLowerCase();
  return records
    .filter((record) => {
      const matchesSearch = !query || record.title.toLowerCase().includes(query);
      const matchesFramework = filters.framework === "all" || record.frameworks.includes(filters.framework);
      const matchesControl = filters.control === "all" || record.control_ids.includes(filters.control);
      const matchesStatus = filters.status === "all" || record.status === filters.status;
      const matchesOwner = filters.owner === "all" || record.owner === filters.owner;
      const matchesType = filters.evidenceType === "all" || record.evidence_type === filters.evidenceType;
      return matchesSearch && matchesFramework && matchesControl && matchesStatus && matchesOwner && matchesType;
    })
    .sort((a, b) => {
      if (filters.sort === "due_date") return (a.due_date || "9999").localeCompare(b.due_date || "9999");
      if (filters.sort === "expiration_date") return (a.expiration_date || "9999").localeCompare(b.expiration_date || "9999");
      return b.created_at.localeCompare(a.created_at);
    });
}

export function EvidenceTable({ records }: { records: EvidenceItem[] }) {
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle>Evidence Records</CardTitle>
        <CardDescription>{records.length} record{records.length === 1 ? "" : "s"} available.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Evidence Title</TableHead>
              <TableHead>Framework</TableHead>
              <TableHead>Control ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Reviewer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Expiration</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead className="text-right">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="max-w-[260px] font-medium text-foreground"><span className="line-clamp-2">{record.title}</span></TableCell>
                <TableCell>{record.frameworks.join(", ") || "—"}</TableCell>
                <TableCell>{record.control_ids.join(", ") || "—"}</TableCell>
                <TableCell>{record.evidence_type}</TableCell>
                <TableCell>{record.owner}</TableCell>
                <TableCell>{record.reviewer}</TableCell>
                <TableCell><EvidenceStatusBadge status={record.status} /></TableCell>
                <TableCell>{formatDate(record.due_date)}</TableCell>
                <TableCell>{formatDate(record.expiration_date)}</TableCell>
                <TableCell>{formatDate(record.created_at)}</TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/app/evidence/${record.id}`}>Open</Link>
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

export function evidenceByStatus(records: EvidenceItem[], status: EvidenceStatus) {
  return records.filter((record) => record.status === status);
}
