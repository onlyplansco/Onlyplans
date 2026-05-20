export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { answers, timeData, lang } = req.body;

  const groups = { pareja: "una pareja", amigos: "amigos", familia: "familia con niños", solo: "una persona sola" };
  const vibes = { naturaleza: "naturaleza", cultura: "cultura e historia", gastronomia: "gastronomía", tranquilidad: "tranquilidad", aventura: "aventura" };
  const budgets = { low: "<30€/persona", mid: "30-80€/persona", high: "sin límite" };
  const hours = timeData ? timeData.endHour - timeData.startHour : 10;
  const start = timeData ? `${String(timeData.startHour).padStart(2, "0")}:00` : "09:00";

  const prompt = `Eres OnlyPlans, el mejor planificador de fin de semana en España. Responde ${lang === "ca" ? "en catalán" : "en español"}.
Genera un plan para: Salida: ${answers.location}, Grupo: ${groups[answers.group]}, Transporte: ${answers.transport === "yes" ? "con coche" : "sin coche"}, Presupuesto: ${budgets[answers.budget]}, Tipo: ${vibes[answers.vibe]}, Duración: ${hours}h desde las ${start}.
Devuelve SOLO JSON sin texto extra:
{"title":"...","subtitle":"...","zone":"zona · Xmin desde ${answers.location}","emoji":"emoji","stops":[{"time":"HH:MM","icon":"emoji","title":"...","desc":"descripción práctica con nombres reales","tag":"Viaje|Cultura|Naturaleza|Restaurante|Actividad","tagColor":"muted|green|orange|accent|purple"}],"tips":["..."]}
5-7 paradas. Lugares reales de España. Primer stop=salida con aparcamiento o transporte. Último=vuelta a casa.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1500,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(500).json({ error: "API error", detail: err });
    }

    const data = await response.json();
    const text = data.content[0].text.replace(/```json|```/g, "").trim();
    const plan = JSON.parse(text);
    return res.status(200).json(plan);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
