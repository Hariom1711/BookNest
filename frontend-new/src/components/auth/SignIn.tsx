// src/components/auth/SignIn.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,

} from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Use auth context to login
      await login(email, password);
      
      toast.success("Sign in successful!", {
        description: "Welcome back to BookNest",
      });
      
      // Redirect to dashboard after successful login
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Sign in failed", {
        description: "Invalid email or password. Please try again.",
        action: {
          label: "Retry",
          onClick: () => {
            // Focus on password field and clear it
            const passwordInput = document.getElementById("password") as HTMLInputElement;
            if (passwordInput) {
              passwordInput.focus();
              setPassword("");
            }
          },
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <Card className="w-[400px] bg-zinc-900 border-zinc-800 text-white">
        <CardHeader className="space-y-1 items-center text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
              <span className="text-white text-xl">B</span>
            </div>
            <h2 className="text-2xl font-bold ml-2">BookNest</h2>
          </div>
          {/* <CardTitle className="text-2xl">Sign in</CardTitle> */}
          <CardDescription className="text-zinc-400">
          Manage your library experience seamlessly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-zinc-400">
                  Email
                </label>
                <Input
                  id="email"
                  placeholder="Your email address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-zinc-400">
                  Password
                </label>
                <Input
                  id="password"
                  placeholder="Enter your password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-zinc-400">
            No account yet?{" "}
            <a 
              className="text-purple-400 hover:text-purple-300 cursor-pointer"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}