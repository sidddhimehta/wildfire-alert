import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendWildfireAlert(
  to: string,
  riskScore: number,
  message: string
) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("Missing RESEND_API_KEY");
  }

  return await resend.emails.send({
    from: "Wildfire Alerts <alerts@resend.dev>",
    to,
    subject: "🔥 Wildfire Alert Near You",
    html: `
      <h2>Wildfire Risk Alert</h2>
      <p><strong>Risk Score:</strong> ${riskScore}</p>
      <p>${message}</p>
      <p>Please follow local emergency guidance.</p>
    `,
  });
}
