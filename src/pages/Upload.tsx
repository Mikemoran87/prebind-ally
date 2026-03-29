import { useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload as UploadIcon, 
  FileText, 
  Image, 
  File, 
  X, 
  CheckCircle2, 
  AlertCircle,
  CloudUpload,
  Loader2,
  Eye,
  Download,
  ZoomIn,
  ZoomOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface UploadedFile {
  id: string;
  file: File;
  progress: number;
  status: "uploading" | "complete" | "error";
  errorMessage?: string;
  previewUrl?: string;
}

const ACCEPTED_FILE_TYPES = {
  "application/pdf": { icon: FileText, label: "PDF", color: "text-red-400" },
  "application/msword": { icon: FileText, label: "DOC", color: "text-blue-400" },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { icon: FileText, label: "DOCX", color: "text-blue-400" },
  "text/plain": { icon: FileText, label: "TXT", color: "text-slate-400" },
  "text/csv": { icon: FileText, label: "CSV", color: "text-slate-400" },
  "image/jpeg": { icon: Image, label: "JPEG", color: "text-green-400" },
  "image/png": { icon: Image, label: "PNG", color: "text-green-400" },
  "image/webp": { icon: Image, label: "WEBP", color: "text-green-400" },
  "application/vnd.ms-excel": { icon: FileText, label: "XLS", color: "text-emerald-400" },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": { icon: FileText, label: "XLSX", color: "text-emerald-400" },
};

const ACCEPTED_EXTENSIONS = ".pdf,.doc,.docx,.txt,.csv,.jpg,.jpeg,.png,.webp,.xls,.xlsx";

export default function Upload() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const urlDealId = searchParams.get("dealId") || "";
  const urlDealRef = searchParams.get("dealRef") || "";
  const [attachDealId, setAttachDealId] = useState(urlDealId);
  const { toast } = useToast();

  const getFileIcon = (mimeType: string) => {
    const config = ACCEPTED_FILE_TYPES[mimeType as keyof typeof ACCEPTED_FILE_TYPES];
    return config || { icon: File, label: "FILE", color: "text-muted-foreground" };
  };

  const createPreviewUrl = (file: File): string => {
    return URL.createObjectURL(file);
  };

  const uploadToSupabase = async (uploadFile: UploadedFile, dealId: string) => {
    try {
      const timestamp = Date.now();
      const storagePath = `${dealId || "unassigned"}/${timestamp}-${uploadFile.file.name}`;

      // Show progress
      setUploadedFiles((prev) =>
        prev.map((f) => (f.id === uploadFile.id ? { ...f, progress: 30 } : f))
      );

      const { error: uploadError } = await supabase.storage
        .from("deal-documents")
        .upload(storagePath, uploadFile.file, {
          contentType: uploadFile.file.type,
          upsert: false,
        });

      if (uploadError) throw uploadError;

      setUploadedFiles((prev) =>
        prev.map((f) => (f.id === uploadFile.id ? { ...f, progress: 70 } : f))
      );

      // If a deal ID is provided, create a document record in the DB
      if (dealId) {
        const { error: docError } = await supabase.from("documents").insert({
          deal_id: dealId,
          file_name: uploadFile.file.name,
          file_type: uploadFile.file.type.split("/")[1] || "unknown",
          file_size: uploadFile.file.size,
          storage_path: storagePath,
          mime_type: uploadFile.file.type,
          is_analyzed: false,
        });

        if (docError) {
          console.warn("Document record error (file still uploaded):", docError);
        }
      }

      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id
            ? { ...f, progress: 100, status: "complete" as const, previewUrl: createPreviewUrl(f.file) }
            : f
        )
      );
    } catch (error) {
      console.error("Upload error:", error);
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id
            ? { ...f, status: "error" as const, errorMessage: "Upload failed" }
            : f
        )
      );
      toast({
        title: "Upload failed",
        description: `Failed to upload ${uploadFile.file.name}. Check Supabase storage is configured.`,
        variant: "destructive",
      });
    }
  };

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;

    const newFiles: UploadedFile[] = [];
    
    Array.from(files).forEach((file) => {
      const isValidType = Object.keys(ACCEPTED_FILE_TYPES).includes(file.type) 
        || file.type.startsWith("text/")
        || file.name.endsWith(".txt")
        || file.name.endsWith(".csv");
      
      if (!isValidType) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a supported file type.`,
          variant: "destructive",
        });
        return;
      }

      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds the 50MB limit.`,
          variant: "destructive",
        });
        return;
      }

      const uploadFile: UploadedFile = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        progress: 0,
        status: "uploading",
      };

      newFiles.push(uploadFile);
    });

    setUploadedFiles((prev) => [...prev, ...newFiles]);
    newFiles.forEach((f) => uploadToSupabase(f, attachDealId));
  }, [toast]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    e.target.value = "";
  }, [handleFiles]);

  const removeFile = (id: string) => {
    const file = uploadedFiles.find(f => f.id === id);
    if (file?.previewUrl) {
      URL.revokeObjectURL(file.previewUrl);
    }
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleProcess = () => {
    const completedFiles = uploadedFiles.filter(f => f.status === "complete");
    if (completedFiles.length > 0) {
      setActiveFileId(completedFiles[0].id);
      setZoomLevel(100);
      setIsPreviewOpen(true);
    }
  };

  const handleDownload = (file: UploadedFile) => {
    const url = URL.createObjectURL(file.file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const completedCount = uploadedFiles.filter((f) => f.status === "complete").length;
  const uploadingCount = uploadedFiles.filter((f) => f.status === "uploading").length;
  const completedFiles = uploadedFiles.filter((f) => f.status === "complete");
  const activeFile = completedFiles.find(f => f.id === activeFileId);

  const isImageFile = (mimeType: string) => {
    return mimeType.startsWith("image/");
  };

  const isPdfFile = (mimeType: string) => {
    return mimeType === "application/pdf";
  };

  const renderPreview = (file: UploadedFile) => {
    if (!file.previewUrl) return null;

    if (isImageFile(file.file.type)) {
      return (
        <div className="flex items-center justify-center h-full overflow-auto p-4">
          <img
            src={file.previewUrl}
            alt={file.file.name}
            className="max-w-full max-h-full object-contain transition-transform"
            style={{ transform: `scale(${zoomLevel / 100})` }}
          />
        </div>
      );
    }

    if (isPdfFile(file.file.type)) {
      return (
        <iframe
          src={file.previewUrl}
          className="w-full h-full border-0"
          title={file.file.name}
        />
      );
    }

    // For Word/Excel files - show file info since browser can't render them
    const fileConfig = getFileIcon(file.file.type);
    const FileIcon = fileConfig.icon;
    
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className={cn(
          "flex h-24 w-24 items-center justify-center rounded-2xl bg-muted mb-6",
          fileConfig.color
        )}>
          <FileIcon className="h-12 w-12" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {file.file.name}
        </h3>
        <p className="text-muted-foreground mb-6">
          {formatFileSize(file.file.size)} • {fileConfig.label} Document
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          Preview not available for this file type. Download to view.
        </p>
        <Button onClick={() => handleDownload(file)}>
          <Download className="h-4 w-4 mr-2" />
          Download File
        </Button>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 ml-64 p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Upload Documents
            </h1>
            <p className="mt-2 text-muted-foreground">
              Upload policy documents, endorsements, and supporting files for analysis
            </p>
          </div>

          {/* Deal ID input */}
          <div className="flex flex-col gap-1 max-w-sm">
            <label className="text-sm font-medium text-muted-foreground">
              Attach to Deal {urlDealRef && <span className="text-primary font-semibold">— {urlDealRef}</span>}
              {!urlDealRef && <span className="text-xs font-normal">(optional)</span>}
            </label>
            <input
              type="text"
              value={attachDealId}
              onChange={(e) => setAttachDealId(e.target.value)}
              placeholder="Deal UUID or leave blank"
              className="px-3 py-2 rounded-lg border border-border bg-muted/30 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              readOnly={!!urlDealId}
            />
            <p className="text-xs text-muted-foreground">
              {urlDealRef ? `Documents will be linked to deal ${urlDealRef} for AI analysis` : "Documents will be linked to this deal for AI analysis"}
            </p>
          </div>

          {/* Upload Zone */}
          <Card className="border-dashed border-2 bg-card/50 backdrop-blur">
            <CardContent className="p-0">
              <label
                htmlFor="file-upload"
                className={cn(
                  "flex flex-col items-center justify-center w-full min-h-[300px] cursor-pointer transition-all duration-200",
                  isDragging 
                    ? "bg-primary/10 border-primary" 
                    : "hover:bg-muted/50"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                  <div className={cn(
                    "flex h-20 w-20 items-center justify-center rounded-full mb-6 transition-all",
                    isDragging 
                      ? "bg-primary/20 scale-110" 
                      : "bg-muted"
                  )}>
                    <CloudUpload className={cn(
                      "h-10 w-10 transition-colors",
                      isDragging ? "text-primary" : "text-muted-foreground"
                    )} />
                  </div>
                  
                  <p className="text-lg font-medium text-foreground mb-2">
                    {isDragging ? "Drop files here" : "Drag & drop files here"}
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">
                    or click to browse from your computer
                  </p>
                  
                  <div className="flex flex-wrap gap-2 justify-center mb-4">
                    <Badge variant="outline" className="text-xs">PDF</Badge>
                    <Badge variant="outline" className="text-xs">Word (.doc, .docx)</Badge>
                    <Badge variant="outline" className="text-xs">Text (.txt)</Badge>
                    <Badge variant="outline" className="text-xs">Images (.jpg, .png)</Badge>
                    <Badge variant="outline" className="text-xs">Excel (.xls, .xlsx)</Badge>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    Maximum file size: 50MB
                  </p>
                </div>
                
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  multiple
                  accept={ACCEPTED_EXTENSIONS}
                  onChange={handleFileInput}
                />
              </label>
            </CardContent>
          </Card>

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Uploaded Files</CardTitle>
                    <CardDescription>
                      {completedCount} of {uploadedFiles.length} files uploaded
                      {uploadingCount > 0 && ` • ${uploadingCount} uploading`}
                    </CardDescription>
                  </div>
                  {uploadedFiles.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setUploadedFiles([])}
                    >
                      Clear All
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {uploadedFiles.map((uploadedFile) => {
                    const fileConfig = getFileIcon(uploadedFile.file.type);
                    const FileIcon = fileConfig.icon;
                    
                    return (
                      <div
                        key={uploadedFile.id}
                        className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 border border-border"
                      >
                        <div className={cn(
                          "flex h-12 w-12 items-center justify-center rounded-lg bg-background",
                          fileConfig.color
                        )}>
                          <FileIcon className="h-6 w-6" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-medium text-foreground truncate">
                              {uploadedFile.file.name}
                            </p>
                            <Badge variant="secondary" className="text-xs shrink-0">
                              {fileConfig.label}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-muted-foreground">
                              {formatFileSize(uploadedFile.file.size)}
                            </span>
                            
                            {uploadedFile.status === "uploading" && (
                              <div className="flex-1 max-w-[200px]">
                                <Progress value={uploadedFile.progress} className="h-1.5" />
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {uploadedFile.status === "uploading" && (
                            <Loader2 className="h-5 w-5 text-primary animate-spin" />
                          )}
                          {uploadedFile.status === "complete" && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                onClick={() => {
                                  setActiveFileId(uploadedFile.id);
                                  setZoomLevel(100);
                                  setIsPreviewOpen(true);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                            </>
                          )}
                          {uploadedFile.status === "error" && (
                            <AlertCircle className="h-5 w-5 text-destructive" />
                          )}
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={() => removeFile(uploadedFile.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          {completedCount > 0 && (
            <div className="flex flex-col gap-3">
              {/* Success message */}
              <div className="flex items-center gap-2 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {completedCount} document{completedCount !== 1 ? "s" : ""} uploaded successfully
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {attachDealId ? "Documents are linked to the deal and ready for AI analysis." : "Upload more files or go back to your deal to run analysis."}
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setUploadedFiles([])}>
                  Upload More
                </Button>
                {attachDealId ? (
                  <Button
                    className="bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-500/90 gap-2"
                    onClick={() => navigate(`/deals/${attachDealId}`)}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Go to Deal — Analyse Documents
                  </Button>
                ) : (
                  <Button
                    className="bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-500/90 gap-2"
                    onClick={() => navigate("/deals")}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Go to Deals
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Document Preview Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-6xl w-[95vw] h-[90vh] flex flex-col p-0">
          <DialogHeader className="px-6 py-4 border-b border-border shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-lg font-semibold">
                  Document Preview
                </DialogTitle>
                <DialogDescription>
                  {completedFiles.length} document{completedFiles.length !== 1 ? "s" : ""} ready for review
                </DialogDescription>
              </div>
              {activeFile && isImageFile(activeFile.file.type) && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setZoomLevel(Math.max(25, zoomLevel - 25))}
                    disabled={zoomLevel <= 25}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground w-16 text-center">
                    {zoomLevel}%
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setZoomLevel(Math.min(200, zoomLevel + 25))}
                    disabled={zoomLevel >= 200}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </DialogHeader>

          {completedFiles.length > 1 ? (
            <Tabs 
              value={activeFileId || completedFiles[0]?.id} 
              onValueChange={setActiveFileId}
              className="flex-1 flex flex-col overflow-hidden"
            >
              <div className="px-6 pt-4 shrink-0">
                <TabsList className="w-full justify-start overflow-x-auto">
                  {completedFiles.map((file) => {
                    const fileConfig = getFileIcon(file.file.type);
                    return (
                      <TabsTrigger 
                        key={file.id} 
                        value={file.id}
                        className="flex items-center gap-2 max-w-[200px]"
                      >
                        <fileConfig.icon className="h-4 w-4 shrink-0" />
                        <span className="truncate">{file.file.name}</span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </div>
              
              {completedFiles.map((file) => (
                <TabsContent 
                  key={file.id} 
                  value={file.id} 
                  className="flex-1 overflow-hidden m-0 data-[state=active]:flex data-[state=active]:flex-col"
                >
                  <div className="flex-1 overflow-auto bg-muted/30">
                    {renderPreview(file)}
                  </div>
                  <div className="px-6 py-4 border-t border-border flex justify-end gap-3 shrink-0">
                    <Button variant="outline" onClick={() => handleDownload(file)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button className="bg-gradient-to-r from-primary to-cyan-500">
                      Analyze Document
                    </Button>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          ) : activeFile ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-auto bg-muted/30">
                {renderPreview(activeFile)}
              </div>
              <div className="px-6 py-4 border-t border-border flex justify-end gap-3 shrink-0">
                <Button variant="outline" onClick={() => handleDownload(activeFile)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button className="bg-gradient-to-r from-primary to-cyan-500">
                  Analyze Document
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
