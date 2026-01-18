"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      // 1️⃣ Sign up user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError || !authData.user) {
        alert(authError?.message || "Signup failed");
        setLoading(false);
        return;
      }

      // 2️⃣ Geocode the address using OpenStreetMap
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
      );
      const geoData = await geoRes.json();

      if (!geoData || geoData.length === 0) {
        alert("Invalid address, please try again.");
        setLoading(false);
        return;
      }

      const latitude = parseFloat(geoData[0].lat);
      const longitude = parseFloat(geoData[0].lon);

      // 3️⃣ Insert new user row into "users" table
      const { error: dbError } = await supabase
        .from("users")
        .insert([
          {
            id: authData.user.id,
            email: authData.user.email,
            address,
            latitude,
            longitude,
          },
        ]);

      if (dbError) {
        alert(dbError.message);
        setLoading(false);
        return;
      }

      // 4️⃣ Signup successful, redirect to protected page
      setLoading(false);
      router.push("/protected");
    } catch (err) {
      console.error("Signup error:", err);
      alert("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  }

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
              href="/auth/login"
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-white font-medium transition"
            >
              Login
            </Link>
          </div>
        </div>
      </header>

      {/* Signup Form Section - CENTERED with padding */}
      <section className="min-h-screen flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">
            Create Your Account
          </h3>
          <form onSubmit={handleSignUp} className="space-y-4">
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
            <input
              type="text"
              placeholder=" Address Ex: Street Address, City, State, Zipcode "
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              {loading ? "Signing Up..." : "Sign up"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
