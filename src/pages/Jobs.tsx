
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { 
  Briefcase, 
  MapPin, 
  Building, 
  Clock, 
  Search,
  BookmarkPlus,
  ExternalLink,
  Loader2
} from "lucide-react";
import MainLayout from "@/layouts/MainLayout";
import { useQuery, useMutation } from "@tanstack/react-query";
import { searchJobs, saveJob, applyToJob } from "@/services/jobService";
import { getLatestParsedResume } from "@/services/resumeService";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

const Jobs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");
  const [resumeSkills, setResumeSkills] = useState<string[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Skip the separate isLoading state since we can use the loading states from React Query
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          console.log("No session in Jobs page, redirecting to login");
          navigate("/login");
          return;
        }
        
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Authentication check error:", error);
        navigate("/login");
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  const resumeQuery = useQuery({
    queryKey: ['resume'],
    queryFn: getLatestParsedResume,
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (resumeQuery.data && resumeQuery.data.skills) {
      setResumeSkills(resumeQuery.data.skills);
    }
  }, [resumeQuery.data]);

  const jobsQuery = useQuery({
    queryKey: ['jobs', searchQuery, filterType, filterLocation, resumeSkills],
    queryFn: () => searchJobs(searchQuery, { type: filterType, location: filterLocation }, resumeSkills),
    enabled: isAuthenticated,
  });

  const saveMutation = useMutation({
    mutationFn: saveJob,
    onSuccess: () => {
      toast({
        title: "Job saved",
        description: "This job has been added to your saved jobs.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save this job. Please try again.",
        variant: "destructive",
      });
    }
  });

  const applyMutation = useMutation({
    mutationFn: applyToJob,
    onSuccess: () => {
      toast({
        title: "Application started",
        description: "You can complete your application now.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to start application. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSaveJob = (jobId: number) => {
    saveMutation.mutate(jobId);
  };

  const handleApplyJob = (jobId: number) => {
    applyMutation.mutate(jobId);
  };

  const filteredJobs = jobsQuery.data || [];
  const isPageLoading = !isAuthenticated || jobsQuery.isLoading || resumeQuery.isLoading;
  const isError = jobsQuery.isError || resumeQuery.isError;
  const resume = resumeQuery.data;
  
  // Use MainLayout to handle authentication checking
  return (
    <MainLayout>
      {isPageLoading ? (
        <div className="flex justify-center items-center h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">Job Recommendations</h1>
          <p className="text-gray-600 mb-6">
            Jobs are ranked by match with your resume skills and experience
            {resume?.skills && resume.skills.length > 0 && (
              <span className="text-green-600"> - Using {resume.skills.length} skills from your resume!</span>
            )}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <Input 
                    placeholder="Search jobs, skills, companies..." 
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Job Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="full-time">Full Time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="part-time">Part Time</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={filterLocation} onValueChange={setFilterLocation}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="onsite">On-site</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {isError ? (
                <div className="text-center py-10 bg-red-50 rounded-lg">
                  <p className="text-red-500">Failed to load jobs. Please try again.</p>
                </div>
              ) : filteredJobs.length > 0 ? (
                <div className="space-y-4">
                  {filteredJobs.map((job) => (
                    <Card key={job.id} className="overflow-hidden">
                      <div className="flex items-start p-6">
                        <div className="h-12 w-12 rounded bg-primary/10 text-primary flex items-center justify-center font-bold text-lg mr-4">
                          {job.logo}
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <h3 className="text-lg font-medium">{job.title}</h3>
                            <div className="flex items-center gap-2">
                              {job.source && (
                                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                  {job.source}
                                </span>
                              )}
                              <span className="inline-flex items-center bg-job-match-bg text-job-match px-2.5 py-0.5 rounded-full text-sm font-medium">
                                {job.match}% Match
                              </span>
                            </div>
                          </div>
                          <div className="mt-1 mb-3">
                            <div className="flex flex-wrap items-center text-gray-500 text-sm gap-x-4 gap-y-1">
                              <span className="flex items-center">
                                <Building className="h-4 w-4 mr-1" />
                                {job.company}
                              </span>
                              <span className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {job.location}
                              </span>
                              <span className="flex items-center">
                                <Briefcase className="h-4 w-4 mr-1" />
                                {job.type}
                              </span>
                              <span className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {job.postedAt}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {job.skills.map((skill) => (
                              <Badge 
                                key={skill} 
                                variant={resumeSkills.includes(skill) ? "default" : "outline"}
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-sm text-gray-600">
                            Salary: {job.salary}
                          </p>
                        </div>
                      </div>
                      
                      <div className="w-full bg-gray-100 h-2">
                        <div 
                          className="bg-job-match h-full" 
                          style={{ width: `${job.match}%` }}
                        ></div>
                      </div>
                      
                      <CardFooter className="flex justify-end gap-3 bg-secondary/50 py-3">
                        {job.url && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(job.url, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleSaveJob(job.id)}
                        >
                          <BookmarkPlus className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleApplyJob(job.id)}
                        >
                          Apply
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-secondary/30 rounded-lg">
                  <p className="text-gray-500">No matching jobs found.</p>
                  <p className="text-gray-500 text-sm mt-1">Try adjusting your search or filters.</p>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Match Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Your Job Fit</span>
                      <span className="text-sm text-green-600">Good</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-job-match h-full rounded-full" style={{ width: "85%" }}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Based on your resume</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Top Skills from Resume</h4>
                    <div className="space-y-2">
                      {resumeQuery.isLoading ? (
                        <div className="text-sm text-gray-400">Loading skills...</div>
                      ) : resume?.skills ? (
                        resume.skills.slice(0, 5).map((skill) => (
                          <div key={skill} className="flex items-center justify-between">
                            <span className="text-sm">{skill}</span>
                            <span className="text-xs text-green-600 font-medium">+15%</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-gray-400">No resume uploaded</div>
                      )}
                    </div>
                  </div>
                  
                  {resume && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Top Job Sources</h4>
                      <div className="space-y-2">
                        {['LinkedIn', 'Indeed', 'Monster'].map((source) => (
                          <div key={source} className="flex items-center justify-between">
                            <span className="text-sm">{source}</span>
                            <span className="text-xs text-amber-600 font-medium">
                              {source === 'LinkedIn' ? '65%' : source === 'Indeed' ? '25%' : '10%'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Searches</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {["Frontend Developer", "React Developer", "UX Designer"].map((search) => (
                    <div 
                      key={search} 
                      className="flex items-center justify-between hover:bg-secondary/50 p-2 rounded-md cursor-pointer"
                      onClick={() => setSearchQuery(search)}
                    >
                      <span className="text-sm">{search}</span>
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default Jobs;
