"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;
      if (!data?.user) throw new Error("Login failed");

      router.push("/protected");
    } catch (err: any) {
      setError(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main 
      className="min-h-screen flex flex-col" 
      style={{ background: "linear-gradient(135deg, #1b2e6b, #f97316)" }}
    >
      {/* Top Navigation Bar */}
      <header className="w-full bg-slate-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold tracking-wide">Wildfire Alerts</h1>
          <div className="flex space-x-4">
            <Link
              href="/"
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 rounded-md text-white font-medium transition"
            >
              Home
            </Link>
            <Link
              href="/auth/sign-up"
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-white font-medium transition"
            >
               Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* Login Form Section - CENTERED with padding */}
      <section className="min-h-screen flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg ">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">
            Login
          </h3>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              {loading ? "Logging In..." : "Login"}
            </button>
          </div>

          <p className="mt-6 text-center text-slate-600 text-sm">
            Don't have an account?{" "}
            <Link
              href="/auth/sign-up"
              className="text-red-600 hover:text-red-700 font-semibold hover:underline"
            >
              Sign up for free
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}