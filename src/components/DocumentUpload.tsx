import { useState, useRef } from "react";
import { Upload, FileText, Trash2, Eye, AlertCircle, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  status: "uploading" | "processing" | "completed" | "error";
  progress: number;
  questionsExtracted?: number;
  uploadedAt: string;
}

const DocumentUpload = () => {
  const [documents, setDocuments] = useState<UploadedDocument[]>([
    {
      id: "1",
      name: "Previous RFP Response - TechCorp.pdf",
      type: "pdf",
      size: 2457600,
      status: "completed",
      progress: 100,
      questionsExtracted: 47,
      uploadedAt: "2024-01-10T10:30:00Z"
    },
    {
      id: "2",
      name: "Cloud Services RFP - GlobalSys.docx",
      type: "docx",
      size: 1843200,
      status: "completed",
      progress: 100,
      questionsExtracted: 32,
      uploadedAt: "2024-01-09T14:15:00Z"
    },
    {
      id: "3",
      name: "Digital Transformation Proposal.pdf",
      type: "pdf",
      size: 3276800,
      status: "processing",
      progress: 65,
      uploadedAt: "2024-01-11T09:45:00Z"
    }
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach((file) => {
      const newDocument: UploadedDocument = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.name.split('.').pop() || 'unknown',
        size: file.size,
        status: "uploading",
        progress: 0,
        uploadedAt: new Date().toISOString()
      };

      setDocuments(prev => [...prev, newDocument]);

      // Simulate upload progress
      const uploadInterval = setInterval(() => {
        setDocuments(prev => prev.map(doc => {
          if (doc.id === newDocument.id) {
            if (doc.progress < 100) {
              return { ...doc, progress: doc.progress + 10 };
            } else {
              return { 
                ...doc, 
                status: "processing" as const,
                progress: 0 
              };
            }
          }
          return doc;
        }));
      }, 200);

      // Simulate processing
      setTimeout(() => {
        clearInterval(uploadInterval);
        const processingInterval = setInterval(() => {
          setDocuments(prev => prev.map(doc => {
            if (doc.id === newDocument.id) {
              if (doc.progress < 100) {
                return { ...doc, progress: doc.progress + 15 };
              } else {
                return { 
                  ...doc, 
                  status: "completed" as const,
                  questionsExtracted: Math.floor(Math.random() * 50) + 20
                };
              }
            }
            return doc;
          }));
        }, 300);

        setTimeout(() => {
          clearInterval(processingInterval);
          toast({
            title: "Document processed successfully",
            description: `Extracted questions and answers from ${file.name}`,
          });
        }, 2000);
      }, 2000);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleRemoveDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    toast({
      title: "Document removed",
      description: "The document has been removed from your library",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "status-badge success";
      case "processing": return "status-badge info";
      case "uploading": return "status-badge info";
      case "error": return "status-badge error";
      default: return "status-badge";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4" />;
      case "processing": return <Upload className="w-4 h-4 animate-spin" />;
      case "uploading": return <Upload className="w-4 h-4" />;
      case "error": return <AlertCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card className="enterprise-card">
        <CardHeader>
          <CardTitle>Document Library</CardTitle>
          <CardDescription>
            Upload your historical RFP documents to build your knowledge base
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Drop your documents here</h3>
            <p className="text-muted-foreground mb-4">
              Or click to browse your files
            </p>
            <Button 
              onClick={() => fileInputRef.current?.click()}
              className="corporate-gradient"
            >
              Select Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
            <p className="text-xs text-muted-foreground mt-4">
              Supports PDF, DOC, DOCX, and TXT files up to 10MB
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card className="enterprise-card">
        <CardHeader>
          <CardTitle>Uploaded Documents</CardTitle>
          <CardDescription>
            {documents.length} documents in your knowledge base
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {documents.map((doc) => (
              <div key={doc.id} className="document-preview">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <FileText className="w-8 h-8 text-corporate-blue" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-foreground">{doc.name}</h3>
                        <Badge className={getStatusColor(doc.status)}>
                          {getStatusIcon(doc.status)}
                          <span className="ml-1 capitalize">{doc.status}</span>
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-muted-foreground">
                          {formatFileSize(doc.size)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(doc.uploadedAt)}
                        </span>
                        {doc.questionsExtracted && (
                          <span className="text-sm text-muted-foreground">
                            {doc.questionsExtracted} questions extracted
                          </span>
                        )}
                      </div>
                      {(doc.status === "uploading" || doc.status === "processing") && (
                        <div className="mt-2">
                          <div className="flex items-center space-x-2">
                            <Progress value={doc.progress} className="flex-1" />
                            <span className="text-xs text-muted-foreground">
                              {doc.progress}%
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {doc.status === "uploading" ? "Uploading..." : "Processing document..."}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRemoveDocument(doc.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentUpload;