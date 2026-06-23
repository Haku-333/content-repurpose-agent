import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/Button";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
    navigate("/");
  };

  return (
    <div className="bg-[#111111] border border-[#2A2A2A] rounded-sm p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
        <p className="text-[#A0A0A0] text-sm">Enter your credentials to access your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#A0A0A0] mb-1.5">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-sm px-3 py-2 text-white placeholder:text-[#666666] focus:outline-none focus:border-[#3A3A3A] focus:ring-1 focus:ring-[#3A3A3A] transition-colors"
            placeholder="name@company.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[#A0A0A0] mb-1.5">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-sm px-3 py-2 text-white placeholder:text-[#666666] focus:outline-none focus:border-[#3A3A3A] focus:ring-1 focus:ring-[#3A3A3A] transition-colors"
            placeholder="••••••••"
          />
        </div>

        <Button type="submit" className="w-full mt-6 bg-white text-black hover:bg-gray-200">
          Sign In
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-[#A0A0A0]">
        Don't have an account?{" "}
        <Link to="/signup" className="text-white hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );
}
