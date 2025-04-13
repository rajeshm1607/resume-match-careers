
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSession } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        setIsLoading(true);
        const session = await getSession();
        console.log("Session check on Index page:", session ? "User logged in" : "No session");
        
        if (session) {
          navigate("/dashboard");
        } else {
          console.log("Redirecting to login from Index");
          navigate("/login");
        }
      } catch (error) {
        console.error("Session check error:", error);
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return null;
};

export default Index;
