
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bbyiwqrtxmkvaowishxp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJieWl3cXJ0eG1rdmFvd2lzaHhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0ODY3MTYsImV4cCI6MjA2MDA2MjcxNn0.rSQbYG8EigZ_C2S3Yrb7yIbHiotyx-XeW_4tc5FA610';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true, // Enable detection of OAuth grants in URL
    flowType: 'implicit', // Use implicit flow for better redirect handling
  }
});

// Get the deployed URL or fallback to current origin
const getRedirectUrl = () => {
  // Get the current origin - this will be the preview or production URL in those environments
  const currentOrigin = window.location.origin;
  console.log("Current origin for redirect:", currentOrigin);
  
  // Always use the current origin for redirects
  const redirectUrl = `${currentOrigin}/dashboard`;
  console.log("Using redirect URL:", redirectUrl);
  return redirectUrl;
};

// Auth helpers
export const signInWithGoogle = async () => {
  const redirectTo = getRedirectUrl();
  console.log("Google sign-in redirect URL:", redirectTo);
  
  // Make sure we're explicitly setting the redirectTo parameter
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectTo,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
      skipBrowserRedirect: false, // Ensure browser redirect happens automatically
    }
  });
  
  console.log("Google sign-in initiated:", data ? "Success" : "Failed", error);
  return { data, error };
};

export const signInWithEmail = async (email, password) => {
  console.log("Attempting to sign in with email:", email);
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  console.log("Sign in result:", data ? "Success" : "Failed", error);
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

// Get session
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
