import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  await resend.emails.send({
    from: "WildfireAlerts <alerts@wildfirealerts.app>",
    to: "YOUR_EMAIL@gmail.com",
    subject: "🚨 Wildfire Evacuation Alert",
    html: "<p>High wildfire risk detected. Evacuate immediately.</p>",
  });

  return Response.json({ success: true });
}
