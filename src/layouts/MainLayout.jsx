
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import Sidebar from "@/components/Sidebar";
import { Loader2 } from "lucide-react";
import { getSession, supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

const MainLayout = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const location = useLocation();
  const { toast } = useToast();
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        
        // Process auth redirect hash if present
        if (window.location.hash && (
            window.location.hash.includes('access_token') || 
            window.location.hash.includes('error_description')
        )) {
          console.log("Auth hash parameters detected in MainLayout");
          try {
            const { data, error } = await supabase.auth.getUser();
            
            if (error) {
              console.error("Auth hash processing error:", error);
              setAuthenticated(false);
              setLoading(false);
              return;
            } else if (data?.user) {
              console.log("User authenticated from hash params");
              // Clean up the URL
              window.history.replaceState({}, document.title, window.location.pathname);
              setAuthenticated(true);
              setLoading(false);
              return;
            }
          } catch (hashError) {
            console.error("Error processing auth hash:", hashError);
          }
        }
        
        // Check for active session
        const session = await getSession();
        if (!session) {
          console.log("No active session found");
          setAuthenticated(false);
          setLoading(false);
          return;
        }
        
        console.log("Valid session found in MainLayout");
        setAuthenticated(true);
        setLoading(false);
      } catch (error) {
        console.error("Authentication check error:", error);
        setAuthenticated(false);
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [location]);

  // Monitor auth state changes
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state change in MainLayout:", event);
        
        if (event === 'SIGNED_OUT') {
          setAuthenticated(false);
        } else if (event === 'SIGNED_IN' && session) {
          console.log("User signed in with session in MainLayout");
          setAuthenticated(true);
        }
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!authenticated) {
    return <Navigate to="/login" />;
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
