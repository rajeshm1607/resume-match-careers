
import { ReactNode, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import Sidebar from "@/components/Sidebar";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

const MainLayout = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  
  useEffect(() => {
    // First, set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state change in MainLayout:", event);
        
        if (event === 'SIGNED_OUT') {
          setAuthenticated(false);
          navigate("/login", { replace: true });
        } else if (event === 'SIGNED_IN' && session) {
          console.log("User signed in, setting authenticated state");
          setAuthenticated(true);
          
          // Use setTimeout to avoid React Query initialization issues
          // This ensures all necessary providers are properly set up
          setTimeout(() => {
            navigate("/dashboard", { replace: true });
          }, 300); // Increased timeout for React Query initialization
        }
      }
    );
    
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        if (!data.session) {
          console.log("No session in MainLayout, redirecting to login");
          setAuthenticated(false);
          setLoading(false);
          
          if (!['/login', '/signup'].includes(location.pathname)) {
            navigate("/login", { replace: true });
          }
          return;
        }
        
        console.log("Session found in MainLayout, user is authenticated");
        setAuthenticated(true);
        setLoading(false);
      } catch (error) {
        console.error("Authentication check error in MainLayout:", error);
        setAuthenticated(false);
        setLoading(false);
        
        if (!['/login', '/signup'].includes(location.pathname)) {
          navigate("/login", { replace: true });
        }
      }
    };
    
    // Now check for auth after setting up listener
    checkAuth();
    
    return () => {
      subscription?.unsubscribe();
    };
  }, [navigate, location.pathname]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
