import React, { useState } from "react";
import { User } from "lucide-react";
import { apiService } from "./api";


interface UserLoginPageProps {
  onUserLogin: (token: string) => void;
}

export const UserLoginPage: React.FC<UserLoginPageProps> = ({ onUserLogin }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUserAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = isLoginMode 
        ? await apiService.loginUser(email, password)
        : await apiService.registerUser(email, password, fullName);

      if (data.success) {
        if (isLoginMode && data.token) {
          localStorage.setItem("userAuthToken", data.token);
          onUserLogin(data.token);
        } else if (!isLoginMode) {
          setError("Registration successful! Please login.");
          setIsLoginMode(true);
        }
      } else {
        setError(data.message || "Authentication failed");
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError(`Network error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1B3C53] to-[#456882] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-[#1B3C53] to-[#456882] rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-[#F9F3EF]" />
          </div>
          <h1 className="text-2xl font-bold text-[#1B3C53]">
            {isLoginMode ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-[#456882] mt-2">
            {isLoginMode ? "Sign in to manage your devices" : "Register to get started"}
          </p>
        </div>

        <form onSubmit={handleUserAuth} className="space-y-6">
          {!isLoginMode && (
            <div>
              <label className="block text-sm font-medium text-[#1B3C53] mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 border border-[#D2C1B6] rounded-lg bg-[#F9F3EF] text-[#1B3C53] focus:ring-2 focus:ring-[#456882] focus:border-transparent"
                placeholder="Enter your full name"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#1B3C53] mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-[#D2C1B6] rounded-lg bg-[#F9F3EF] text-[#1B3C53] focus:ring-2 focus:ring-[#456882] focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1B3C53] mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-[#D2C1B6] rounded-lg bg-[#F9F3EF] text-[#1B3C53] focus:ring-2 focus:ring-[#456882] focus:border-transparent"
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <div className={`border px-4 py-3 rounded-lg text-sm ${
              error.includes("successful") 
                ? "bg-green-50 border-green-200 text-green-700" 
                : "bg-red-50 border-red-200 text-red-700"
            }`}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#1B3C53] to-[#456882] hover:from-[#456882] hover:to-[#1B3C53] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50"
          >
            {loading ? (isLoginMode ? "Signing In..." : "Registering...") : (isLoginMode ? "Sign In" : "Register")}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLoginMode(!isLoginMode);
              setError("");
            }}
            className="text-[#1B3C53] hover:text-[#456882] font-medium transition-colors"
          >
            {isLoginMode ? "Need an account? Register" : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};