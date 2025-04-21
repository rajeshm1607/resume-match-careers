
import { ReactNode, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import Sidebar from "@/components/Sidebar";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const MainLayout = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const queryClient = useQueryClient();
  
  // Set to true for detailed debugging information
  const DEBUG = true;
  
  useEffect(() => {
    console.log("MainLayout - Component mounting, checking auth...", {
      path: location.pathname,
      queryClient: !!queryClient
    });
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log(`MainLayout - Auth state changed: ${event}`, {
          hasSession: !!session,
          path: location.pathname
        });
        
        if (event === 'SIGNED_OUT') {
          console.log("MainLayout - User signed out, redirecting to login");
          setAuthenticated(false);
          // Invalidate all queries when signing out to prevent stale data issues
          if (queryClient) {
            queryClient.clear();
          }
          navigate("/login", { replace: true });
        } else if (event === 'SIGNED_IN' && session) {
          console.log("MainLayout - User signed in, setting authenticated state");
          setAuthenticated(true);
          setLoading(false);
          
          // Only navigate if we're not already on a protected route
          const isOnAuthPage = ['/login', '/signup', '/'].includes(location.pathname);
          if (isOnAuthPage) {
            // Use a delay to ensure React Query is properly initialized
            console.log("MainLayout - User on auth page, navigating to dashboard with delay");
            setTimeout(() => {
              navigate("/dashboard", { replace: true });
            }, 500);
          }
        }
      }
    );
    
    // Check for existing session
    const checkAuth = async () => {
      try {
        console.log("MainLayout - Checking auth status...");
        const { data } = await supabase.auth.getSession();
        
        if (!data.session) {
          console.log("MainLayout - No session found, user is not authenticated");
          setAuthenticated(false);
          setLoading(false);
          
          if (!['/login', '/signup', '/'].includes(location.pathname)) {
            console.log(`MainLayout - Redirecting from ${location.pathname} to login`);
            navigate("/login", { replace: true });
          }
          return;
        }
        
        console.log("MainLayout - Session found, user is authenticated");
        setAuthenticated(true);
        setLoading(false);
      } catch (error) {
        console.error("MainLayout - Authentication check error:", error);
        setAuthenticated(false);
        setLoading(false);
        
        if (!['/login', '/signup', '/'].includes(location.pathname)) {
          navigate("/login", { replace: true });
        }
      }
    };
    
    checkAuth();
    
    // Debug any query client issues
    if (DEBUG && queryClient) {
      console.log("MainLayout - QueryClient check:", {
        exists: !!queryClient,
        // Safely access queries if queryClient exists and has a queryCache
        queries: queryClient && queryClient.getQueryCache() ? 
          Object.keys(queryClient.getQueryCache().queries || {}).length : 
          'N/A',
      });
    }
    
    return () => {
      console.log("MainLayout - Component unmounting");
      if (subscription) subscription.unsubscribe();
    };
  }, [navigate, location.pathname, queryClient]);
  
  if (loading) {
    console.log("MainLayout - Still loading, showing spinner");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // For authentication pages or the home page, don't require authentication
  if (!authenticated && ['/login', '/signup', '/'].includes(location.pathname)) {
    console.log(`MainLayout - Rendering non-authenticated route: ${location.pathname}`);
    return children;
  }

  // For other pages, require authentication
  if (!authenticated) {
    console.log(`MainLayout - Not authenticated, blocking access to: ${location.pathname}`);
    return null;
  }

  console.log(`MainLayout - Rendering authenticated layout for: ${location.pathname}`);
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
