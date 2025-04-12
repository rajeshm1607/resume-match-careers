
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bbyiwqrtxmkvaowishxp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJieWl3cXJ0eG1rdmFvd2lzaHhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0ODY3MTYsImV4cCI6MjA2MDA2MjcxNn0.rSQbYG8EigZ_C2S3Yrb7yIbHiotyx-XeW_4tc5FA610';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Get the deployed URL or fallback to current origin
const getRedirectUrl = () => {
  // Get the actual current URL's origin
  const currentOrigin = window.location.origin;
  
  // Prevent localhost redirects in production
  if (currentOrigin.includes('localhost') || currentOrigin.includes('127.0.0.1')) {
    console.log("Local development detected, using current origin for redirect");
    return `${currentOrigin}/dashboard`;
  }
  
  // For deployed environments, use the current origin
  const redirectTo = `${currentOrigin}/dashboard`;
  console.log("Redirect URL:", redirectTo);
  return redirectTo;
};

// Auth helpers
export const signInWithGoogle = async () => {
  const redirectTo = getRedirectUrl();
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectTo,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      }
    }
  });
  
  return { data, error };
};

export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  return { data, error };
};

export const signUp = async (email: string, password: string) => {
  const redirectTo = getRedirectUrl();
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectTo
    }
  });
  
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Add function to get session
export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error getting session:', error);
    return null;
  }
  return data.session;
};

// Add listener for auth state changes
export const setupAuthListener = (callback: (event: string, session: any) => void) => {
  return supabase.auth.onAuthStateChange(callback);
};
