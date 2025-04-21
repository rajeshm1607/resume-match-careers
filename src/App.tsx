
import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import Resume from "./pages/Resume";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import UploadJobs from "./pages/admin/UploadJobs";

// Create a QueryClient with proper configuration - defined outside the component to ensure singleton
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false, // Disable refetch on window focus for better UX
      refetchOnMount: true, // Ensure data is fresh when component mounts
      refetchOnReconnect: true, // Refetch on reconnect
    },
  },
  logger: {
    log: (message) => {
      console.log(`[React Query]: ${message}`);
    },
    warn: (message) => {
      console.warn(`[React Query Warning]: ${message}`);
    },
    error: (message) => {
      console.error(`[React Query Error]: ${message}`);
    },
  },
});

console.log("App.tsx: QueryClient initialized with ID:", queryClient.getQueryCache().config.queryHash);

function App() {
  console.log("App.tsx: Rendering App component with QueryClient:", !!queryClient);
  return (
    <QueryClientProvider client={queryClient}>
      <div className="debug-info" style={{ display: 'none' }} data-debug="true" data-query-client-id={queryClient.getQueryCache().config.queryHash}>
        {/* Hidden debug element to help identify QueryClient in React DevTools */}
      </div>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/admin/upload-jobs" element={<UploadJobs />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
