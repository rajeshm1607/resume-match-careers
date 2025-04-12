
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
    // In a real app, you would make an API call to your serverless function 
    // that queries external job APIs like LinkedIn or Indeed.
    // For now, we'll simulate this with a Supabase query to a jobs table.

    // First check if we have stored jobs in Supabase
    let { data: storedJobs, error } = await supabase
      .from('jobs')
      .select('*');

    if (error || !storedJobs || storedJobs.length === 0) {
      // If we don't have stored jobs, use mock data
      return getMockJobs(query, filters, skills);
    }

    // Filter jobs based on query and filters
    // This would normally be done in the database query
    let filteredJobs = storedJobs as Job[];
    
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

    // Calculate match score if skills are provided
    if (skills.length > 0) {
      filteredJobs = filteredJobs.map(job => {
        const matchingSkills = skills.filter(skill => 
          job.skills.some(jobSkill => 
            jobSkill.toLowerCase().includes(skill.toLowerCase())
          )
        );
        
        const matchScore = Math.round((matchingSkills.length / skills.length) * 100);
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
    return [];
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
    const { error } = await supabase
      .from('saved_jobs')
      .insert({ job_id: jobId, saved_at: new Date().toISOString() });

    return !error;
  } catch (error) {
    console.error('Error saving job:', error);
    return false;
  }
};

export const applyToJob = async (jobId: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('job_applications')
      .insert({ job_id: jobId, applied_at: new Date().toISOString() });

    return !error;
  } catch (error) {
    console.error('Error applying to job:', error);
    return false;
  }
};
