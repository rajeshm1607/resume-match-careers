
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import Resume from "./pages/Resume";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { getSession, supabase } from "./lib/supabase";
import { useToast } from "./components/ui/use-toast";

const queryClient = new QueryClient();

// Protected route component
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
        
        // Handle auth hash parameters if present
        if (window.location.hash && window.location.hash.includes('access_token')) {
          try {
            // Let Supabase handle the hash parameters 
            const { data, error } = await supabase.auth.getUser();
            if (data?.user && !error) {
              setIsAuthenticated(true);
              // Clean up URL
              window.history.replaceState({}, document.title, window.location.pathname);
              setIsLoading(false);
              return;
            }
          } catch (error) {
            console.error("Error processing auth hash:", error);
          }
        }
        
        // Check for active session
        const session = await getSession();
        if (session) {
          console.log("Valid session found");
          setIsAuthenticated(true);
        } else {
          console.log("No valid session found");
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

  // Wait for authentication check to complete
  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    // User is not authenticated, redirect to login with return path
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // User is authenticated, render the protected component
  return children;
};

const App = () => {
  // Handle initial auth flow and setup auth event listeners
  useEffect(() => {
    // Process initial auth hash if present
    if (window.location.hash && window.location.hash.includes('access_token')) {
      console.log("App detected auth hash parameters");
      // Let Supabase handle the auth redirect
      supabase.auth.getSession();
    }
    
    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state change:", event);
      
      // Reload the session when auth state changes
      if (event === 'SIGNED_IN') {
        console.log("User signed in, session:", session);
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
