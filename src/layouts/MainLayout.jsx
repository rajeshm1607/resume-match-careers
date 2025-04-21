
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
  
  // Debug flag for tracking render cycles
  const DEBUG = true;
  
  useEffect(() => {
    if (DEBUG) console.log("MainLayout useEffect running, path:", location.pathname);
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (DEBUG) console.log("Auth state change in MainLayout:", event, !!session);
        
        if (event === 'SIGNED_OUT') {
          setAuthenticated(false);
          // Invalidate all queries when signing out to prevent stale data issues
          queryClient.clear();
          navigate("/login", { replace: true });
        } else if (event === 'SIGNED_IN' && session) {
          if (DEBUG) console.log("User signed in, setting authenticated state");
          setAuthenticated(true);
          setLoading(false);
          
          // Only navigate if we're not already on a protected route
          const isOnAuthPage = ['/login', '/signup'].includes(location.pathname);
          if (isOnAuthPage) {
            // Use a small delay to ensure React Query is properly initialized
            setTimeout(() => {
              navigate("/dashboard", { replace: true });
            }, 100);
          }
        }
      }
    );
    
    // Check for existing session
    const checkAuth = async () => {
      try {
        if (DEBUG) console.log("Checking auth status in MainLayout...");
        const { data } = await supabase.auth.getSession();
        
        if (!data.session) {
          if (DEBUG) console.log("No session in MainLayout, redirecting to login");
          setAuthenticated(false);
          setLoading(false);
          
          if (!['/login', '/signup', '/'].includes(location.pathname)) {
            navigate("/login", { replace: true });
          }
          return;
        }
        
        if (DEBUG) console.log("Session found in MainLayout, user is authenticated");
        setAuthenticated(true);
        setLoading(false);
      } catch (error) {
        console.error("Authentication check error in MainLayout:", error);
        setAuthenticated(false);
        setLoading(false);
        
        if (!['/login', '/signup', '/'].includes(location.pathname)) {
          navigate("/login", { replace: true });
        }
      }
    };
    
    checkAuth();
    
    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, [navigate, location.pathname, queryClient]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // For authentication pages or the home page, don't require authentication
  if (!authenticated && ['/login', '/signup', '/'].includes(location.pathname)) {
    return children;
  }

  // For other pages, require authentication
  if (!authenticated) {
    return null;
  }

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
