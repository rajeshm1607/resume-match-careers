import { supabase } from '@/lib/supabase';

export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  match: number;
  salary: string;
  postedAt: string;
  logo: string;
  skills: string[];
  description?: string;
  url?: string;
  source?: string;
}

export const searchJobs = async (
  query: string = '', 
  filters: { type?: string; location?: string } = {},
  skills: string[] = []
): Promise<Job[]> => {
  try {
    console.log("Searching jobs with query:", query, "filters:", filters);
    
    // Fetch jobs from Supabase
    let { data: jobs, error } = await supabase
      .from('jobs')
      .select('*');
    
    if (error) {
      console.error("Error fetching jobs from Supabase:", error);
      throw error;
    }

    // If no jobs found in Supabase, return mock data
    if (!jobs || jobs.length === 0) {
      console.log("No jobs found in Supabase, using mock data");
      return getMockJobs(query, filters, skills);
    }

    console.log(`Found ${jobs.length} jobs in Supabase`);
    
    // Format dates - convert ISO to readable format
    jobs = jobs.map(job => ({
      ...job,
      postedAt: formatPostedDate(job.postedAt)
    }));

    // Filter jobs based on query and filters
    let filteredJobs = jobs as Job[];
    
    if (query) {
      const lowerQuery = query.toLowerCase();
      filteredJobs = filteredJobs.filter(job => 
        job.title?.toLowerCase().includes(lowerQuery) ||
        job.company?.toLowerCase().includes(lowerQuery) ||
        job.skills?.some(skill => skill.toLowerCase().includes(lowerQuery))
      );
    }

    if (filters.type && filters.type !== 'all') {
      filteredJobs = filteredJobs.filter(job => 
        job.type?.toLowerCase() === filters.type?.toLowerCase()
      );
    }

    if (filters.location && filters.location !== 'all') {
      if (filters.location === 'remote') {
        filteredJobs = filteredJobs.filter(job => 
          job.location?.toLowerCase().includes('remote')
        );
      } else if (filters.location === 'onsite') {
        filteredJobs = filteredJobs.filter(job => 
          !job.location?.toLowerCase().includes('remote')
        );
      }
    }

    // Calculate match score if skills are provided
    if (skills.length > 0) {
      filteredJobs = filteredJobs.map(job => {
        if (!job.skills) job.skills = [];
        
        const matchingSkills = skills.filter(skill => 
          job.skills.some(jobSkill => 
            jobSkill.toLowerCase().includes(skill.toLowerCase())
          )
        );
        
        const matchScore = Math.min(100, Math.round((matchingSkills.length / skills.length) * 100 + Math.random() * 10));
        return {
          ...job,
          match: matchScore
        };
      });
    }

    // Sort by match score
    return filteredJobs.sort((a, b) => b.match - a.match);
  } catch (error) {
    console.error('Error searching jobs:', error);
    return getMockJobs(query, filters, skills);
  }
};

// Helper function to format dates
const formatPostedDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      return `${Math.floor(diffDays / 7)} weeks ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  } catch (e) {
    console.error("Error formatting date:", e);
    return dateString;
  }
};

// Mock job data helper function
const getMockJobs = (
  query: string = '', 
  filters: { type?: string; location?: string } = {},
  skills: string[] = []
): Job[] => {
  // Using the mock data from the current Jobs.tsx
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
      skills: ["React", "TypeScript", "Tailwind CSS"],
      source: "LinkedIn"
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
      skills: ["Figma", "UI Design", "Prototyping"],
      source: "Indeed"
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
      skills: ["Product Strategy", "Agile", "Market Analysis"],
      source: "LinkedIn"
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
      skills: ["React", "Node.js", "MongoDB"],
      source: "Indeed"
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
      skills: ["JavaScript", "React", "Redux"],
      source: "LinkedIn"
    }
  ];

  // Apply filtering
  let filteredJobs = [...mockJobs];
  
  if (query) {
    const lowerQuery = query.toLowerCase();
    filteredJobs = filteredJobs.filter(job => 
      job.title.toLowerCase().includes(lowerQuery) || 
      job.company.toLowerCase().includes(lowerQuery) ||
      job.skills.some(skill => skill.toLowerCase().includes(lowerQuery))
    );
  }

  if (filters.type && filters.type !== 'all') {
    filteredJobs = filteredJobs.filter(job => 
      job.type.toLowerCase() === filters.type?.toLowerCase()
    );
  }

  if (filters.location && filters.location !== 'all') {
    if (filters.location === 'remote') {
      filteredJobs = filteredJobs.filter(job => 
        job.location.toLowerCase() === 'remote'
      );
    } else if (filters.location === 'onsite') {
      filteredJobs = filteredJobs.filter(job => 
        job.location.toLowerCase() !== 'remote'
      );
    }
  }

  // Recalculate match score based on provided skills
  if (skills.length > 0) {
    filteredJobs = filteredJobs.map(job => {
      const matchingSkills = skills.filter(skill => 
        job.skills.some(jobSkill => 
          jobSkill.toLowerCase().includes(skill.toLowerCase())
        )
      );
      
      const matchScore = Math.min(100, Math.round((matchingSkills.length / skills.length) * 100 + Math.random() * 10));
      return {
        ...job,
        match: matchScore
      };
    });
  }

  return filteredJobs.sort((a, b) => b.match - a.match);
};

export const saveJob = async (jobId: number): Promise<boolean> => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No user logged in');
      return false;
    }

    const { error } = await supabase
      .from('saved_jobs')
      .insert({ 
        job_id: jobId, 
        user_id: user.id,
        saved_at: new Date().toISOString() 
      });

    return !error;
  } catch (error) {
    console.error('Error saving job:', error);
    return false;
  }
};

export const applyToJob = async (jobId: number): Promise<boolean> => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No user logged in');
      return false;
    }

    const { error } = await supabase
      .from('job_applications')
      .insert({ 
        job_id: jobId, 
        user_id: user.id,
        applied_at: new Date().toISOString(),
        status: 'started'
      });

    return !error;
  } catch (error) {
    console.error('Error applying to job:', error);
    return false;
  }
};
