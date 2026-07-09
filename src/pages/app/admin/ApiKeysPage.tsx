import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Copy, KeyRound, Loader2, Plus, Trash2 } from "lucide-react";
import { apiKeysApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { AdminEmptyState, AdminPageHeader } from "./AdminShared";

export default function ApiKeysPage() {
  const { user } = useAuth();
  const isOrgAdmin = user?.org_role === "admin";
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [newKey, setNewKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const keysQuery = useQuery({
    queryKey: ["admin", "api-keys"],
    queryFn: apiKeysApi.list,
    enabled: isOrgAdmin,
  });

  const createMutation = useMutation({
    mutationFn: (payload: string) => apiKeysApi.create(payload),
    onSuccess: (data) => {
      setNewKey(data.api_key);
      queryClient.invalidateQueries({ queryKey: ["admin", "api-keys"] });
    },
    onError: (error) => {
      toast({
        title: "Could not create key",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    },
  });

  const revokeMutation = useMutation({
    mutationFn: (keyId: string) => apiKeysApi.revoke(keyId),
    onSuccess: () => {
      toast({ title: "Key revoked" });
      queryClient.invalidateQueries({ queryKey: ["admin", "api-keys"] });
    },
    onError: (error) => {
      toast({
        title: "Could not revoke key",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    },
  });

  const closeDialog = () => {
    setDialogOpen(false);
    setName("");
    setNewKey(null);
    setCopied(false);
  };

  const copyKey = async () => {
    if (!newKey) return;
    await navigator.clipboard.writeText(newKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOrgAdmin) {
    return (
      <div className="mx-auto max-w-6xl space-y-6 p-6">
        <AdminPageHeader
          title="API Keys"
          description="Manage secure automation and integration keys for your organization."
        />
        <AdminEmptyState
          icon={KeyRound}
          title="Admin access required"
          description="Ask an org admin to create or manage API keys for your organization."
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <AdminPageHeader
          title="API Keys"
          description="Create keys for programmatic access to the ZestComply API. A key acts with the same permissions as the admin who created it."
        />
        <Dialog open={dialogOpen} onOpenChange={(open) => (open ? setDialogOpen(true) : closeDialog())}>
          <DialogTrigger asChild>
            <Button className="shrink-0">
              <Plus className="mr-2 h-4 w-4" />
              New Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            {newKey ? (
              <>
                <DialogHeader>
                  <DialogTitle>Key created</DialogTitle>
                  <DialogDescription>
                    Copy this key now - it won't be shown again.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <div className="flex items-center gap-2 rounded-md border border-border bg-muted/50 p-3">
                    <code className="flex-1 break-all text-sm">{newKey}</code>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={copyKey}
                      aria-label={copied ? "Copied" : "Copy key to clipboard"}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" onClick={closeDialog}>Done</Button>
                </DialogFooter>
              </>
            ) : (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  createMutation.mutate(name);
                }}
              >
                <DialogHeader>
                  <DialogTitle>Create an API key</DialogTitle>
                  <DialogDescription>
                    Give it a label so you can identify it later, e.g. "CI pipeline" or "Zapier".
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-2 py-4">
                  <Label htmlFor="key-name">Name</Label>
                  <Input
                    id="key-name"
                    required
                    placeholder="CI pipeline"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={createMutation.isPending}
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={createMutation.isPending || !name.trim()}>
                    {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Key
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {keysQuery.isLoading && (
        <Card className="bg-card">
          <CardContent className="space-y-3 py-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      )}

      {keysQuery.isError && (
        <Alert variant="destructive">
          <AlertDescription>
            {keysQuery.error instanceof Error ? keysQuery.error.message : "Failed to load API keys."}
          </AlertDescription>
        </Alert>
      )}

      {!keysQuery.isLoading && !keysQuery.isError && (
        <Card className="bg-card">
          {keysQuery.data && keysQuery.data.keys.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Last used</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {keysQuery.data.keys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell className="font-medium">{key.name}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{key.key_prefix}...</TableCell>
                    <TableCell className="text-muted-foreground">
                      {key.last_used_at ? new Date(key.last_used_at).toLocaleString() : "Never"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(key.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        disabled={revokeMutation.isPending}
                        onClick={() => revokeMutation.mutate(key.id)}
                        aria-label={`Revoke key "${key.name}"`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
              <KeyRound className="h-8 w-8 text-muted-foreground" />
              <p className="font-medium">No API keys yet.</p>
              <p className="text-sm text-muted-foreground">
                Create a key to authenticate automation and integrations against the ZestComply API.
              </p>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
}
