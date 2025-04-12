
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { useToast } from "@/components/ui/use-toast";
import { signInWithGoogle } from "@/lib/supabase";

const GoogleButton = ({ onGoogleLoginError }) => {
  const [googleLoading, setGoogleLoading] = useState(false);
  const { toast } = useToast();

  const handleGoogleLogin = async (e) => {
    e.stopPropagation();
    setGoogleLoading(true);
    
    try {
      const { error } = await signInWithGoogle();
      
      if (error) {
        if (error.message.includes("Unsupported provider") || error.message.includes("provider is not enabled")) {
          // Save to localStorage to persist across pages
          localStorage.setItem("auth_provider_error", "google");
          
          toast({
            title: "Google login unavailable",
            description: "Google login is not properly configured. Please sign in with email and password.",
            variant: "destructive"
          });
          onGoogleLoginError("Google login is not available. Please sign in with email and password.");
        } else {
          toast({
            title: "Google login failed",
            description: error.message,
            variant: "destructive"
          });
        }
        setGoogleLoading(false);
      }
      // If no error, redirect will happen automatically
    } catch (error) {
      toast({
        title: "Login error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
      setGoogleLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={handleGoogleLogin}
      disabled={googleLoading}
    >
      <FcGoogle className="mr-2 h-5 w-5" />
      {googleLoading ? "Connecting to Google..." : "Google"}
    </Button>
  );
};

export default GoogleButton;
