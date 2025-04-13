import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { Upload, FileText, Check, X, Loader2 } from "lucide-react";
import MainLayout from "@/layouts/MainLayout";
import { uploadAndParseResume, ParsedResume } from "@/services/resumeService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getLatestParsedResume } from "@/services/resumeService";

const Resume = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const resumeQuery = useQuery({
    queryKey: ['resume'],
    queryFn: () => getLatestParsedResume(),
  });

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
    setFile(selectedFile);
    uploadMutation.mutate(selectedFile);
  };

  const handleDeleteResume = () => {
    setFile(null);
    setShowDeleteConfirm(false);
    queryClient.setQueryData(['resume'], null);
    toast({
      title: "Resume deleted",
      description: "Your resume has been removed",
    });
  };

  const handleViewJobs = () => {
    navigate("/jobs");
  };

  const isUploading = uploadMutation.isPending;
  const resumeData = resumeQuery.data;
  const resumeUploaded = !!resumeData;
  const isLoading = resumeQuery.isLoading;

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Resume Management</h1>
        
        <div className="grid gap-6">
          {isLoading ? (
            <Card>
              <CardContent className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </CardContent>
            </Card>
          ) : !resumeUploaded ? (
            <Card>
              <CardHeader>
                <CardTitle>Upload Your Resume</CardTitle>
                <CardDescription>
                  Upload your resume to find jobs that match your skills and experience
                </CardDescription>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Resume Uploaded</CardTitle>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    Delete
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 p-4 bg-secondary rounded-lg">
                  <FileText className="h-10 w-10 text-primary" />
                  <div className="flex-1">
                    <h3 className="font-medium">{file?.name || "Uploaded Resume"}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    <Check className="h-4 w-4" />
                    Processed
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Skills Detected</h3>
                  <div className="flex flex-wrap gap-2">
                    {resumeData?.skills?.map((skill) => (
                      <span 
                        key={skill} 
                        className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    )) || (
                      <span className="text-gray-500">No skills detected</span>
                    )}
                  </div>
                </div>

                {resumeData?.experience && resumeData.experience.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">Experience Detected</h3>
                    <div className="flex flex-wrap gap-2">
                      {resumeData.experience.map((exp) => (
                        <span 
                          key={exp} 
                          className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                        >
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button onClick={handleViewJobs} className="w-full">
                  View Matching Jobs
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {isUploading && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative h-12 w-12 mb-4">
                    <div className="absolute inset-0 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Processing Resume</h3>
                  <p className="text-sm text-gray-500">
                    We're analyzing your resume to find the best job matches for you...
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>Resume Tips</CardTitle>
              <CardDescription>
                Optimize your resume to get better job matches
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Include relevant keywords from job descriptions</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Quantify your achievements with specific metrics</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Tailor your resume for each job application</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Use a clean, professional format</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete your uploaded resume and all associated job matches.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteResume}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default Resume;
