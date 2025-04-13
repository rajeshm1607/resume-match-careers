
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

const JobScraper = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scrapedJobs, setScrapedJobs] = useState([]);
  const { toast } = useToast();

  const handleScrapedDataUpload = async () => {
    try {
      setIsLoading(true);
      
      // First, scrape the LinkedIn URL
      const result = await scrapeLinkedInJobs(url);
      
      if (!result.success) {
        toast({
          title: "Scraping Error",
          description: result.message,
          variant: "destructive",
        });
        return;
      }
      
      setScrapedJobs(result.data);
      
      // Upload jobs to Supabase
      const { data, error } = await supabase
        .from('jobs')
        .insert(result.data);
      
      if (error) {
        console.error('Error uploading jobs:', error);
        toast({
          title: "Upload Error",
          description: "Failed to upload jobs to database",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Success",
        description: `${result.data.length} jobs uploaded to database`,
      });
    } catch (error) {
      console.error('Job scraper error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-6 p-4 bg-white rounded-lg border">
      <div>
        <h2 className="text-xl font-bold">LinkedIn Job Scraper</h2>
        <p className="text-sm text-gray-500">
          Enter a LinkedIn job search URL to scrape and upload job listings
        </p>
      </div>
      
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="linkedin-url">LinkedIn Jobs URL</Label>
          <Input
            id="linkedin-url"
            placeholder="https://www.linkedin.com/jobs/search?..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <p className="text-xs text-gray-500">
            Paste the full LinkedIn jobs search URL
          </p>
        </div>
        
        <Button 
          onClick={handleScrapedDataUpload}
          disabled={isLoading || !url.includes('linkedin.com/jobs')}
        >
          {isLoading ? 'Processing...' : 'Scrape & Upload Jobs'}
        </Button>
      </div>
      
      {isLoading && (
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      )}
      
      {scrapedJobs.length > 0 && !isLoading && (
        <div className="border rounded-md p-4">
          <h3 className="text-sm font-medium mb-2">Scraped Jobs ({scrapedJobs.length})</h3>
          <div className="max-h-60 overflow-y-auto space-y-2">
            {scrapedJobs.map((job, index) => (
              <div key={index} className="text-xs border-b pb-2">
                <div className="font-medium">{job.title}</div>
                <div>{job.company}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Function to scrape LinkedIn jobs
// Note: This function would need to be implemented on a server-side component
// Here we're simulating the scraping response
const scrapeLinkedInJobs = async (url) => {
  if (!url.includes('linkedin.com/jobs')) {
    return {
      success: false,
      message: "Please provide a valid LinkedIn jobs URL",
    };
  }
  
  // In a real implementation, this would call a server-side function
  // For demo purposes, we'll simulate the response
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock data to simulate scraped jobs
  const mockScrapedJobs = [
    {
      id: Math.floor(Math.random() * 1000000),
      title: "Senior Frontend Developer",
      company: "TechCorp",
      location: "San Francisco, CA",
      type: "Full-time",
      skills: ["React", "JavaScript", "CSS"],
      match: 90,
      salary: "$120,000 - $150,000",
      postedAt: new Date().toISOString(),
      logo: "TC",
      source: "LinkedIn"
    },
    {
      id: Math.floor(Math.random() * 1000000),
      title: "UX Designer",
      company: "Creative Studios",
      location: "Remote",
      type: "Contract",
      skills: ["Figma", "UI Design", "User Research"],
      match: 85,
      salary: "$90 - $110 / hour",
      postedAt: new Date().toISOString(),
      logo: "CS",
      source: "LinkedIn"
    },
    {
      id: Math.floor(Math.random() * 1000000),
      title: "Backend Engineer",
      company: "CloudTech",
      location: "Seattle, WA",
      type: "Full-time",
      skills: ["Node.js", "PostgreSQL", "AWS"],
      match: 80,
      salary: "$130,000 - $160,000",
      postedAt: new Date().toISOString(),
      logo: "CT",
      source: "LinkedIn"
    }
  ];
  
  return {
    success: true,
    message: "Jobs scraped successfully",
    data: mockScrapedJobs
  };
};

export default JobScraper;
