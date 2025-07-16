import { useState } from "react";
import { Search, BookOpen, Edit, CheckCircle, Clock, AlertCircle, Copy, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: string;
  text: string;
  section: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "draft" | "review" | "approved";
  answer?: string;
  sources?: Array<{
    document: string;
    relevance: number;
    excerpt: string;
  }>;
}

interface RFPProject {
  id: string;
  title: string;
  client: string;
  questions: Question[];
}

const RFPWorkspace = () => {
  const [selectedProject] = useState<RFPProject>({
    id: "1",
    title: "Enterprise Software Implementation",
    client: "TechCorp Inc.",
    questions: [
      {
        id: "1",
        text: "Describe your company's experience with enterprise software implementations in the healthcare sector.",
        section: "Company Experience",
        priority: "high",
        status: "draft",
        answer: "Our company has over 15 years of experience implementing enterprise software solutions across various industries, with particular expertise in healthcare environments. We have successfully completed more than 50 healthcare-specific implementations, including electronic health records (EHR) systems, patient management platforms, and clinical decision support tools.",
        sources: [
          {
            document: "Previous RFP Response - TechCorp.pdf",
            relevance: 95,
            excerpt: "15 years of experience implementing enterprise software solutions across various industries, with particular expertise in healthcare environments..."
          },
          {
            document: "Cloud Services RFP - GlobalSys.docx",
            relevance: 78,
            excerpt: "Our healthcare implementations include EHR systems, patient management platforms, and clinical decision support tools..."
          }
        ]
      },
      {
        id: "2",
        text: "What is your approach to data migration and ensuring data integrity during the transition?",
        section: "Technical Approach",
        priority: "high",
        status: "pending",
        sources: [
          {
            document: "Digital Transformation Proposal.pdf",
            relevance: 92,
            excerpt: "Our data migration methodology follows a six-phase approach: assessment, planning, extraction, transformation, loading, and validation..."
          }
        ]
      },
      {
        id: "3",
        text: "How do you handle change management and user training during implementation?",
        section: "Project Management",
        priority: "medium",
        status: "pending",
        sources: [
          {
            document: "Previous RFP Response - TechCorp.pdf",
            relevance: 88,
            excerpt: "Change management is critical to successful implementations. Our approach includes stakeholder analysis, communication planning, and phased training programs..."
          }
        ]
      }
    ]
  });

  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(selectedProject.questions[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "status-badge success";
      case "review": return "status-badge warning";
      case "draft": return "status-badge info";
      default: return "status-badge";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle className="w-4 h-4" />;
      case "review": return <AlertCircle className="w-4 h-4" />;
      case "draft": return <Edit className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleGenerateAnswer = async () => {
    if (!selectedQuestion) return;

    setIsGenerating(true);
    toast({
      title: "Generating answer...",
      description: "AI is analyzing your sources and generating a response",
    });

    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "Answer generated",
        description: "Review and edit the generated response",
      });
    }, 3000);
  };

  const handleCopyAnswer = () => {
    if (selectedQuestion?.answer) {
      navigator.clipboard.writeText(selectedQuestion.answer);
      toast({
        title: "Answer copied",
        description: "The answer has been copied to your clipboard",
      });
    }
  };

  const filteredQuestions = selectedProject.questions.filter(q =>
    q.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.section.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <Card className="enterprise-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{selectedProject.title}</CardTitle>
              <CardDescription>Client: {selectedProject.client}</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <BookOpen className="w-4 h-4 mr-2" />
                Preview
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Questions Panel */}
        <Card className="comparison-panel">
          <CardHeader>
            <CardTitle className="text-lg">Questions</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
            {filteredQuestions.map((question) => (
              <div
                key={question.id}
                className={`question-card cursor-pointer transition-all ${
                  selectedQuestion?.id === question.id
                    ? "ring-2 ring-primary border-primary"
                    : ""
                }`}
                onClick={() => setSelectedQuestion(question)}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium text-sm leading-tight">
                      {question.text}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {question.section}
                    </Badge>
                    <Badge className={`text-xs ${getPriorityColor(question.priority)}`}>
                      {question.priority}
                    </Badge>
                    <Badge className={getStatusColor(question.status)}>
                      {getStatusIcon(question.status)}
                      <span className="ml-1 capitalize">{question.status}</span>
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Answer Panel */}
        <Card className="comparison-panel lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Answer</CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateAnswer}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  )}
                  {isGenerating ? "Generating..." : "Generate"}
                </Button>
                <Button variant="outline" size="sm" onClick={handleCopyAnswer}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
            </div>
            {selectedQuestion && (
              <CardDescription>
                {selectedQuestion.section} • Priority: {selectedQuestion.priority}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedQuestion ? (
              <>
                <div className="question-card">
                  <h3 className="font-medium mb-2">Question:</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedQuestion.text}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Generated Answer:</label>
                  <Textarea
                    value={selectedQuestion.answer || ""}
                    placeholder="Click 'Generate' to create an AI-powered response based on your historical answers..."
                    className="min-h-[200px] font-mono text-sm"
                    readOnly={isGenerating}
                  />
                </div>

                <Separator />

                {/* Sources */}
                <div className="space-y-3">
                  <h3 className="font-medium text-sm">Sources:</h3>
                  {selectedQuestion.sources?.map((source, index) => (
                    <div key={index} className="source-reference">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{source.document}</span>
                        <Badge variant="outline" className="text-xs">
                          {source.relevance}% match
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        "{source.excerpt}"
                      </p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Select a question to view and edit its answer
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RFPWorkspace;