export const config = { maxDuration: 30 };

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { answers, timeData, lang } = req.body;
  if (!answers || !answers.location) return res.status(400).json({ error: "Missing answers" });

  const groups = { pareja: "una pareja", amigos: "amigos", familia: "familia con niños", solo: "una persona sola" };
  const vibes = { naturaleza: "naturaleza", cultura: "cultura e historia", gastronomia: "gastronomía", tranquilidad: "tranquilidad", aventura: "aventura" };
  const budgets = { low: "<30€/persona", mid: "30-80€/persona", high: "sin límite" };
  const hours = timeData ? (timeData.endHour||20) - (timeData.startHour||9) : 10;
  const start = timeData ? `${String(timeData.startHour||9).padStart(2, "0")}:00` : "09:00";

  const transportText = answers.transport === "yes"
    ? "con coche propio (puedes ir a cualquier lugar accesible en coche)"
    : "SIN coche, SOLO transporte público (tren, bus, metro). PROHIBIDO mencionar aparcamiento, conducir o lugares solo accesibles en coche. Todos los desplazamientos deben ser en transporte público desde " + answers.location;

  const prompt = `Eres OnlyPlans. Responde ${lang === "ca" ? "en catalán" : "en español"}.
Genera un plan de fin de semana para alguien que sale desde: ${answers.location}
- Grupo: ${groups[answers.group]||"amigos"}
- Transporte: ${transportText}
- Presupuesto: ${budgets[answers.budget]||"normal"}
- Tipo: ${vibes[answers.vibe]||"naturaleza"}
- Duración: ${hours}h desde las ${start}

REGLAS OBLIGATORIAS:
1. Todos los lugares deben estar en España.
2. El recorrido debe ser COHERENTE geográficamente (no saltar de ciudad en ciudad).
3. Los tiempos deben ser REALISTAS para ${answers.transport==="yes"?"coche":"transporte público"}.
4. La primera parada es la SALIDA desde ${answers.location}.
5. La última parada es la VUELTA a ${answers.location}.
6. ${answers.transport!=="yes" ? "SOLO transporte público. No menciones coche, aparcamiento ni conducir en ninguna parada." : ""}

Responde SOLO con JSON válido sin texto extra:
{"title":"título atractivo","subtitle":"descripción corta","zone":"destino principal · Xmin desde ${answers.location}","emoji":"emoji relevante","stops":[{"time":"HH:MM","icon":"emoji","title":"nombre del lugar","desc":"descripción práctica con precio aproximado si aplica","tag":"Viaje|Cultura|Naturaleza|Restaurante|Actividad","tagColor":"muted|green|orange|accent|purple"}],"tips":["consejo práctico 1","consejo práctico 2"]}

Incluye exactamente 5-7 paradas con nombres reales.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1200,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Anthropic API error:", response.status, err);
      return res.status(500).json({ error: "API error", status: response.status, detail: err });
    }

    const data = await response.json();
    const text = data.content[0].text.replace(/```json|```/g, "").trim();
    const plan = JSON.parse(text);
    return res.status(200).json(plan);
  } catch (err) {
    console.error("Handler error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
