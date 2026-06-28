import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Archive, ArrowRight, Bell, CheckSquare, FileCheck2, Gauge, MessageSquare, ShieldCheck } from "lucide-react";

export default function ActionCenterPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const workspaceActions = [
    {
      title: "Assessments",
      description: "Start or continue AI-guided compliance work.",
      icon: MessageSquare,
      action: () => navigate("/app/assistant"),
    },
    {
      title: "Approvals",
      description: "Open governance review and approval workflows.",
      icon: ShieldCheck,
      action: () => navigate("/app/human-validation/review-queue"),
    },
    {
      title: "Evidence",
      description: "Manage evidence records and review queues.",
      icon: FileCheck2,
      action: () => navigate("/app/evidence"),
    },
    {
      title: "Monitoring",
      description: "Review compliance alerts, tasks, and deadlines.",
      icon: Bell,
      action: () => navigate("/app/compliance-monitoring"),
    },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Operations Center
        </h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.full_name || user?.first_name || "there"}. Start from the work that needs attention now.
        </p>
      </div>

      <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
        <CardContent className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
              <Gauge className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Run the Compliance Workflow</h2>
              <p className="text-muted-foreground">
                Assess, approve, evidence, monitor, and report from one operating model.
              </p>
            </div>
          </div>
          <Button size="lg" onClick={() => navigate("/app/assistant")}>
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Workspaces</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {workspaceActions.map((action) => (
            <Card
              key={action.title}
              className="cursor-pointer hover:border-primary/50 transition-colors bg-card"
              onClick={action.action}
            >
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                  <action.icon className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{action.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardDescription>Repository</CardDescription>
            <CardTitle className="flex items-center gap-2 text-xl"><Archive className="h-5 w-5 text-muted-foreground" />Approved documents</CardTitle>
          </CardHeader>
          <CardContent><Button variant="outline" size="sm" onClick={() => navigate("/app/compliance-repository")}>Open Repository</Button></CardContent>
        </Card>
        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardDescription>Tasks</CardDescription>
            <CardTitle className="flex items-center gap-2 text-xl"><CheckSquare className="h-5 w-5 text-muted-foreground" />Compliance work</CardTitle>
          </CardHeader>
          <CardContent><Button variant="outline" size="sm" onClick={() => navigate("/app/compliance-monitoring/tasks")}>Open Tasks</Button></CardContent>
        </Card>
        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardDescription>Security</CardDescription>
            <CardTitle className="flex items-center gap-2 text-xl"><ShieldCheck className="h-5 w-5 text-muted-foreground" />Connect ZestRecon</CardTitle>
          </CardHeader>
          <CardContent><Button variant="outline" size="sm" onClick={() => navigate("/app/security")}>Open Security</Button></CardContent>
        </Card>
      </div>
    </div>
  );
}
