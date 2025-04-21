
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import MainLayout from "@/layouts/MainLayout";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getLatestParsedResume } from "@/services/resumeService";
import { supabase } from "@/lib/supabase";
import UploadCard from "@/components/resume/UploadCard";
import ResumeCard from "@/components/resume/ResumeCard";
import ProcessingIndicator from "@/components/resume/ProcessingIndicator";
import ResumeTips from "@/components/resume/ResumeTips";

const Resume = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const queryClient = useQueryClient();
  
  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Checking auth status in Resume page...");
        const { data: sessionData } = await supabase.auth.getSession();
        const hasSession = !!sessionData.session;
        
        console.log("Resume page - User authenticated:", hasSession);
        setIsAuthenticated(hasSession);
        setIsPageLoading(false);
      } catch (error) {
        console.error("Authentication check error in Resume page:", error);
        setIsAuthenticated(false);
        setIsPageLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  // Query for resume data
  const resumeQuery = useQuery({
    queryKey: ['resume'],
    queryFn: getLatestParsedResume,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const isUploading = false; // This would be set based on the upload mutation status
  const resumeData = resumeQuery.data;
  const resumeUploaded = !!resumeData;
  
  const isLoading = isPageLoading || resumeQuery.isLoading;
  
  console.log("Resume page rendering state:", {
    isAuthenticated,
    isPageLoading,
    resumeLoading: resumeQuery.isLoading,
    resumeUploaded,
    hasData: !!resumeData
  });
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Resume Management</h1>
        
        <div className="grid gap-6">
          {!resumeUploaded ? (
            <UploadCard isUploading={isUploading} />
          ) : (
            <ResumeCard 
              resumeData={resumeData} 
              fileName={file?.name} 
            />
          )}
          
          {isUploading && <ProcessingIndicator />}
          
          <ResumeTips />
        </div>
      </div>
    </MainLayout>
  );
};

export default Resume;
