
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
        // First check for hash params in URL
        if (window.location.hash && window.location.hash.includes('access_token')) {
          // Auth hash parameters exist, let Supabase handle them
          const { data, error } = await supabase.auth.getUser();
          if (data?.user && !error) {
            // Clean up URL by removing hash
            window.history.replaceState({}, document.title, window.location.pathname);
            setLoading(false);
            return;
          }
        }
        
        // Try to get current session
        const session = await getSession();
        if (!session) {
          navigate("/login", { replace: true });
          return;
        }
        
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
