
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import ResumeDetails from "./ResumeDetails";
import { ParsedResume } from "@/services/resumeService";
import { useNavigate } from "react-router-dom";

interface ResumeCardProps {
  resumeData: ParsedResume;
  fileName?: string;
}

const ResumeCard = ({ resumeData, fileName }: ResumeCardProps) => {
  const navigate = useNavigate();
  
  const handleViewJobs = () => {
    navigate("/jobs");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Resume Uploaded</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ResumeDetails resumeData={resumeData} fileName={fileName} />
      </CardContent>
      <CardFooter>
        <Button onClick={handleViewJobs} className="w-full">
          View Matching Jobs
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ResumeCard;
