export const config = { maxDuration: 15 };

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.status(401).json({ error: "No token" });

  const userToken = authHeader.replace("Bearer ", "");
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SERVICE_KEY  = process.env.SUPABASE_SERVICE_KEY;

  if (!SUPABASE_URL || !SERVICE_KEY) {
    return res.status(503).json({ error: "Server not configured" });
  }

  const svcH = {
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
    "Content-Type": "application/json",
    Prefer: "return=minimal",
  };

  // 1. Verificar token y obtener user_id
  const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${userToken}` },
  });
  if (!userRes.ok) return res.status(401).json({ error: "Invalid token" });
  const user = await userRes.json();
  if (!user?.id) return res.status(401).json({ error: "User not found" });

  const uid = user.id;

  // 2. Limpiar datos relacionados antes de borrar el usuario
  //    El orden importa: primero los hijos, luego los padres.

  // 2a. Borrar votos emitidos por el usuario
  await fetch(`${SUPABASE_URL}/rest/v1/votes?user_id=eq.${uid}`, {
    method: "DELETE", headers: svcH,
  }).catch(() => {});

  // 2b. Borrar planes guardados por el usuario (como guardador)
  await fetch(`${SUPABASE_URL}/rest/v1/saved_plans?user_id=eq.${uid}`, {
    method: "DELETE", headers: svcH,
  }).catch(() => {});

  // 2c. Anonimizar los planes publicados por el usuario:
  //     Se mantienen visibles pero sin autor identificable.
  //     Alternativa: borrarlos con DELETE en vez de PATCH.
  await fetch(`${SUPABASE_URL}/rest/v1/plans?user_id=eq.${uid}`, {
    method: "PATCH", headers: svcH,
    body: JSON.stringify({ user_id: null, author_name: null, author_avatar_url: null }),
  }).catch(() => {});

  // 2d. Borrar fila de profiles
  await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${uid}`, {
    method: "DELETE", headers: svcH,
  }).catch(() => {});

  // 3. Borrar usuario en auth (ahora sin referencias que puedan bloquear)
  const deleteRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${uid}`, {
    method: "DELETE",
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
  });

  if (deleteRes.ok) {
    return res.status(200).json({ ok: true });
  } else {
    const err = await deleteRes.json().catch(() => ({}));
    return res.status(500).json({ error: err.message || "Delete failed" });
  }
}
