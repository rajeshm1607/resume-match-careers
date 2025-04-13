
import { Card, CardContent } from "@/components/ui/card";

const ProcessingIndicator = () => {
  return (
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
  );
};

export default ProcessingIndicator;
