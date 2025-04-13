import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { getCurrentUser } from "@/lib/supabase";

// Import our new components
import AuthLayout from "@/components/auth/AuthLayout";
import AuthCard from "@/components/auth/AuthCard.jsx";
import LoginForm from "@/components/auth/LoginForm.jsx";
import GoogleButton from "@/components/auth/GoogleButton.jsx";
import AuthDivider from "@/components/auth/AuthDivider";
import AuthError from "@/components/auth/AuthError.jsx";
import AuthFooter from "@/components/auth/AuthFooter.jsx";

const Login = () => {
  const [googleDisabled, setGoogleDisabled] = useState(false);
  const [providerError, setProviderError] = useState("");
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const user = await getCurrentUser();
      if (user) {
        navigate("/dashboard");
      }
    };
    
    checkUser();
    
    // Remove any stored auth errors on fresh login page load
    if (localStorage.getItem("auth_provider_error")) {
      localStorage.removeItem("auth_provider_error");
      setProviderError("");
      setGoogleDisabled(false);
    }
  }, [navigate]);

  // Check localStorage for previous provider errors
  useEffect(() => {
    const savedProviderError = localStorage.getItem("auth_provider_error");
    if (savedProviderError === "google") {
      setGoogleDisabled(true);
      setProviderError("Google login is not available. Please sign in with email and password.");
    }
  }, []);

  const handleGoogleLoginError = (message) => {
    setGoogleDisabled(true);
    setProviderError(message);
  };

  return (
    <AuthLayout>
      <AuthCard
        title="Sign In"
        description="Enter your credentials to access your account"
        footer={
          <AuthFooter 
            message="Don't have an account?" 
            linkText="Sign up" 
            linkPath="/signup"
          />
        }
      >
        <AuthError message={providerError} />
        
        <LoginForm />
        
        {!googleDisabled && (
          <>
            <AuthDivider />
            <GoogleButton onGoogleLoginError={handleGoogleLoginError} />
          </>
        )}
      </AuthCard>
    </AuthLayout>
  );
};

export default Login;
