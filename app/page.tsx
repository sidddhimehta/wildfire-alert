"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-white">
      {/* HEADER */}
      <header className="w-full bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <h1 className="text-xl font-semibold tracking-wide">
            Wildfire Alerts
          </h1>

          <div className="flex gap-4">
            <button
              onClick={() => router.push("/auth/login")}
              className="px-6 py-2 rounded-md bg-orange-500 text-white font-bold 
                   hover:bg-orange-400 hover:-translate-y-0.5 
                   hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] 
                   active:scale-95 transition-all duration-200"
            >
              Login
            </button>

            <button
              onClick={() => router.push("/auth/sign-up")}
              className="px-6 py-2 rounded-md bg-orange-700 text-white font-bold 
                   hover:bg-orange-600 hover:-translate-y-0.5 
                   hover:shadow-[0_0_20px_rgba(194,65,12,0.4)] 
                   active:scale-95 transition-all duration-200"
            >
              Sign up
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section
        className="relative h-[75vh] flex items-center justify-center text-center opacity-80"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1523861751938-121b5323b48b?q=80&w=1724&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/80" />
        <div className="relative z-10 px-6 text-white">
          <h2 
          className="text-5xl md:text-6xl font-bold tracking-tight text-white" 
          style={{
            WebkitTextStroke: '1px black', // black border around letters
          }}
        >
          Wildfire Alerts
        </h2>
          <p className="mt-6 md:text-xl max-w-2xl text-white font-semibold drop-shadow-lg" style={{
            textShadow: `
              -1px -1px 0 #000,  
              1px -1px 0 #000,  
              -1px  1px 0 #000,  
              1px  1px 0 #000
            `
          }}>

            An AI-powered platform for wildfire risk detection and <br /> evacuation 
            guidance, all tailored to your location.
          </p>
        </div>
      </section>
      {/* INFO */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-semibold text-slate-900">
            Our Mission 
          </h3>
          <p className="mt-6 text-lg text-slate-600 leading-relaxed">
            Wildfires have become a growing safety and environmental crisis, especially in regions prone to heatwaves, drought, and low humidity. In the United States alone, more than 115 million people live in areas with high wildfire risk, meaning a significant portion of the population could face danger from fire at any given moment of time.
            Every year, families are displaced, homes are destroyed, and lives are put at risk because evacuation information is delayed, unclear, or inaccessible. To solve this ongoing crisis, we created Wildfire Alert. A free and powerful tool that combines AI and location intelligence to deliver real‑time, location‑specific fire alerts and clear evacuation guidance so individuals can stay informed, act quickly, and stay safe when it matters most.
          </p>
        </div>
      </section>

         {/* HOW TO USE */}
     <section className="py-16 px-8 bg-slate-50">
       <div className="max-w-5xl mx-auto text-center">
         <h3 className="text-3xl font-bold text-slate-900">
           Staying Safe Using Wildfire Alert
         </h3>


         <p className="mt-6 text-lg text-slate-600 max-w-3xl mx-auto">
           To receive free personalized wildfire alerts, users must create an
           account and sign in. This allows the system to securely assess risk
           near your location and provide guidance during emergencies. 

         </p> 
       </div>


       <div className="mt-6 grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
         {[
           ["Create an Account", "Sign up to get alerts."],
           ["Log In Securely", "Your data is protected and used only for safety alerts."],
           ["Allow Location Access", "Location Access helps to determine wildfire risk near you."],
           ["Receive Risk Alerts", "AI analyzes conditions near your location in real time."],
           ["View Evacuation Guidance", "Nearby shelters will be shown when danger increases."],
           ["Act Early", "Preparedness saves lives during disasters."],
         ].map(([title, desc]) => (
           <div
             key={title}
           
  className="bg-white p-6 rounded-xl shadow-sm text-left border-l-4 border-orange-500"
>

             <h4 className="font-semibold text-lg text-slate-900">
               {title}
             </h4>
             <p className="mt-2 text-slate-600">
               {desc}
             </p>
           </div>
         ))}
       </div>
     </section>
  
      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm">
        © {new Date().getFullYear()} WildfireAlerts. All rights reserved.
      </footer>
    </main>
  );
}