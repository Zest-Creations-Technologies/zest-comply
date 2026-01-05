import { useEffect, useRef, useCallback, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { packagesApi, type CompliancePackage } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Package, 
  Download, 
  Calendar, 
  Building2, 
  FileText,
  ExternalLink,
  Loader2 
} from "lucide-react";
import { format } from "date-fns";

function PackageCard({ pkg }: { pkg: CompliancePackage }) {
  const storageProviderLabel = {
    GOOGLE_DRIVE: "Google Drive",
    DROPBOX: "Dropbox",
    ONEDRIVE: "OneDrive",
  };

  const manifest = pkg.manifest_json;

  return (
    <Card className="bg-card hover:border-primary/50 transition-colors">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-lg">
              {manifest.company.name || pkg.package_name}
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Calendar className="h-3 w-3" />
              {format(new Date(pkg.uploaded_at), "MMM d, yyyy 'at' h:mm a")}
            </CardDescription>
          </div>
        </div>
        <Badge variant="secondary">
          {storageProviderLabel[pkg.provider] || pkg.provider}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Company Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          {manifest.company.industry && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span>{manifest.company.industry}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-muted-foreground">
            <FileText className="h-4 w-4" />
            <span>{manifest.total_documents} document{manifest.total_documents !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Framework badge */}
        {manifest.framework && (
          <Badge variant="outline">{manifest.framework}</Badge>
        )}

        {/* Files list */}
        {manifest.files.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Documents</p>
            <div className="space-y-1">
              {manifest.files.slice(0, 3).map((file, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between text-sm p-2 rounded-md bg-muted/50"
                >
                  <span className="truncate flex-1 text-muted-foreground">{file.filename}</span>
                </div>
              ))}
              {manifest.files.length > 3 && (
                <p className="text-xs text-muted-foreground pl-2">
                  +{manifest.files.length - 3} more documents
                </p>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        {pkg.package_url && (
          <Button variant="outline" className="w-full" asChild>
            <a href={pkg.package_url} target="_blank" rel="noopener noreferrer">
              <Download className="h-4 w-4 mr-2" />
              Open Package
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function PackageCardSkeleton() {
  return (
    <Card className="bg-card">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-6 w-24" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
}

export default function PackagesPage() {
  const observerTarget = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["packages"],
    queryFn: async ({ pageParam }) => {
      return packagesApi.listPackages({
        limit: 10,
        last_uploaded_at: pageParam?.last_uploaded_at,
        last_id: pageParam?.last_id,
      });
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.packages.length === 0 || lastPage.packages.length < 10) {
        return undefined;
      }
      const lastPackage = lastPage.packages[lastPage.packages.length - 1];
      return {
        last_uploaded_at: lastPackage.uploaded_at,
        last_id: lastPackage.id,
      };
    },
    initialPageParam: undefined as { last_uploaded_at: string; last_id: string } | undefined,
  });

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const element = observerTarget.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [handleObserver]);

  const packages = data?.pages.flatMap((page) => page.packages) ?? [];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Compliance Packages</h1>
        <p className="text-muted-foreground">
          View and manage your generated compliance documentation packages
        </p>
      </div>

      {/* Error state */}
      {isError && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="p-6">
            <p className="text-destructive">
              Failed to load packages: {error?.message || "Unknown error"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Empty state */}
      {!isLoading && !isError && packages.length === 0 && (
        <Card className="bg-card">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No packages yet</h3>
            <p className="text-muted-foreground max-w-sm">
              Complete an AI assessment to generate your first compliance documentation package
            </p>
          </CardContent>
        </Card>
      )}

      {/* Packages grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {isLoading ? (
          <>
            <PackageCardSkeleton />
            <PackageCardSkeleton />
            <PackageCardSkeleton />
            <PackageCardSkeleton />
          </>
        ) : (
          packages.map((pkg) => <PackageCard key={pkg.id} pkg={pkg} />)
        )}
      </div>

      {/* Infinite scroll trigger */}
      <div ref={observerTarget} className="flex justify-center py-4">
        {isFetchingNextPage && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading more...</span>
          </div>
        )}
      </div>
    </div>
  );
}
