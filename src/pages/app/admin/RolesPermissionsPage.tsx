import { Check, FileCheck2, Minus, ShieldCheck, Users, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminPageHeader } from "./AdminShared";

type Access = "full" | "read" | "none";

const ACCESS_ICON: Record<Access, JSX.Element> = {
  full: <Check className="mx-auto h-4 w-4 text-emerald-600" />,
  read: <Minus className="mx-auto h-4 w-4 text-amber-500" />,
  none: <X className="mx-auto h-4 w-4 text-slate-500" />,
};

const capabilities: { capability: string; viewer: Access; member: Access; admin: Access }[] = [
  { capability: "View evidence, packages, and governance profiles", viewer: "full", member: "full", admin: "full" },
  { capability: "Upload evidence, edit records, add comments", viewer: "none", member: "full", admin: "full" },
  { capability: "Generate compliance documents and packages", viewer: "none", member: "full", admin: "full" },
  { capability: "Submit, review, approve, and sign validation profiles*", viewer: "none", member: "full", admin: "full" },
  { capability: "Use ZestComply AI", viewer: "read", member: "full", admin: "full" },
  { capability: "View organization audit logs", viewer: "none", member: "none", admin: "full" },
  { capability: "Invite teammates and change member roles", viewer: "none", member: "none", admin: "full" },
];

const roles = [
  {
    name: "Admin",
    tone: "border-[#d8b45d]/40 bg-[#fbf3df]",
    summary: "Full read/write access plus organization management: invites, role changes, and org-wide audit visibility.",
  },
  {
    name: "Member",
    tone: "border-slate-200 bg-white",
    summary: "Full read/write access to the organization's compliance workspace - evidence, documents, and governance.",
  },
  {
    name: "Viewer",
    tone: "border-slate-200 bg-white",
    summary: "Read-only access across the workspace. Cannot upload, edit, generate, or approve anything.",
  },
];

export default function RolesPermissionsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <AdminPageHeader
          title="Roles & Permissions"
          description="Access controls for the organization's workspace. Every member has exactly one role, set when they're invited and changeable any time by an admin."
        />
        <Button asChild variant="outline" className="shrink-0">
          <Link to="/app/admin/users">
            <Users className="mr-2 h-4 w-4" />
            Manage members
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {roles.map((role) => (
          <Card key={role.name} className={role.tone}>
            <CardContent className="space-y-2 p-5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-slate-500" />
                <p className="font-semibold text-slate-900">{role.name}</p>
              </div>
              <p className="text-sm text-slate-600">{role.summary}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Capability</TableHead>
                <TableHead className="text-center">Viewer</TableHead>
                <TableHead className="text-center">Member</TableHead>
                <TableHead className="text-center">Admin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {capabilities.map((row) => (
                <TableRow key={row.capability}>
                  <TableCell className="text-sm">{row.capability}</TableCell>
                  <TableCell>{ACCESS_ICON[row.viewer]}</TableCell>
                  <TableCell>{ACCESS_ICON[row.member]}</TableCell>
                  <TableCell>{ACCESS_ICON[row.admin]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="bg-card">
        <CardContent className="flex gap-3 p-5">
          <FileCheck2 className="h-5 w-5 shrink-0 text-slate-500" />
          <p className="text-sm text-slate-600">
            <span className="font-medium text-slate-900">*Document-level sign-off is separate from workspace role.</span>{" "}
            An admin assigns specific members as Reviewer, Approver, or Executive Signer on a per-profile basis in the
            Human Validation workspace. Only the assigned person can act in that capacity, regardless of whether they're
            an org Admin or Member.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
