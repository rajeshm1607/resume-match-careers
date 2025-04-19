
import { supabase } from '@/lib/supabase';

export interface ParsedResume {
  skills: string[];
  experience: string[];
  education: string[];
  jobTitles: string[];
  userId?: string;
}

export interface ResumeUploadResponse {
  success: boolean;
  data?: ParsedResume;
  error?: string;
}

export const uploadAndParseResume = async (file: File): Promise<ResumeUploadResponse> => {
  try {
    // Upload file to Supabase Storage
    const fileName = `${Date.now()}_${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('resumes')
      .upload(`public/${fileName}`, file);

    if (uploadError) {
      console.error('Error uploading resume:', uploadError);
      return { success: false, error: 'Failed to upload resume' };
    }

    // For now, we'll simulate parsing with mock data
    // In a real app, you would call a serverless function to parse the resume
    const mockParsedData: ParsedResume = {
      skills: ['JavaScript', 'React', 'TypeScript', 'UI/UX Design', 'Project Management', 'Agile'],
      experience: ['Frontend Developer', 'UI Designer', 'Product Manager'],
      education: ['Computer Science Degree', 'UX Design Certificate'],
      jobTitles: ['Frontend Developer', 'React Developer', 'UI Designer'],
    };

    // Store the parsed data in Supabase
    const { data: resumeData, error: resumeError } = await supabase
      .from('parsed_resumes')
      .insert({
        file_path: uploadData?.path,
        parsed_data: mockParsedData,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (resumeError) {
      console.error('Error storing parsed resume data:', resumeError);
      return { success: false, error: 'Failed to store resume data' };
    }

    return { success: true, data: mockParsedData };
  } catch (error) {
    console.error('Resume upload and parsing error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
};

// Updated to make it compatible with React Query - removed the optional userId parameter
export const getLatestParsedResume = async (): Promise<ParsedResume | null> => {
  try {
    // In a real app, you'd filter by user ID
    const { data, error } = await supabase
      .from('parsed_resumes')
      .select('parsed_data')
      .order('created_at', { ascending: false })
      .limit(1);

    if (error || !data || data.length === 0) {
      console.error('Error fetching parsed resume:', error);
      return null;
    }

    return data[0].parsed_data as ParsedResume;
  } catch (error) {
    console.error('Fetch parsed resume error:', error);
    return null;
  }
};
