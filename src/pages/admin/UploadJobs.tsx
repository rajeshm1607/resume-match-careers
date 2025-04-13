import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Plus, Trash2 } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import MainLayout from "@/layouts/MainLayout";
import { supabase } from "@/lib/supabase";

interface JobFormData {
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  skills: string[];
  description?: string;
  url?: string;
  source?: string;
}

const initialJobData: JobFormData = {
  title: "",
  company: "",
  location: "",
  type: "Full-time",
  salary: "",
  skills: [],
  description: "",
  url: "",
  source: "Admin Upload"
};

const UploadJobs = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [jobData, setJobData] = useState<JobFormData>(initialJobData);
  const [skill, setSkill] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Check if user is admin
  const checkAdminAccess = async () => {
    try {
      const { data } = await supabase.auth.getUser();
      if (!data.user || data.user.email !== "rajeshkumarpsg16@gmail.com") {
        toast({
          title: "Access denied",
          description: "You don't have permission to view this page",
          variant: "destructive"
        });
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error checking admin access:", error);
      navigate("/dashboard");
    }
  };

  // Run once on component mount
  useEffect(() => {
    checkAdminAccess();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setJobData(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillAdd = () => {
    if (skill.trim() && !jobData.skills.includes(skill.trim())) {
      setJobData(prev => ({ 
        ...prev, 
        skills: [...prev.skills, skill.trim()] 
      }));
      setSkill("");
    }
  };

  const handleSkillRemove = (skillToRemove: string) => {
    setJobData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    
    try {
      // Calculate a random match score between 70-98 for demonstration
      const match = Math.floor(Math.random() * 28) + 70;
      
      // Logo based on company name
      const logo = jobData.company.substring(0, 2).toUpperCase();
      
      // Prepare the job data for insertion
      const jobForDB = {
        title: jobData.title,
        company: jobData.company,
        location: jobData.location,
        type: jobData.type,
        match: match,
        salary: jobData.salary,
        postedAt: new Date().toISOString(),
        logo: logo,
        skills: jobData.skills,
        description: jobData.description || "",
        url: jobData.url || "",
        source: jobData.source || "Admin Upload"
      };
      
      console.log("Inserting job data:", jobForDB);
      
      // Insert into Supabase
      const { data, error } = await supabase
        .from('jobs')
        .insert([jobForDB]);
      
      if (error) {
        throw error;
      }

      toast({
        title: "Job uploaded successfully",
        description: "The job has been added to the database",
      });
      
      // Reset form
      setJobData(initialJobData);
    } catch (error: any) {
      console.error("Error uploading job:", error);
      toast({
        title: "Error uploading job",
        description: error.message || "There was an error uploading the job",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Upload Jobs</h1>
          <p className="text-gray-600">Add job listings to the database</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Add New Job</CardTitle>
            <CardDescription>
              Fill in the job details to add to the database
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title *</Label>
                    <Input 
                      id="title"
                      name="title"
                      placeholder="e.g. Frontend Developer"
                      value={jobData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company">Company *</Label>
                    <Input 
                      id="company"
                      name="company"
                      placeholder="e.g. TechCorp"
                      value={jobData.company}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input 
                      id="location"
                      name="location"
                      placeholder="e.g. San Francisco, CA or Remote"
                      value={jobData.location}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type">Job Type *</Label>
                    <select
                      id="type"
                      name="type"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={jobData.type}
                      onChange={(e) => setJobData(prev => ({ ...prev, type: e.target.value }))}
                      required
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                      <option value="Remote">Remote</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="salary">Salary Range</Label>
                  <Input 
                    id="salary"
                    name="salary"
                    placeholder="e.g. $90,000 - $120,000"
                    value={jobData.salary}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="url">Job URL</Label>
                  <Input 
                    id="url"
                    name="url"
                    type="url"
                    placeholder="e.g. https://example.com/jobs/123"
                    value={jobData.url || ""}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="skills">Skills</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="skill-input"
                      value={skill}
                      onChange={(e) => setSkill(e.target.value)}
                      placeholder="e.g. React"
                      className="flex-1"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSkillAdd();
                        }
                      }}
                    />
                    <Button 
                      type="button"
                      onClick={handleSkillAdd}
                      variant="outline"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  
                  {jobData.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {jobData.skills.map((skill, index) => (
                        <div 
                          key={index}
                          className="bg-primary/10 text-primary px-2 py-1 rounded-md flex items-center text-sm"
                        >
                          {skill}
                          <button 
                            type="button"
                            onClick={() => handleSkillRemove(skill)}
                            className="ml-1.5 text-primary hover:text-primary/80"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Job Description</Label>
                  <textarea
                    id="description"
                    name="description"
                    rows={5}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Enter job description"
                    value={jobData.description || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </form>
          </CardContent>
          
          <CardFooter className="flex justify-end">
            <Button type="button" variant="outline" className="mr-2" onClick={() => setJobData(initialJobData)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isUploading}
            >
              {isUploading ? (
                <>Uploading...</>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Job
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default UploadJobs;
