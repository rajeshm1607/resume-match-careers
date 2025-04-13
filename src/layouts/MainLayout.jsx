
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import Sidebar from "@/components/Sidebar";
import { Loader2 } from "lucide-react";
import { getSession, supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

const MainLayout = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        
        // Check for active session
        const session = await getSession();
        if (!session) {
          console.log("No active session found in MainLayout");
          setAuthenticated(false);
          navigate("/login");
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
        navigate("/login");
      }
    };
    
    checkAuth();
  }, [location.pathname, navigate]);

  // Monitor auth state changes
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state change in MainLayout:", event);
        
        if (event === 'SIGNED_OUT') {
          setAuthenticated(false);
          navigate("/login");
        } else if (event === 'SIGNED_IN' && session) {
          setAuthenticated(true);
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

  // No longer redirecting here as we already redirect in the useEffect
  // This prevents a potential redirect loop
  if (!authenticated) {
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
