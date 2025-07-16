import { useState } from "react";
import { Upload, FileText, Search, CheckCircle, Clock, AlertCircle, Plus, BarChart3, Users, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DocumentUpload from "@/components/DocumentUpload";
import RFPWorkspace from "@/components/RFPWorkspace";
import { useToast } from "@/hooks/use-toast";

interface RFPProject {
  id: string;
  title: string;
  client: string;
  status: "draft" | "in-progress" | "review" | "completed";
  progress: number;
  deadline: string;
  questionsTotal: number;
  questionsCompleted: number;
  lastUpdated: string;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [projects] = useState<RFPProject[]>([
    {
      id: "1",
      title: "Enterprise Software Implementation",
      client: "TechCorp Inc.",
      status: "in-progress",
      progress: 65,
      deadline: "2024-01-15",
      questionsTotal: 47,
      questionsCompleted: 31,
      lastUpdated: "2 hours ago"
    },
    {
      id: "2",
      title: "Cloud Migration Services",
      client: "Global Systems Ltd.",
      status: "review",
      progress: 90,
      deadline: "2024-01-20",
      questionsTotal: 32,
      questionsCompleted: 29,
      lastUpdated: "1 day ago"
    },
    {
      id: "3",
      title: "Digital Transformation Consulting",
      client: "Innovation Partners",
      status: "draft",
      progress: 15,
      deadline: "2024-01-25",
      questionsTotal: 58,
      questionsCompleted: 9,
      lastUpdated: "3 days ago"
    }
  ]);

  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "status-badge success";
      case "in-progress": return "status-badge info";
      case "review": return "status-badge warning";
      default: return "status-badge";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4" />;
      case "in-progress": return <Clock className="w-4 h-4" />;
      case "review": return <AlertCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const handleNewRFP = () => {
    toast({
      title: "New RFP Project",
      description: "Create a new RFP response project",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-foreground">RFP Autopilot</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button onClick={handleNewRFP} className="corporate-gradient">
                <Plus className="w-4 h-4 mr-2" />
                New RFP
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="workspace">Workspace</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="enterprise-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active RFPs</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-corporate-blue">{projects.length}</div>
                  <p className="text-xs text-muted-foreground">
                    +2 from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="enterprise-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Completion</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-corporate-blue">
                    {Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / projects.length)}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +15% from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="enterprise-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Questions Answered</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-corporate-blue">
                    {projects.reduce((acc, p) => acc + p.questionsCompleted, 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    of {projects.reduce((acc, p) => acc + p.questionsTotal, 0)} total
                  </p>
                </CardContent>
              </Card>

              <Card className="enterprise-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-corporate-blue">8</div>
                  <p className="text-xs text-muted-foreground">
                    2 coordinators, 6 experts
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent RFPs */}
            <Card className="enterprise-card">
              <CardHeader>
                <CardTitle>Active RFP Projects</CardTitle>
                <CardDescription>
                  Track the progress of your ongoing RFP responses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="question-card">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(project.status)}
                              <h3 className="font-semibold text-foreground">{project.title}</h3>
                            </div>
                            <Badge className={getStatusColor(project.status)}>
                              {project.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{project.client}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-xs text-muted-foreground">
                              {project.questionsCompleted}/{project.questionsTotal} questions
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Due: {new Date(project.deadline).toLocaleDateString()}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Updated: {project.lastUpdated}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-sm font-medium">{project.progress}%</p>
                            <Progress value={project.progress} className="w-24" />
                          </div>
                          <Button variant="outline" size="sm">
                            <Search className="w-4 h-4 mr-2" />
                            Open
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <DocumentUpload />
          </TabsContent>

          <TabsContent value="workspace">
            <RFPWorkspace />
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="enterprise-card">
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>
                  Performance metrics and insights for your RFP responses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Analytics dashboard coming soon...
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
