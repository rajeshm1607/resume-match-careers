
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import Resume from "./pages/Resume";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import UploadJobs from "./pages/admin/UploadJobs";

function App() {
  return (
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
  );
}

export default App;
