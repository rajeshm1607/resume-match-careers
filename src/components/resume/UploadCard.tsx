
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ResumeUploader from "./ResumeUploader";

interface UploadCardProps {
  isUploading: boolean;
}

const UploadCard = ({ isUploading }: UploadCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Your Resume</CardTitle>
        <CardDescription>
          Upload your resume to find jobs that match your skills and experience
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResumeUploader isUploading={isUploading} />
      </CardContent>
    </Card>
  );
};

export default UploadCard;
