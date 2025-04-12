
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { signInWithEmail, getSession } from "@/lib/supabase";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);
    
    try {
      console.log("Attempting login with email:", email);
      const { data, error } = await signInWithEmail(email, password);
      
      if (error) {
        console.error("Login error:", error);
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        console.log("Login successful, user data:", data.user ? "User exists" : "No user");
        toast({
          title: "Login successful",
          description: "Welcome back to JobMatch!",
        });
        
        // Double-check we have a valid session before navigating
        const session = await getSession();
        console.log("Post-login session check:", session ? "Session exists" : "No session");
        
        if (session) {
          console.log("Navigating to dashboard after successful login");
          navigate("/dashboard");
        } else {
          console.error("Session validation failed after login");
          toast({
            title: "Session Error",
            description: "Unable to establish a session. Please try again.",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error("Unexpected login error:", error);
      toast({
        title: "Login error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Ensure event propagation is stopped for button clicks
  const handleButtonClick = (e) => {
    e.stopPropagation();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <a href="#" className="text-sm text-primary hover:underline">
            Forgot password?
          </a>
        </div>
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
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
};

export default LoginForm;
