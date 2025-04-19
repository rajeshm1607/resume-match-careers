
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import MainLayout from "@/layouts/MainLayout";
import { useQuery } from "@tanstack/react-query";
import { getLatestParsedResume } from "@/services/resumeService";
import { supabase } from "@/lib/supabase";
import UploadCard from "@/components/resume/UploadCard";
import ResumeCard from "@/components/resume/ResumeCard";
import ProcessingIndicator from "@/components/resume/ProcessingIndicator";
import ResumeTips from "@/components/resume/ResumeTips";

const Resume = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          console.log("No session in Resume page, redirecting to login");
          navigate("/login");
          return;
        }
        
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Authentication check error:", error);
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  const resumeQuery = useQuery({
    queryKey: ['resume'],
    queryFn: getLatestParsedResume,
    enabled: isAuthenticated,
  });

  const isUploading = false; // This would be set based on the upload mutation status
  const resumeData = resumeQuery.data;
  const resumeUploaded = !!resumeData;
  
  if (isLoading || resumeQuery.isLoading) {
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
