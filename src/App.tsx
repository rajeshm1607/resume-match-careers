
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
import { getCurrentUser, getSession, supabase } from "./lib/supabase";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First check for hash params in URL
        if (window.location.hash && window.location.hash.includes('access_token')) {
          console.log("ProtectedRoute detected auth hash");
          // Auth hash parameters exist, let Supabase handle them
          const { data, error } = await supabase.auth.getUser();
          if (data?.user && !error) {
            setIsAuthenticated(true);
            // Clean up URL by removing hash
            window.history.replaceState(
              {}, 
              document.title, 
              window.location.pathname
            );
            return;
          } else {
            console.log("Auth hash processing failed:", error);
          }
        }
        
        // Try to get current session
        const session = await getSession();
        if (session) {
          console.log("ProtectedRoute found valid session");
          setIsAuthenticated(true);
          return;
        }

        // If we get here, user is not authenticated
        console.log("ProtectedRoute: No auth detected, redirecting to login");
        setIsAuthenticated(false);
      } catch (error) {
        console.error("Auth check error in ProtectedRoute:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [location.pathname]);

  if (isAuthenticated === null) {
    // Still loading, don't render anything yet
    return null;
  }

  if (!isAuthenticated) {
    // User is not authenticated, redirect to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated, render the protected component
  return children;
};

const App = () => {
  // Handle initial auth flow
  useEffect(() => {
    // This runs once on app initialization
    const handleInitialAuth = async () => {
      if (window.location.hash && window.location.hash.includes('access_token')) {
        // We have auth hash parameters, let Supabase handle them
        console.log("App detected auth hash parameters");
        await supabase.auth.getUser();
      }
    };
    
    handleInitialAuth();
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
