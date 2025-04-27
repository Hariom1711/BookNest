// src/components/auth/SignUp.tsx
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
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Use auth context to register
      await register(name, email, password);
      
      toast.success("Account created successfully!", {
        description: "You can now sign in with your credentials",
      });
      
      // Redirect to sign in page after successful registration
      navigate("/signin");
    } catch (error: any) {
      console.error("Registration error:", error);
      
      // Handle different error responses
      const errorMessage = error.response?.data?.message || 
                          "Failed to create account. Please try again.";
      
      toast.error("Registration failed", {
        description: errorMessage,
        action: {
          label: "Retry",
          onClick: () => {
            // Keep form data for retry
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
          {/* <CardTitle className="text-2xl">Create an account</CardTitle> */}
          <CardDescription className="text-zinc-400">
          Manage your library experience seamlessly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-zinc-400">
                  Full Name
                </label>
                <Input
                  id="name"
                  placeholder="Your full name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
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
                  placeholder="Create a strong password"
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
                {isLoading ? "Creating account..." : "Sign up"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-zinc-400">
            Already have an account?{" "}
            <a 
              className="text-purple-400 hover:text-purple-300 cursor-pointer"
              onClick={() => navigate("/signin")}
            >
              Sign in
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}