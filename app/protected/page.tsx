"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { shelters } from "@/lib/shelters";

// Calculate distance between two lat/lon points
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Find nearest shelter
function nearestShelter(fireLat: number, fireLon: number) {
  return shelters.sort(
    (a, b) =>
      getDistance(fireLat, fireLon, a.lat, a.lon) -
      getDistance(fireLat, fireLon, b.lat, b.lon)
  )[0];
}

export default function ProtectedPage() {
  const router = useRouter();
  const [risk, setRisk] = useState("NONE");
  const [alertMessage, setAlertMessage] = useState("Loading...");
  const [shelterName, setShelterName] = useState("");
  const [mapsLink, setMapsLink] = useState("");
  const [distance, setDistance] = useState("");
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLon, setUserLon] = useState<number | null>(null);

  useEffect(() => {
    async function fetchRealData() {
      try {
        // 1️⃣ Get logged-in user
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push("/login");
          return;
        }

        const userEmail = user.email || "";

        // 2️⃣ Fetch user's lat/lon from database
        const { data: userData, error } = await supabase
          .from("users")
          .select("latitude, longitude")
          .eq("id", user.id)
          .single();

        if (!userData || userData.latitude == null || userData.longitude == null) {
          setAlertMessage("⚠️ No address found. Please update your profile.");
          return;
        }

        setUserLat(userData.latitude);
        setUserLon(userData.longitude);

        // 3️⃣ Call Flask backend for real-time fire + weather risk
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/predict`, {  // Changed from 127.0.0.1
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lat: userData.latitude,
            lon: userData.longitude,
          }),
        });

        const data = await res.json();

        if (data.error) {
          setAlertMessage("Unable to fetch wildfire data.");
          return;
        }

        setRisk(data.risk);

        // 4️⃣ Update messages and shelter info based on risk
        if (data.risk === "NONE") {
          setAlertMessage("✅ NO FIRES detected nearby. You are safe.");
          setShelterName("");
          setMapsLink("");
          setDistance("");
        } else if (data.risk === "LOW") {
          setAlertMessage(
            `⚠️ Low fire risk. Fire detected approximately ${data.distance_km?.toFixed(
              1
            ) || "?"} km away. Monitor the situation.`
          );
          setShelterName("");
          setMapsLink("");
          setDistance(`${data.distance_km?.toFixed(1) || "?"} km`);
        } else if (data.risk === "MEDIUM" || data.risk === "HIGH") {
          setAlertMessage(
            data.risk === "MEDIUM"
              ? "🔥 MEDIUM RISK: You have 20-30 minutes to evacuate!"
              : "🚨 HIGH RISK: EVACUATE IMMEDIATELY!"
          );

          if (data.fire_lat && data.fire_lon) {
            const nearest = nearestShelter(data.fire_lat, data.fire_lon);
            setShelterName(nearest.name);
            setMapsLink(
              `https://www.google.com/maps/search/?api=1&query=${nearest.lat},${nearest.lon}`
            );

            // Send email alert
            await fetch("https://wildfire-alerts-j8kw.onrender.com/send-email", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                risk: data.risk,
                shelter_name: nearest.name,
                maps_link: `https://www.google.com/maps/search/?api=1&query=${nearest.lat},${nearest.lon}`,
                user_email: userEmail,
              }),
            });

          }

          setDistance(`${data.distance_km?.toFixed(1) || "?"} km`);
        }
      } catch (err) {
        console.error("Error fetching risk:", err);
        setAlertMessage("Unable to connect to wildfire monitoring system.");
      }
    }

    fetchRealData();
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <header className="w-full bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <h1 className="text-xl font-semibold tracking-wide">WildfireAlerts</h1>
          <button 
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/");
            }}
            className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 transition"
          >
            Log Out
          </button>
        </div>
      </header>

      <div 
        className="w-full py-4 px-6 text-center font-semibold text-lg"
        style={{
          backgroundColor: risk === "HIGH" ? "#dc2626" : 
                          risk === "MEDIUM" ? "#f97316" : 
                          risk === "LOW" ? "#facc15" : 
                          "#9ca3af",
          color: risk === "LOW" ? "#000000" : "#ffffff"
        }}
      >
        {alertMessage}
        {shelterName && mapsLink && (
          <div className="mt-2">
            <span className="font-bold">Nearest Shelter: </span>
            <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="underline font-bold hover:opacity-80">
              {shelterName} - Click for Google Maps Route
            </a>
          </div>
        )}
      </div>

      <section
        className="relative h-[75vh] flex items-center justify-center text-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1523861751938-121b5323b48b?q=80&w=1724&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/75" />
        <div className="relative z-10 px-6 text-white">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight">Wildfire Alerts</h2>
          <p className="mt-6 text-lg md:text-xl max-w-2xl mx-auto text-white/90">
            Location-based wildfire risk analysis and evacuation <br /> guidance to help keep you safe.
          </p>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-semibold text-slate-900">
            Our Mission 
          </h3>
          <p className="mt-6 text-lg text-slate-600 leading-relaxed">
            Wildfires have become a growing safety and environmental crisis, especially in regions prone to heatwaves, drought, and low humidity. In the United States alone, more than 115 million people live in areas with high wildfire risk, meaning a significant portion of the population could face danger from fire at any given moment of time.
            Every year, families are displaced, homes are destroyed, and lives are put at risk because evacuation information is delayed, unclear, or inaccessible. To solve this ongoing crisis, we created Wildfire Alert. A powerful tool that combines AI and location intelligence to deliver real‑time, location‑specific fire alerts and clear evacuation guidance so individuals can stay informed, act quickly, and stay safe when it matters most.
          </p>
        </div>
      </section>

      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-3xl font-bold text-slate-900 text-center">How to Be Prepared</h3>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h4 className="font-semibold text-lg">1. Stay Informed</h4>
              <p className="mt-2 text-slate-600">
                Monitor wildfire alerts and weather updates so you can respond early to potential danger.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h4 className="font-semibold text-lg">2. Create an Evacuation Plan</h4>
              <p className="mt-2 text-slate-600">
                Know multiple evacuation routes and establish a family meeting point ahead of time.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h4 className="font-semibold text-lg">3. Prepare an Emergency Kit</h4>
              <p className="mt-2 text-slate-600">
                Pack water, food, medications, important documents, and phone chargers.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h4 className="font-semibold text-lg">4. Protect Your Home</h4>
              <p className="mt-2 text-slate-600">
                Remove dry vegetation and secure windows and doors to reduce fire risk.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h4 className="font-semibold text-lg">5. Be Ready to Leave</h4>
              <p className="mt-2 text-slate-600">
                Keep your car fueled and essential items easily accessible.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h4 className="font-semibold text-lg">6. Follow Official Guidance</h4>
              <p className="mt-2 text-slate-600">
                Always follow instructions from emergency services and local authorities.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}