import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Users } from "lucide-react";
import { adminSettingsApi } from "@/lib/api";
import type { UserInviteRequest, OrganizationMember } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { AdminPageHeader } from "./AdminShared";

function roleLabel(role: OrganizationMember["role"]): string {
  if (role === "admin") return "Admin";
  if (role === "viewer") return "Viewer";
  return "Member";
}

function roleBadgeVariant(role: OrganizationMember["role"]): "default" | "secondary" | "outline" {
  if (role === "admin") return "default";
  if (role === "viewer") return "outline";
  return "secondary";
}

export default function UsersAdminPage() {
  const { user } = useAuth();
  const isOrgAdmin = user?.org_role === "admin";
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState<"member" | "admin" | "viewer">("member");

  const membersQuery = useQuery({
    queryKey: ["admin", "organization-members"],
    queryFn: adminSettingsApi.listOrganizationMembers,
  });

  const inviteMutation = useMutation({
    mutationFn: (payload: UserInviteRequest) => adminSettingsApi.inviteUser(payload),
    onSuccess: (data) => {
      toast({ title: "Invite sent", description: data.message });
      setDialogOpen(false);
      setEmail("");
      setFirstName("");
      setLastName("");
      setRole("member");
      queryClient.invalidateQueries({ queryKey: ["admin", "organization-members"] });
    },
    onError: (error) => {
      toast({
        title: "Could not send invite",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    },
  });

  const roleChangeMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: "admin" | "member" | "viewer" }) =>
      adminSettingsApi.updateMemberRole(userId, role),
    onSuccess: () => {
      toast({ title: "Role updated" });
      queryClient.invalidateQueries({ queryKey: ["admin", "organization-members"] });
    },
    onError: (error) => {
      toast({
        title: "Could not update role",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <AdminPageHeader
          title="Users"
          description="Manage team access for compliance, governance, evidence, reporting, and administration workspaces."
        />
        {isOrgAdmin && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="shrink-0">
                <Plus className="mr-2 h-4 w-4" />
                Invite User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  inviteMutation.mutate({
                    email,
                    first_name: firstName || undefined,
                    last_name: lastName || undefined,
                    role,
                  });
                }}
              >
                <DialogHeader>
                  <DialogTitle>Invite a teammate</DialogTitle>
                  <DialogDescription>
                    They'll get an email link to join your organization's workspace.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="invite-email">Work email</Label>
                    <Input
                      id="invite-email"
                      type="email"
                      required
                      placeholder="teammate@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={inviteMutation.isPending}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="invite-first-name">First name</Label>
                      <Input
                        id="invite-first-name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        disabled={inviteMutation.isPending}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="invite-last-name">Last name</Label>
                      <Input
                        id="invite-last-name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        disabled={inviteMutation.isPending}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="invite-role">Role</Label>
                    <Select value={role} onValueChange={(v) => setRole(v as "member" | "admin" | "viewer")} disabled={inviteMutation.isPending}>
                      <SelectTrigger id="invite-role">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="viewer">Viewer - read-only access</SelectItem>
                        <SelectItem value="member">Member - full read/write access to org data</SelectItem>
                        <SelectItem value="admin">Admin - also manages org, billing, and members</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={inviteMutation.isPending}>
                    {inviteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Send Invite
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {membersQuery.isLoading && (
        <Card className="bg-card">
          <CardContent className="space-y-3 py-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      )}

      {membersQuery.isError && (
        <Alert variant="destructive">
          <AlertDescription>
            {membersQuery.error instanceof Error ? membersQuery.error.message : "Failed to load team members."}
          </AlertDescription>
        </Alert>
      )}

      {!membersQuery.isLoading && !membersQuery.isError && (
        <Card className="bg-card">
          {membersQuery.data && membersQuery.data.members.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {membersQuery.data.members.map((member) => (
                  <TableRow key={member.user_id}>
                    <TableCell className="font-medium">{member.full_name}</TableCell>
                    <TableCell className="text-muted-foreground">{member.email}</TableCell>
                    <TableCell>
                      {isOrgAdmin ? (
                        <Select
                          value={member.role}
                          onValueChange={(v) =>
                            roleChangeMutation.mutate({
                              userId: member.user_id,
                              role: v as "admin" | "member" | "viewer",
                            })
                          }
                          disabled={roleChangeMutation.isPending}
                        >
                          <SelectTrigger className="h-8 w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="viewer">Viewer</SelectItem>
                            <SelectItem value="member">Member</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge variant={roleBadgeVariant(member.role)}>{roleLabel(member.role)}</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(member.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
              <Users className="h-8 w-8 text-muted-foreground" />
              <p className="font-medium">No team members yet.</p>
              <p className="text-sm text-muted-foreground">
                {isOrgAdmin ? "Invite a teammate to get started." : "Ask an org admin to invite teammates."}
              </p>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
}
