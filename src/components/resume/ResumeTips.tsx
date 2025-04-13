
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const ResumeTips = () => {
  return (
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
  );
};

export default ResumeTips;
