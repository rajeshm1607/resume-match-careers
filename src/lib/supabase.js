
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bbyiwqrtxmkvaowishxp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJieWl3cXJ0eG1rdmFvd2lzaHhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0ODY3MTYsImV4cCI6MjA2MDA2MjcxNn0.rSQbYG8EigZ_C2S3Yrb7yIbHiotyx-XeW_4tc5FA610';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Get the deployed URL or fallback to current origin
const getRedirectUrl = () => {
  // Get the current origin - this will be the preview or production URL in those environments
  const currentOrigin = window.location.origin;
  
  // Make sure we're not using localhost in preview/production environments
  if (currentOrigin.includes('localhost')) {
    // For local development
    return `${currentOrigin}/dashboard`;
  } else {
    // For preview/production environments
    console.log("Using deployed redirect URL:", `${currentOrigin}/dashboard`);
    return `${currentOrigin}/dashboard`;
  }
};

// Auth helpers
export const signInWithGoogle = async () => {
  const redirectTo = getRedirectUrl();
  console.log("Google sign-in redirect URL:", redirectTo);
  
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

export const signInWithEmail = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  return { data, error };
};

export const signUp = async (email, password) => {
  const redirectTo = getRedirectUrl();
  console.log("Sign-up redirect URL:", redirectTo);
  
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
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error getting session:', error);
      return null;
    }
    console.log("Session check result:", data.session ? "Session exists" : "No session");
    return data.session;
  } catch (err) {
    console.error("Unexpected error getting session:", err);
    return null;
  }
};

// Add listener for auth state changes
export const setupAuthListener = (callback) => {
  return supabase.auth.onAuthStateChange(callback);
};
