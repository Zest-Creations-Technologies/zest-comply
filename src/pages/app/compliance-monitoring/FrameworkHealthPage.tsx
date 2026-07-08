import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GitCompare, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MeterBar, ScoreTrendChart } from "@/components/app/dashboard-charts";
import { MonitoringEmptyState } from "./MonitoringShared";
import { useReadinessScoreHistory, useReadinessScores, useRecomputeReadinessScores } from "./useReadinessScore";

export default function FrameworkHealthPage() {
  const { scores, methodology, isLoading } = useReadinessScores();
  const recompute = useRecomputeReadinessScores();
  const [selectedFramework, setSelectedFramework] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedFramework && scores.length > 0) {
      setSelectedFramework(scores[0].framework);
    }
  }, [scores, selectedFramework]);

  const { history } = useReadinessScoreHistory(selectedFramework);
  const trendData = [...history]
    .reverse()
    .map((snapshot) => ({
      label: new Date(snapshot.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      score: snapshot.overall_score,
    }));

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Framework Health</h1>
          <p className="text-muted-foreground">
            Compliance readiness scores computed from your evidence coverage, freshness, and validation workflow status.
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" asChild>
            <Link to="/app/compliance-monitoring/cross-framework">
              <GitCompare className="mr-2 h-4 w-4" />
              Cross-Framework
            </Link>
          </Button>
          <Button
            variant="outline"
            onClick={() => recompute.mutate()}
            disabled={recompute.isPending}
          >
            {recompute.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Recompute
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : scores.length === 0 ? (
        <MonitoringEmptyState
          title="No readiness score yet"
          description="Tag evidence with a framework to start tracking a readiness score for it."
        />
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {scores.map((score) => (
              <Card
                key={score.framework}
                className={`bg-card cursor-pointer transition-colors ${score.framework === selectedFramework ? "ring-2 ring-primary" : ""}`}
                onClick={() => setSelectedFramework(score.framework)}
              >
                <CardHeader>
                  <CardTitle className="flex items-baseline justify-between">
                    <span>{score.framework_display}</span>
                    <span className="text-2xl">{score.overall_score}</span>
                  </CardTitle>
                  <CardDescription>Overall readiness score</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <MeterBar label="Evidence coverage" value={score.coverage_score ?? 0} max={100} tone="teal" />
                  <MeterBar label="Evidence freshness" value={score.freshness_score ?? 0} max={100} tone="gold" />
                  {score.validation_score !== null && (
                    <MeterBar label="Validation progress" value={score.validation_score} max={100} tone="teal" />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedFramework && (
            <Card className="bg-card">
              <CardHeader>
                <CardTitle>
                  {scores.find((s) => s.framework === selectedFramework)?.framework_display ?? selectedFramework} trend
                </CardTitle>
                <CardDescription>Score history over time.</CardDescription>
              </CardHeader>
              <CardContent>
                <ScoreTrendChart data={trendData} />
              </CardContent>
            </Card>
          )}

          <p className="text-sm italic text-muted-foreground">{methodology}</p>
        </>
      )}
    </div>
  );
}
