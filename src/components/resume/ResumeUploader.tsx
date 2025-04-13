
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Upload, Loader2 } from "lucide-react";
import { uploadAndParseResume } from "@/services/resumeService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ResumeUploaderProps {
  isUploading: boolean;
}

const ResumeUploader = ({ isUploading }: ResumeUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const uploadMutation = useMutation({
    mutationFn: uploadAndParseResume,
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Resume uploaded successfully",
          description: "Your resume has been analyzed for job matching",
        });
        queryClient.invalidateQueries({ queryKey: ['resume'] });
      } else {
        toast({
          title: "Upload failed",
          description: data.error || "An error occurred while uploading your resume",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Upload error",
        description: "Failed to upload your resume",
        variant: "destructive",
      });
    }
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf" || 
          droppedFile.type === "application/msword" || 
          droppedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        handleFileUpload(droppedFile);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or Word document",
          variant: "destructive",
        });
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = (selectedFile: File) => {
    uploadMutation.mutate(selectedFile);
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-12 text-center ${
        isDragging ? "border-primary bg-primary/5" : "border-gray-300"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center">
        <Upload className="h-10 w-10 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium mb-2">
          Drag and drop your resume here
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Supported formats: PDF, DOCX, DOC
        </p>
        <input
          type="file"
          id="resume-upload"
          className="hidden"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleFileChange}
        />
        <Button asChild disabled={isUploading}>
          <label htmlFor="resume-upload">Select File</label>
        </Button>
      </div>
    </div>
  );
};

export default ResumeUploader;
