import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { FcGoogle } from "react-icons/fc";
import { signUp, signInWithGoogle, getCurrentUser } from "@/lib/supabase";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import GoogleButton from "@/components/auth/GoogleButton.jsx";
import LoginForm from "@/components/auth/LoginForm.jsx";
import AuthFooter from "@/components/auth/AuthFooter.jsx";
import AuthError from "@/components/auth/AuthError.jsx";
import AuthDivider from "@/components/auth/AuthDivider.jsx";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleDisabled, setGoogleDisabled] = useState(false);
  const [providerError, setProviderError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      const user = await getCurrentUser();
      if (user) {
        navigate("/dashboard");
      }
    };
    
    checkUser();
    
    if (localStorage.getItem("auth_provider_error")) {
      localStorage.removeItem("auth_provider_error");
      setProviderError("");
      setGoogleDisabled(false);
    }
  }, [navigate]);

  useEffect(() => {
    const savedProviderError = localStorage.getItem("auth_provider_error");
    if (savedProviderError === "google") {
      setGoogleDisabled(true);
      setProviderError("Google signup is not available. Please create an account with email and password.");
    }
  }, []);

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);
    
    try {
      const { data, error } = await signUp(email, password);
      
      if (error) {
        toast({
          title: "Signup failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Account created",
          description: data?.user?.email ? 
            "Please check your email to verify your account." : 
            "Welcome to JobMatch!",
        });
        
        if (data?.user && !data?.session) {
          navigate("/dashboard");
        }
      }
    } catch (error) {
      toast({
        title: "Signup error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setGoogleLoading(true);
    
    try {
      const { data, error } = await signInWithGoogle();
      
      if (error) {
        if (error.message.includes("Unsupported provider") || error.message.includes("provider is not enabled")) {
          localStorage.setItem("auth_provider_error", "google");
          
          toast({
            title: "Google signup unavailable",
            description: "Google signup is not properly configured. Please sign up with email and password.",
            variant: "destructive"
          });
          setGoogleDisabled(true);
          setProviderError("Google signup is not available. Please create an account with email and password.");
        } else {
          toast({
            title: "Google signup failed",
            description: error.message,
            variant: "destructive"
          });
        }
        setGoogleLoading(false);
      }
      if (data?.user && !data?.session) {
        navigate("/dashboard");
      }
    } catch (error) {
      toast({
        title: "Signup error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
            <span className="bg-primary text-white p-2 rounded">Job</span>
            <span>Match</span>
          </h1>
          <p className="text-gray-600 mt-2">Your intelligent job matching platform</p>
        </div>
        
        <Card className="shadow-lg animate-fade-in">
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>Sign up to access JobMatch</CardDescription>
          </CardHeader>
          <CardContent>
            {providerError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {providerError}
                </AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
                onClick={handleButtonClick}
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
            
            {!googleDisabled && (
              <>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>
                
                <GoogleButton
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleSignup}
                  disabled={googleLoading}
                />
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-primary hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigate("/login");
                }}
              >
                Sign in
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
