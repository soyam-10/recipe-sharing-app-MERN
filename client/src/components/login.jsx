import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "../api"; // Adjust the path as needed
import { toast } from "sonner";
import { useAtom } from "jotai";
import { sessionAtom } from "@/atoms/session";
import flame from "./flame.png"
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [, setSession] = useAtom(sessionAtom);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const response = await api.post("/users/login", { email, password });
      console.table(response.data); // Handle login response

      // Save session data to localStorage
      localStorage.setItem("session", JSON.stringify(response.data));

      // Set session in state
      setSession(response.data);

      if (response.data.user.role == "admin") {
        toast.success(`Welcome ADMIN ${response.data.user.fullName}`);
        navigate("/adminDashboard");
      } else {
        toast.success(`Login success ${response.data.user.fullName}`);
        navigate("/"); // Redirect to home page on successful login
      }
    } catch (err) {
      setError("Invalid credentials. Please try again.");
      console.error(err);
    }
  };

  return (
    <>
      <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
        <div className="flex items-center justify-center py-12">
          <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
              <h1 className="text-3xl font-bold">Login</h1>
              <p className="text-balance text-muted-foreground">
                Enter your email below to login to your account
              </p>
            </div>
            <form className="grid gap-4" onSubmit={handleLogin}>
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
              <Button variant="outline" className="w-full">
                Login with Google
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="underline">
                Sign up
              </Link>
            </div>
          </div>
        </div>
        <div className="hidden bg-muted lg:block">
          <img
            src={flame}
            alt="Image"
            className="h-full w-full object-fit dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      </div>
    </>
  );
}
