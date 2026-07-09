import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MeterBar } from "@/components/app/dashboard-charts";
import { MonitoringEmptyState } from "./MonitoringShared";
import { useCrossFrameworkOverlap, useSharedEvidence } from "./useCrossFrameworkOverlap";

export default function CrossFrameworkPage() {
  const { frameworks, pairs, reuseSummary, methodology, isLoading } = useCrossFrameworkOverlap();
  const [selectedPair, setSelectedPair] = useState<{ a: string; b: string; aDisplay: string; bDisplay: string } | null>(null);
  const { evidence, isLoading: evidenceLoading } = useSharedEvidence(selectedPair?.a ?? null, selectedPair?.b ?? null);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Cross-Framework Intelligence</h1>
        <p className="text-muted-foreground">
          See where evidence you've tagged for one framework also covers another, and how much of your evidence is dual-purpose.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : frameworks.length < 2 ? (
        <MonitoringEmptyState
          title="Not enough frameworks yet"
          description="Tag evidence with at least two frameworks to see cross-framework overlap."
        />
      ) : (
        <>
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Evidence reuse by framework</CardTitle>
              <CardDescription>What share of each framework's evidence is also tagged for at least one other framework.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {reuseSummary.map((item) => (
                <MeterBar
                  key={item.framework}
                  label={`${item.framework_display} (${item.multi_framework_evidence_count}/${item.total_evidence} shared)`}
                  value={item.reuse_percentage}
                  max={100}
                  tone="teal"
                />
              ))}
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Framework pairs</CardTitle>
              <CardDescription>Click a pair to see the exact shared evidence.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Framework A</TableHead>
                    <TableHead>Framework B</TableHead>
                    <TableHead>Shared evidence</TableHead>
                    <TableHead>% of A</TableHead>
                    <TableHead>% of B</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pairs.map((pair) => (
                    <TableRow
                      key={`${pair.framework_a}-${pair.framework_b}`}
                      tabIndex={0}
                      role="button"
                      aria-label={`View shared evidence between ${pair.framework_a_display} and ${pair.framework_b_display}`}
                      className="cursor-pointer"
                      onClick={() =>
                        setSelectedPair({
                          a: pair.framework_a,
                          b: pair.framework_b,
                          aDisplay: pair.framework_a_display,
                          bDisplay: pair.framework_b_display,
                        })
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelectedPair({
                            a: pair.framework_a,
                            b: pair.framework_b,
                            aDisplay: pair.framework_a_display,
                            bDisplay: pair.framework_b_display,
                          });
                        }
                      }}
                    >
                      <TableCell className="font-medium">{pair.framework_a_display}</TableCell>
                      <TableCell className="font-medium">{pair.framework_b_display}</TableCell>
                      <TableCell>
                        <Badge variant={pair.shared_evidence_count > 0 ? "default" : "outline"}>
                          {pair.shared_evidence_count}
                        </Badge>
                      </TableCell>
                      <TableCell>{pair.pct_of_a}%</TableCell>
                      <TableCell>{pair.pct_of_b}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {selectedPair && (
            <Card className="bg-card">
              <CardHeader>
                <CardTitle>
                  Shared evidence: {selectedPair.aDisplay} &amp; {selectedPair.bDisplay}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {evidenceLoading ? (
                  <div className="flex justify-center py-6">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : evidence.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No shared evidence between these frameworks.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Owner</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {evidence.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.title}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{item.status}</Badge>
                          </TableCell>
                          <TableCell>{item.owner || "Unassigned"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          )}

          <p className="text-sm italic text-muted-foreground">{methodology}</p>
        </>
      )}
    </div>
  );
}
