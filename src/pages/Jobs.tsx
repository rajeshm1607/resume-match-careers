
import { useState } from "react";
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
  Filter,
} from "lucide-react";
import MainLayout from "@/layouts/MainLayout";

// Mock job data
const mockJobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "TechCorp",
    location: "San Francisco, CA",
    type: "Full-time",
    match: 95,
    salary: "$90,000 - $120,000",
    postedAt: "2 days ago",
    logo: "TC",
    skills: ["React", "TypeScript", "Tailwind CSS"]
  },
  {
    id: 2,
    title: "UX/UI Designer",
    company: "DesignStudio",
    location: "Remote",
    type: "Full-time",
    match: 88,
    salary: "$80,000 - $110,000",
    postedAt: "1 day ago",
    logo: "DS",
    skills: ["Figma", "UI Design", "Prototyping"]
  },
  {
    id: 3,
    title: "Product Manager",
    company: "ProductLabs",
    location: "New York, NY",
    type: "Full-time",
    match: 82,
    salary: "$100,000 - $140,000",
    postedAt: "5 days ago",
    logo: "PL",
    skills: ["Product Strategy", "Agile", "Market Analysis"]
  },
  {
    id: 4,
    title: "Full Stack Developer",
    company: "WebSolutions",
    location: "Chicago, IL",
    type: "Contract",
    match: 75,
    salary: "$70 - $90 / hour",
    postedAt: "1 week ago",
    logo: "WS",
    skills: ["React", "Node.js", "MongoDB"]
  },
  {
    id: 5,
    title: "Frontend Engineer",
    company: "StartupX",
    location: "Remote",
    type: "Full-time",
    match: 71,
    salary: "$85,000 - $115,000",
    postedAt: "3 days ago",
    logo: "SX",
    skills: ["JavaScript", "React", "Redux"]
  }
];

const Jobs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");
  const { toast } = useToast();
  
  // Filter jobs based on search and filters
  const filteredJobs = mockJobs
    .filter(job => 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .filter(job => filterType === "all" || job.type.toLowerCase() === filterType.toLowerCase())
    .filter(job => filterLocation === "all" || 
      (filterLocation === "remote" && job.location.toLowerCase() === "remote") ||
      (filterLocation === "onsite" && job.location.toLowerCase() !== "remote")
    )
    .sort((a, b) => b.match - a.match);

  const handleSaveJob = (jobId: number) => {
    toast({
      title: "Job saved",
      description: "This job has been added to your saved jobs.",
    });
  };

  const handleApplyJob = (jobId: number) => {
    toast({
      title: "Application started",
      description: "You can complete your application now.",
    });
  };

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Job Recommendations</h1>
        <p className="text-gray-600 mb-6">
          Jobs are ranked by match with your resume skills and experience
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
            
            {filteredJobs.length > 0 ? (
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
                          <div>
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
                            <Badge key={skill} variant="outline">
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
                  <h4 className="text-sm font-medium mb-2">Top Matching Skills</h4>
                  <div className="space-y-2">
                    {["React", "JavaScript", "TypeScript"].map((skill) => (
                      <div key={skill} className="flex items-center justify-between">
                        <span className="text-sm">{skill}</span>
                        <span className="text-xs text-green-600 font-medium">+15%</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Skills to Improve</h4>
                  <div className="space-y-2">
                    {["Next.js", "GraphQL", "Cypress"].map((skill) => (
                      <div key={skill} className="flex items-center justify-between">
                        <span className="text-sm">{skill}</span>
                        <span className="text-xs text-amber-600 font-medium">+5%</span>
                      </div>
                    ))}
                  </div>
                </div>
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
    </MainLayout>
  );
};

export default Jobs;
