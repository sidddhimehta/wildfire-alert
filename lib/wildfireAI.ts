export async function getWildfireRisk() {
  const response = await fetch("http://127.0.0.1:5000/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      temperature: 95,
      wind: 30,
      humidity: 10,
    }),
  });

  const data = await response.json();
  return data.risk; // "HIGH" or "LOW"
}
