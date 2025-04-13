
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSession } from "@/lib/supabase";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await getSession();
        if (session) {
          navigate("/dashboard");
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Session check error:", error);
        navigate("/login");
      }
    };
    
    checkSession();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
    </div>
  );
};

export default Index;
