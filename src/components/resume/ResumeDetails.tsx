
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Check, X } from "lucide-react";
import { ParsedResume } from "@/services/resumeService";
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
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface ResumeDetailsProps {
  resumeData: ParsedResume;
  fileName?: string;
}

const ResumeDetails = ({ resumeData, fileName }: ResumeDetailsProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDeleteResume = () => {
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

  return (
    <>
      <div className="flex items-center gap-4 p-4 bg-secondary rounded-lg">
        <FileText className="h-10 w-10 text-primary" />
        <div className="flex-1">
          <h3 className="font-medium">{fileName || "Uploaded Resume"}</h3>
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

      <Button onClick={() => setShowDeleteConfirm(true)} variant="destructive" size="sm" className="mt-4">
        Delete
      </Button>

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
    </>
  );
};

export default ResumeDetails;
