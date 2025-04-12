
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import Resume from "./pages/Resume";
import Settings from "./pages/Settings.jsx";
import NotFound from "./pages/NotFound.jsx";
import { getSession, supabase } from "./lib/supabase";
import { useToast } from "./components/ui/use-toast.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        
        if (window.location.hash && window.location.hash.includes('access_token')) {
          console.log("App detected auth hash parameters in ProtectedRoute");
          try {
            const { data, error } = await supabase.auth.getUser();
            if (data?.user && !error) {
              console.log("User authenticated via hash in ProtectedRoute");
              setIsAuthenticated(true);
              window.history.replaceState({}, document.title, window.location.pathname);
              setIsLoading(false);
              return;
            }
          } catch (error) {
            console.error("Error processing auth hash:", error);
          }
        }
        
        const session = await getSession();
        if (session) {
          console.log("Valid session found in ProtectedRoute");
          setIsAuthenticated(true);
        } else {
          console.log("No valid session found in ProtectedRoute");
          setIsAuthenticated(false);
          toast({
            title: "Authentication Required",
            description: "Please log in to access this page",
          });
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [location.pathname, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

const App = () => {
  useEffect(() => {
    const handleInitialAuthState = async () => {
      if (window.location.hash && window.location.hash.includes('access_token')) {
        console.log("App detected auth hash parameters on initial load");
        try {
          const { data, error } = await supabase.auth.getSession();
          console.log("Initial session check:", data?.session ? "Session exists" : "No session", error ? `Error: ${error.message}` : "No error");
        } catch (err) {
          console.error("Error checking initial session:", err);
        }
      }
    };
    
    handleInitialAuthState();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state change:", event);
      
      if (event === 'SIGNED_IN') {
        console.log("User signed in, session:", session ? "Session exists" : "No session");
        
        if (window.location.hash && window.location.hash.includes('access_token')) {
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/jobs" element={
              <ProtectedRoute>
                <Jobs />
              </ProtectedRoute>
            } />
            <Route path="/resume" element={
              <ProtectedRoute>
                <Resume />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
