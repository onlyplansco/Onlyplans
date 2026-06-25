export const config = { maxDuration: 30 };

const VIBE_MAP  = { naturaleza:"relax", cultura:"social", gastronomia:"social", tranquilidad:"relax", aventura:"aventura" };
const CAT_MAP   = { naturaleza:["montana","pueblos"], cultura:["cultura"], gastronomia:["gastronomia"], tranquilidad:["pueblos"], aventura:["montana"] };
const GROUP_TAG = { solo:"solo", pareja:"pareja", amigos:"amigos", familia:"familia" };

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

// Derivar duration_type desde el modo del calendario, no desde las horas
function getDurationType(timeData) {
  if (!timeData) return "dia-completo";
  const { mode, date, endDate, startHour = 9, endHour = 20 } = timeData;
  if (mode === "weekend") return "fin-de-semana";
  if (mode === "custom") {
    const days = (endDate && date) ? endDate - date + 1 : 1;
    if (days >= 3) return "varios-dias";
    if (days === 2) return "fin-de-semana";
  }
  // mode === "day" o custom día único → derivar desde horas
  const hours = endHour - startHour;
  return hours <= 3 ? "unas-horas" : hours <= 5 ? "medio-dia" : "dia-completo";
}

async function geocode(location) {
  if (!location) return null;
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
  } catch { return null; }
}

async function fetchUnsplashPhotos(query) {
  if (!process.env.UNSPLASH_ACCESS_KEY || !query) return [];
  try {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=2&orientation=landscape&content_filter=high`;
    const r = await fetch(url, { headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` } });
    if (!r.ok) return [];
    const data = await r.json();
    return (data.results || []).map(p => ({
      url: p.urls.regular,
      photographer: p.user.name,
      photographerUrl: `${p.user.links.html}?utm_source=onlyplans&utm_medium=referral`,
      unsplashUrl: `https://unsplash.com/photos/${p.id}?utm_source=onlyplans&utm_medium=referral`,
    }));
  } catch { return []; }
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { answers, timeData, lang } = req.body;
  const destination = answers?.destination?.trim() || null;
  const origin      = answers?.origin?.trim()      || null;

  if (!destination && !origin) return res.status(400).json({ error: "Indica al menos el destino o el origen" });

  // Campos de schema — derivados determinísticamente de las respuestas del quiz
  const vibe          = VIBE_MAP[answers.vibe]  || "social";
  const categories    = CAT_MAP[answers.vibe]   || ["ciudad"];
  const groupTag      = GROUP_TAG[answers.group];
  const transportTags = answers.transport === "yes" ? ["con-coche"] : ["sin-coche", "transporte-publico"];
  const tags          = [groupTag, ...transportTags].filter(Boolean);
  const budget        = ["low","mid","high"].includes(answers.budget) ? answers.budget : "mid";
  const duration_type = getDurationType(timeData);

  // Las tres llamadas externas en paralelo
  const geocodeTarget = destination || origin;
  const photoQuery    = destination || origin;

  const [geo, photos] = await Promise.all([
    geocode(geocodeTarget),
    fetchUnsplashPhotos(photoQuery),
  ]);

  // Construir contexto de ubicación para el prompt según los campos disponibles
  const groups  = { pareja:"una pareja", amigos:"amigos", familia:"familia con niños", solo:"una persona sola" };
  const vibes   = { naturaleza:"naturaleza", cultura:"cultura e historia", gastronomia:"gastronomía", tranquilidad:"tranquilidad", aventura:"aventura" };
  const budgets = { low:"<30€/persona", mid:"30-80€/persona", high:"sin límite" };

  const transportText = answers.transport === "yes"
    ? "con coche propio"
    : "SIN coche, SOLO transporte público (tren, bus, metro). PROHIBIDO mencionar aparcamiento, conducir o lugares solo accesibles en coche.";

  let locationCtx, returnNote;
  if (destination && origin) {
    locationCtx = `El usuario sale desde ${origin} y quiere hacer el plan en: ${destination}. Genera una ruta que incluya el desplazamiento desde ${origin} hasta ${destination}.`;
    returnNote  = `La primera parada es la SALIDA desde ${origin}. La última parada es la VUELTA a ${origin}.`;
  } else if (destination) {
    locationCtx = `El usuario quiere hacer el plan en: ${destination}. El plan tiene lugar en ese destino.`;
    returnNote  = `El plan empieza y termina en ${destination}. No hace falta incluir parada de "viaje de vuelta".`;
  } else {
    locationCtx = `El usuario sale desde: ${origin}. Propón un plan interesante alrededor de ese punto según el tiempo disponible.`;
    returnNote  = `La primera parada es la SALIDA desde ${origin}. La última parada es la VUELTA a ${origin}.`;
  }

  const hours = timeData ? (timeData.endHour || 20) - (timeData.startHour || 9) : 10;
  const start = timeData ? `${String(timeData.startHour || 9).padStart(2,"0")}:00` : "09:00";
  const durLabel = { "unas-horas":"unas horas", "medio-dia":"medio día", "dia-completo":"un día completo", "fin-de-semana":"un fin de semana", "varios-dias":"varios días" }[duration_type] || "un día";

  const prompt = `Eres OnlyPlans. Responde ${lang === "ca" ? "en catalán" : "en español"}.
Genera un plan para ${groups[answers.group]||"amigos"}.
${locationCtx}
- Transporte: ${transportText}
- Presupuesto: ${budgets[answers.budget]||"normal"}
- Tipo: ${vibes[answers.vibe]||"naturaleza"}
- Duración: ${durLabel}${duration_type === "dia-completo" ? ` (${hours}h desde las ${start})` : ""}

REGLAS OBLIGATORIAS:
1. Todos los lugares deben estar en España.
2. El recorrido debe ser COHERENTE geográficamente (sin saltar entre ciudades lejanas).
3. Los tiempos deben ser REALISTAS para ${answers.transport === "yes" ? "coche" : "transporte público"}.
4. ${returnNote}
5. ${answers.transport !== "yes" ? "SOLO transporte público. No menciones coche, aparcamiento ni conducir en ninguna parada." : ""}

Responde SOLO con JSON válido sin texto extra:
{"title":"título atractivo","subtitle":"descripción corta","zone":"destino principal · tiempo desde el origen si aplica","emoji":"emoji relevante","stops":[{"time":"HH:MM","icon":"emoji","title":"nombre del lugar","desc":"descripción práctica con precio aproximado si aplica","tag":"Viaje|Cultura|Naturaleza|Restaurante|Actividad","tagColor":"muted|green|orange|accent|purple"}],"tips":["consejo práctico 1","consejo práctico 2"]}

Incluye exactamente 5-7 paradas con nombres reales.`;

  try {
    const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
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

    if (!claudeRes.ok) {
      const err = await claudeRes.text();
      console.error("Anthropic API error:", claudeRes.status, err);
      return res.status(500).json({ error: "API error", status: claudeRes.status, detail: err });
    }

    const data  = await claudeRes.json();
    const text  = data.content[0].text.replace(/```json|```/g, "").trim();
    const plan  = JSON.parse(text);

    return res.status(200).json({
      ...plan,
      vibe,
      categories,
      tags,
      budget,
      duration_type,
      photos,                   // [{url, photographer, photographerUrl, unsplashUrl}]
      image_url: photos[0]?.url || null,
      ...(geo || {}),
    });
  } catch (err) {
    console.error("Handler error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
