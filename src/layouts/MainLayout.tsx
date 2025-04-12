
import { ReactNode, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import Sidebar from "@/components/Sidebar";
import { Loader2 } from "lucide-react";
import { getCurrentUser, getSession, supabase } from "@/lib/supabase";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First check for hash params in URL (specific check for Supabase auth hash)
        if (window.location.hash && (
            window.location.hash.includes('access_token') || 
            window.location.hash.includes('error_description')
        )) {
          console.log("Auth hash parameters detected");
          try {
            // Let Supabase handle the auth parameters
            const { data, error } = await supabase.auth.getUser();
            
            if (data?.user && !error) {
              console.log("User authenticated from hash params");
              // Remove the hash to clean the URL
              window.history.replaceState(
                {}, 
                document.title, 
                window.location.pathname
              );
              
              setLoading(false);
              return;
            } else if (error) {
              console.error("Auth hash processing error:", error);
              navigate("/login", { replace: true });
              return;
            }
          } catch (hashError) {
            console.error("Error processing auth hash:", hashError);
          }
        }
        
        // If no hash or hash processing failed, check for session
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
        navigate("/login", { replace: true });
      }
    };
    
    checkAuth();
  }, [navigate, location]);
  
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
