
import { ReactNode, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import Sidebar from "@/components/Sidebar";
import { Loader2 } from "lucide-react";
import { getCurrentUser, getSession, supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Process auth redirect hash if present
        if (window.location.hash && (
            window.location.hash.includes('access_token') || 
            window.location.hash.includes('error_description')
        )) {
          console.log("Auth hash parameters detected");
          try {
            // Let Supabase handle the auth parameters
            const { data, error } = await supabase.auth.getUser();
            
            if (error) {
              console.error("Auth hash processing error:", error);
              toast({
                title: "Authentication Error",
                description: "Failed to process login information. Please try again.",
                variant: "destructive"
              });
              navigate("/login", { replace: true });
              return;
            } else if (data?.user) {
              console.log("User authenticated from hash params");
              // Clean up the URL
              window.history.replaceState({}, document.title, window.location.pathname);
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
          console.log("No active session found, redirecting to login");
          navigate("/login", { replace: true });
          return;
        }
        
        console.log("Valid session found");
        setLoading(false);
      } catch (error) {
        console.error("Authentication check error:", error);
        toast({
          title: "Authentication Error",
          description: "Please log in again to continue.",
          variant: "destructive"
        });
        navigate("/login", { replace: true });
      }
    };
    
    checkAuth();
  }, [navigate, location, toast]);

  // Monitor auth state changes
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          navigate("/login", { replace: true });
        } else if (event === 'SIGNED_IN' && session) {
          setLoading(false);
        }
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
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
