export const config = { maxDuration: 30 };

const VIBE_MAP = { naturaleza: "relax", cultura: "social", gastronomia: "social", tranquilidad: "relax", aventura: "aventura" };
const CAT_MAP  = { naturaleza: ["montana", "pueblos"], cultura: ["cultura"], gastronomia: ["gastronomia"], tranquilidad: ["pueblos"], aventura: ["montana"] };
const GROUP_TAG = { solo: "solo", pareja: "pareja", amigos: "amigos", familia: "familia" };

const COMMUNITY_NORM = {
  "Cataluña":"Catalunya","Catalonia":"Catalunya","Catalunya":"Catalunya",
  "Andalucía":"Andalucía","Andalusia":"Andalucía",
  "Comunidad de Madrid":"Madrid","Community of Madrid":"Madrid","Madrid":"Madrid",
  "Comunitat Valenciana":"C. Valenciana","Valencian Community":"C. Valenciana",
  "País Vasco":"País Vasco","Basque Country":"País Vasco","Euskadi":"País Vasco",
  "Galicia":"Galicia","Castilla y León":"Castilla y León",
  "Castilla-La Mancha":"Castilla-La Mancha","Aragón":"Aragón","Aragon":"Aragón",
  "Extremadura":"Extremadura","Asturias":"Asturias","Murcia":"Murcia",
  "Navarra":"Navarra","La Rioja":"La Rioja","Cantabria":"Cantabria",
  "Islas Baleares":"Baleares","Balearic Islands":"Baleares","Illes Balears":"Baleares",
  "Islas Canarias":"Canarias","Canary Islands":"Canarias",
  "Ceuta":"Ceuta","Melilla":"Melilla",
};

async function geocode(location) {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1&countrycodes=es&addressdetails=1`;
    const r = await fetch(url, { headers: { "User-Agent": "OnlyPlans/1.0 (onlyplansco.com)" } });
    if (!r.ok) return null;
    const data = await r.json();
    if (!data.length) return null;
    const item = data[0];
    const addr = item.address || {};
    const rawCommunity = addr.state || addr.region || "";
    const community = COMMUNITY_NORM[rawCommunity] || rawCommunity;
    const province = addr.province || addr.county || addr.city || addr.town || addr.state || "";
    const location_name = addr.city || addr.town || addr.village || addr.municipality || location;
    return { lat: parseFloat(item.lat), lon: parseFloat(item.lon), location_name, province, community };
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { answers, timeData, lang } = req.body;
  if (!answers || !answers.location) return res.status(400).json({ error: "Missing answers" });

  const hours = timeData ? (timeData.endHour || 20) - (timeData.startHour || 9) : 10;
  const start = timeData ? `${String(timeData.startHour || 9).padStart(2, "0")}:00` : "09:00";

  // Derive schema fields from quiz answers — deterministic, no AI needed
  const vibe = VIBE_MAP[answers.vibe] || "social";
  const categories = CAT_MAP[answers.vibe] || ["ciudad"];
  const groupTag = GROUP_TAG[answers.group];
  const transportTags = answers.transport === "yes" ? ["con-coche"] : ["sin-coche", "transporte-publico"];
  const tags = [groupTag, ...transportTags].filter(Boolean);
  const budget = ["low", "mid", "high"].includes(answers.budget) ? answers.budget : "mid";
  const duration_type =
    hours <= 3 ? "unas-horas" :
    hours <= 5 ? "medio-dia" :
    hours <= 9 ? "dia-completo" :
    hours <= 18 ? "fin-de-semana" : "varios-dias";

  // Geocode the departure location
  const geo = await geocode(answers.location);

  const groups   = { pareja: "una pareja", amigos: "amigos", familia: "familia con niños", solo: "una persona sola" };
  const vibes    = { naturaleza: "naturaleza", cultura: "cultura e historia", gastronomia: "gastronomía", tranquilidad: "tranquilidad", aventura: "aventura" };
  const budgets  = { low: "<30€/persona", mid: "30-80€/persona", high: "sin límite" };
  const transportText = answers.transport === "yes"
    ? "con coche propio (puedes ir a cualquier lugar accesible en coche)"
    : `SIN coche, SOLO transporte público (tren, bus, metro). PROHIBIDO mencionar aparcamiento, conducir o lugares solo accesibles en coche. Todos los desplazamientos deben ser en transporte público desde ${answers.location}`;

  const prompt = `Eres OnlyPlans. Responde ${lang === "ca" ? "en catalán" : "en español"}.
Genera un plan de fin de semana para alguien que sale desde: ${answers.location}
- Grupo: ${groups[answers.group] || "amigos"}
- Transporte: ${transportText}
- Presupuesto: ${budgets[answers.budget] || "normal"}
- Tipo: ${vibes[answers.vibe] || "naturaleza"}
- Duración: ${hours}h desde las ${start}

REGLAS OBLIGATORIAS:
1. Todos los lugares deben estar en España.
2. El recorrido debe ser COHERENTE geográficamente (no saltar de ciudad en ciudad).
3. Los tiempos deben ser REALISTAS para ${answers.transport === "yes" ? "coche" : "transporte público"}.
4. La primera parada es la SALIDA desde ${answers.location}.
5. La última parada es la VUELTA a ${answers.location}.
6. ${answers.transport !== "yes" ? "SOLO transporte público. No menciones coche, aparcamiento ni conducir en ninguna parada." : ""}

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

    // Merge AI creative content with schema-correct fields
    return res.status(200).json({
      ...plan,
      vibe,
      categories,
      tags,
      budget,
      duration_type,
      ...(geo || {}),
    });
  } catch (err) {
    console.error("Handler error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
