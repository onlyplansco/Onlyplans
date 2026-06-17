import { useState, useEffect, useRef } from "react";

// ── Config ────────────────────────────────────────────────────────────────────
const SUPABASE_URL = "https://ricrcrmabkcqkmqqbbcw.supabase.co";
const SUPABASE_KEY = "sb_publishable_rrB-RExn7Kwi4k66MwZBew_2zMFWkoq";

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  bg: "#F7F6F2", card: "#FFFFFF", border: "#E5E3DC",
  accent: "#B5D96A", accentDark: "#94BB4A", accentText: "#2A4A08",
  black: "#111110", text: "#1A1A18", muted: "#737368", dim: "#BBBAB2",
  white: "#FFFFFF", overlay: "rgba(17,17,16,0.55)",
  tagGreen: { t: "#1D6334", b: "#D6F0E0" },
  tagOrange: { t: "#B54A0E", b: "#FDEBD6" },
  tagAccent: { t: "#2A4A08", b: "#E4F5C0" },
  tagMuted: { t: "#737368", b: "#EFEFEB" },
  tagPurple: { t: "#5B2E9E", b: "#EDE0FA" },
};
const F = "'Plus Jakarta Sans', sans-serif";

// ── i18n ──────────────────────────────────────────────────────────────────────
const T = {
  es: {
    createPlan: "Crear mi plan", uploadPlan: "+ Subir plan",
    subtitle: "Descubre planes cerca de ti o crea los tuyos con IA.",
    topVoted: "Más votados", random: "Aleatorio",
    cats: ["Montaña","Playa","Ciudad","Pueblos","Gastronomía","Cultura","Ocio"],
    filters: "Filtros", save: "Guardar", saved: "Guardado ✓",
    share: "Compartir", doPlan: "Hacer este plan",
    generateNew: "Generar otro plan", planDay: "El plan del día",
    tips: "Consejos", report: "¿Problema en la ruta?",
    reportDesc: "Carretera cortada, restaurante cerrado...",
    reportBtn: "Reportar", reportSent: "Recibido, gracias.",
    when: "¿Cuándo y cuánto tiempo?", whenSub: "Para ajustar el plan",
    whereFrom: "¿Desde dónde salís?", whereFromSub: "Escribe tu ciudad de origen",
    whosComing: "¿Quién viene?", whosComingSub: "El plan cambia según esto",
    haveCar: "¿Tenéis coche?", haveCarSub: "Determina los destinos posibles",
    budget: "¿Presupuesto por persona?", budgetSub: "Aproximado para el día",
    vibe: "¿Qué os apetece?", vibeSub: "Elige uno para un plan coherente",
    couple: "En pareja", friends: "Con amigos", family: "Familia con niños", solo: "Solo/a",
    withCar: "Sí, tenemos coche", noCar: "Sin coche",
    cheap: "Económico", normal: "Normal", unlimited: "Sin límite",
    nature: "Naturaleza", culture: "Cultura", food: "Gastronomía",
    chill: "Tranquilidad", adventure: "Aventura",
    preparing: "Preparando tu plan...",
    loadingSteps: ["Analizando tu situación...","Buscando el mejor destino...","Verificando el tiempo...","Confirmando restaurantes...","Calculando ruta y aparcamiento...","¡Plan listo!"],
    back: "← Atrás", next: "Continuar →", close: "Cerrar",
    selectDay: "Selecciona un día primero",
    myProfile: "Mi perfil", savedPlans: "Guardados",
    myPlans: "Mis planes", generatedLbl: "Generados",
    language: "Idioma", langEs: "Castellano", langCa: "Català",
    logout: "Salir", noSaved: "Aún no tienes planes guardados.",
    uploadTitle: "Sube tu plan", step1: "¿De qué va?",
    step2: "¿Cómo es?", step3: "Las paradas", step4: "Consejos",
    step5: "Publicar", publish: "Publicar plan",
    thanks: "¡Plan publicado!", thanksDesc: "Ya está visible en el feed.",
    planTitle: "Título del plan", planSubtitle: "Subtítulo (opcional)",
    planTitlePh: "Ej: Amanecer en Montserrat + Viñedos Penedès",
    planSubPh: "Ej: Montaña sagrada, vistas únicas y vino de la tierra",
    zone: "Zona / destino", zonePh: "Ej: Girona · 1h 30min desde Barcelona",
    planType: "Tipo de plan (puedes elegir varios)",
    stopName: "Nombre del lugar", stopDesc: "Descripción práctica",
    addStop: "+ Añadir parada", tip1Ph: "Consejo 1 · Ej: Reserva el teleférico online",
    tip2Ph: "Consejo 2 · Ej: Mejor ir entre semana",
    addPhotos: "Añadir fotos", photosDesc: "Hasta 5 fotos · Se mostrarán en carrusel",
    login: "Iniciar sesión", register: "Crear cuenta",
    loginSub: "Para guardar planes y subir los tuyos",
    name: "Tu nombre", email: "Email", password: "Contraseña (mín. 6 caracteres)",
    alreadyAccount: "¿Ya tienes cuenta? Inicia sesión",
    noAccount: "¿No tienes cuenta? Regístrate",
    bio: "Sobre mí", bioPlaceholder: "Cuéntanos algo sobre ti y tus planes favoritos...",
    editProfile: "Editar perfil", saveProfile: "Guardar cambios",
    viewProfile: "Ver perfil", plansByUser: "Planes de",
    distanceFilter: "Distancia", durationFilter: "Duración",
    budgetFilter: "Presupuesto", vibeFilter: "Ambiente",
    groupFilter: "Grupo", transportFilter: "Transporte",
    applyFilters: "Aplicar filtros",
    clearFilters: "Limpiar filtros",
    distOpts: ["10 km","30 km","50 km","100 km","Sin límite"],
    durOpts: ["Unas horas","Medio día","Día completo","Fin de semana","Varios días"],
    durVals: ["unas-horas","medio-dia","dia-completo","fin-de-semana","varios-dias"],
    budgetOpts: ["Económico","Normal","Premium"],
    budgetVals: ["low","mid","high"],
    vibeOpts: ["Relax","Aventura","Social"],
    vibeVals: ["relax","aventura","social"],
    groupOpts: ["Solo","Pareja","Amigos","Familia"],
    groupVals: ["solo","pareja","amigos","familia"],
    transportOpts: ["Sin coche","Con coche"],
    transportVals: ["sin-coche","con-coche"],
    locationNeeded: "Activa tu ubicación para filtrar por distancia",
    allowLocation: "Permitir",
    durTypes: {"unas-horas":"Unas horas","medio-dia":"Medio día","dia-completo":"Día completo","fin-de-semana":"Fin de semana","varios-dias":"Varios días"},
    vibeLabels: {"relax":"Relax","aventura":"Aventura","social":"Social"},
    catLabels: {"montana":"Montaña","playa":"Playa","ciudad":"Ciudad","pueblos":"Pueblos","gastronomia":"Gastronomía","cultura":"Cultura","ocio":"Ocio"},
  },
  ca: {
    createPlan: "Crear el meu pla", uploadPlan: "+ Pujar pla",
    subtitle: "Descobreix plans a prop teu o crea els teus amb IA.",
    topVoted: "Més votats", random: "Aleatori",
    cats: ["Muntanya","Platja","Ciutat","Pobles","Gastronomia","Cultura","Lleure"],
    filters: "Filtres", save: "Guardar", saved: "Guardat ✓",
    share: "Compartir", doPlan: "Fer aquest pla",
    generateNew: "Generar un altre pla", planDay: "El pla del dia",
    tips: "Consells", report: "Problema a la ruta?",
    reportDesc: "Carretera tallada, restaurant tancat...",
    reportBtn: "Reportar", reportSent: "Rebut, gràcies.",
    when: "Quan i quant temps?", whenSub: "Per ajustar el pla",
    whereFrom: "Des d'on sortiu?", whereFromSub: "Escriu la teva ciutat d'origen",
    whosComing: "Qui ve?", whosComingSub: "El pla canvia segons això",
    haveCar: "Teniu cotxe?", haveCarSub: "Determina les destinacions possibles",
    budget: "Pressupost per persona?", budgetSub: "Aproximat per al dia",
    vibe: "Què us ve de gust?", vibeSub: "Tria un per a un pla coherent",
    couple: "En parella", friends: "Amb amics", family: "Família amb nens", solo: "Sol/a",
    withCar: "Sí, tenim cotxe", noCar: "Sense cotxe",
    cheap: "Econòmic", normal: "Normal", unlimited: "Sense límit",
    nature: "Natura", culture: "Cultura", food: "Gastronomia",
    chill: "Tranquil·litat", adventure: "Aventura",
    preparing: "Preparant el teu pla...",
    loadingSteps: ["Analitzant la teva situació...","Buscant la millor destinació...","Verificant el temps...","Confirmant restaurants...","Calculant ruta i aparcament...","Pla llest!"],
    back: "← Enrere", next: "Continuar →", close: "Tancar",
    selectDay: "Selecciona un dia primer",
    myProfile: "El meu perfil", savedPlans: "Guardats",
    myPlans: "Els meus plans", generatedLbl: "Generats",
    language: "Idioma", langEs: "Castellano", langCa: "Català",
    logout: "Sortir", noSaved: "Encara no tens plans guardats.",
    uploadTitle: "Puja el teu pla", step1: "De què va?",
    step2: "Com és?", step3: "Les parades", step4: "Consells",
    step5: "Publicar", publish: "Publicar pla",
    thanks: "Pla publicat!", thanksDesc: "Ja és visible al feed.",
    planTitle: "Títol del pla", planSubtitle: "Subtítol (opcional)",
    planTitlePh: "Ex: Albada a Montserrat + Vinyes Penedès",
    planSubPh: "Ex: Muntanya sagrada, vistes úniques i vi de la terra",
    zone: "Zona / destinació", zonePh: "Ex: Girona · 1h 30min des de Barcelona",
    planType: "Tipus de pla (pots triar diversos)",
    stopName: "Nom del lloc", stopDesc: "Descripció pràctica",
    addStop: "+ Afegir parada", tip1Ph: "Consell 1 · Ex: Reserva el telefèric online",
    tip2Ph: "Consell 2 · Ex: Millor entre setmana",
    addPhotos: "Afegir fotos", photosDesc: "Fins a 5 fotos · Es mostraran en carrusel",
    login: "Iniciar sessió", register: "Crear compte",
    loginSub: "Per guardar plans i pujar els teus",
    name: "El teu nom", email: "Email", password: "Contrasenya (mínim 6 caràcters)",
    alreadyAccount: "Ja tens compte? Inicia sessió",
    noAccount: "No tens compte? Registra't",
    bio: "Sobre mi", bioPlaceholder: "Explica'ns alguna cosa sobre tu i els teus plans favorits...",
    editProfile: "Editar perfil", saveProfile: "Desar canvis",
    viewProfile: "Veure perfil", plansByUser: "Plans de",
    distanceFilter: "Distància", durationFilter: "Durada",
    budgetFilter: "Pressupost", vibeFilter: "Ambient",
    groupFilter: "Grup", transportFilter: "Transport",
    applyFilters: "Aplicar filtres",
    clearFilters: "Netejar filtres",
    distOpts: ["10 km","30 km","50 km","100 km","Sense límit"],
    durOpts: ["Unes hores","Mig dia","Dia complet","Cap de setmana","Diversos dies"],
    durVals: ["unas-horas","medio-dia","dia-completo","fin-de-semana","varios-dias"],
    budgetOpts: ["Econòmic","Normal","Premium"],
    budgetVals: ["low","mid","high"],
    vibeOpts: ["Relax","Aventura","Social"],
    vibeVals: ["relax","aventura","social"],
    groupOpts: ["Sol","Parella","Amics","Família"],
    groupVals: ["solo","pareja","amigos","familia"],
    transportOpts: ["Sense cotxe","Amb cotxe"],
    transportVals: ["sin-coche","con-coche"],
    locationNeeded: "Activa la teva ubicació per filtrar per distància",
    allowLocation: "Permetre",
    durTypes: {"unas-horas":"Unes hores","medio-dia":"Mig dia","dia-completo":"Dia complet","fin-de-semana":"Cap de setmana","varios-dias":"Diversos dies"},
    vibeLabels: {"relax":"Relax","aventura":"Aventura","social":"Social"},
    catLabels: {"montana":"Muntanya","playa":"Platja","ciudad":"Ciutat","pueblos":"Pobles","gastronomia":"Gastronomia","cultura":"Cultura","ocio":"Lleure"},
  }
};


const QUESTIONS = [
  { id:"location", emoji:"📍", type:"text" },
  { id:"group", emoji:"👥", type:"opts", opts:[{v:"pareja",i:"💑"},{v:"amigos",i:"🎉"},{v:"familia",i:"👨‍👩‍👧"},{v:"solo",i:"🚶"}] },
  { id:"transport", emoji:"🚗", type:"opts", opts:[{v:"yes",i:"🚗"},{v:"no",i:"🚇"}] },
  { id:"budget", emoji:"💰", type:"opts", opts:[{v:"low",i:"🤏",s:"< 30€"},{v:"mid",i:"👍",s:"30–80€"},{v:"high",i:"✨",s:"> 80€"}] },
  { id:"vibe", emoji:"🎯", type:"opts", opts:[{v:"naturaleza",i:"🌿"},{v:"cultura",i:"🏛️"},{v:"gastronomia",i:"🍽️"},{v:"tranquilidad",i:"😌"},{v:"aventura",i:"⚡"}] },
];

// ── Supabase ──────────────────────────────────────────────────────────────────
const db = {
  h: { apikey:SUPABASE_KEY, Authorization:`Bearer ${SUPABASE_KEY}`, "Content-Type":"application/json" },
  ah: (t) => ({ apikey:SUPABASE_KEY, Authorization:`Bearer ${t}`, "Content-Type":"application/json" }),

  async getPlans(filter="all", advFilters={}, sortRandom=false) {
    let url = `${SUPABASE_URL}/rest/v1/plans?is_approved=eq.true&order=votes_count.desc&limit=50`;

    // Filtro de categoría (barra rápida del feed)
    const catMap = {
      "Montaña":"montana",     "Muntanya":"montana",
      "Playa":"playa",         "Platja":"playa",
      "Ciudad":"ciudad",       "Ciutat":"ciudad",
      "Pueblos":"pueblos",     "Pobles":"pueblos",
      "Gastronomía":"gastronomia", "Gastronomia":"gastronomia",
      "Cultura":"cultura",
      "Ocio":"ocio",           "Lleure":"ocio",
    };
    if (catMap[filter]) url += `&categories=cs.{${catMap[filter]}}`;

    // Filtros avanzados
    if (advFilters.budget) url += `&budget=eq.${advFilters.budget}`;
    if (advFilters.dur)    url += `&duration_type=eq.${advFilters.dur}`;
    if (advFilters.vibe)   url += `&vibe=eq.${advFilters.vibe}`;
    if (advFilters.group)  url += `&tags=cs.{${advFilters.group}}`;
    if (advFilters.transport) url += `&tags=cs.{${advFilters.transport}}`;

    try {
      const r = await fetch(url, {headers:this.h});
      const d = await r.json();
      if (Array.isArray(d)) return sortRandom ? [...d].sort(()=>Math.random()-0.5) : d;
    } catch {}
    return [];
  },

  async submitPlan(data, token) {
    const headers = token ? this.ah(token) : this.h;
    const r = await fetch(`${SUPABASE_URL}/rest/v1/plans`, {
      method:"POST", headers:{...headers, Prefer:"return=representation"},
      body: JSON.stringify({...data, is_approved:true, votes_count:0}),
    });
    if (!r.ok) {
      const err = await r.json().catch(()=>({}));
      throw new Error(err.message || `Error ${r.status}`);
    }
    const d = await r.json();
    return Array.isArray(d) ? d[0] : d;
  },

  async uploadPhoto(file, token) {
    try {
      const ext = file.name.split(".").pop();
      const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const r = await fetch(`${SUPABASE_URL}/storage/v1/object/plan-images/${name}`, {
        method:"POST",
        headers: { apikey:SUPABASE_KEY, Authorization:`Bearer ${token||SUPABASE_KEY}`, "Content-Type": file.type },
        body: file,
      });
      if (r.ok) return `${SUPABASE_URL}/storage/v1/object/public/plan-images/${name}`;
      return null;
    } catch { return null; }
  },

  async saveToLocal(plan) {
    try {
      const existing = JSON.parse(localStorage.getItem("op_saved") || "[]");
      if (!existing.find(p => p.id === plan.id)) {
        // Save FULL plan object so it can be opened with all details
        existing.unshift({
          id: plan.id, title: plan.title, subtitle: plan.subtitle,
          zone: plan.zone, emoji: plan.emoji, img: plan.img,
          votes_count: plan.votes_count||0, vibe: plan.vibe,
          budget: plan.budget, transport: plan.transport,
          stops: plan.stops||[], tips: plan.tips||[],
          photos: plan.photos||[], duration: plan.duration,
        });
        localStorage.setItem("op_saved", JSON.stringify(existing.slice(0,50)));
      }
    } catch {}
  },

  getSavedLocal() {
    try { return JSON.parse(localStorage.getItem("op_saved") || "[]"); } catch { return []; }
  },

  removeSavedLocal(id) {
    try {
      const existing = JSON.parse(localStorage.getItem("op_saved") || "[]");
      localStorage.setItem("op_saved", JSON.stringify(existing.filter(p => p.id !== id)));
    } catch {}
  },

  async savePlan(planId, userId, token) {
    try {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/saved_plans`, {
        method: "POST",
        headers: { ...this.ah(token), Prefer: "return=minimal" },
        body: JSON.stringify({ user_id: userId, plan_id: planId }),
      });
      return r.ok || r.status === 409;
    } catch { return false; }
  },

  async unsavePlan(planId, userId, token) {
    try {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/saved_plans?user_id=eq.${userId}&plan_id=eq.${planId}`, {
        method: "DELETE",
        headers: this.ah(token),
      });
      return r.ok;
    } catch { return false; }
  },

  async getSavedPlans(userId, token) {
    try {
      const r = await fetch(
        `${SUPABASE_URL}/rest/v1/saved_plans?user_id=eq.${userId}&select=plan_id,plans(*)&order=created_at.desc`,
        { headers: this.ah(token) }
      );
      const d = await r.json();
      if (!Array.isArray(d)) return null;
      return d.map(row => row.plans).filter(Boolean);
    } catch { return null; }
  },

  async castVote(planId, userId, token) {
    try {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/votes`, {
        method: "POST",
        headers: { ...this.ah(token), Prefer: "resolution=ignore-duplicates,return=minimal" },
        body: JSON.stringify({ user_id: userId, plan_id: planId }),
      });
      return r.ok || r.status === 409;
    } catch { return false; }
  },

  async removeVote(planId, userId, token) {
    try {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/votes?user_id=eq.${userId}&plan_id=eq.${planId}`, {
        method: "DELETE",
        headers: this.ah(token),
      });
      return r.ok;
    } catch { return false; }
  },

  async checkVoted(planId, userId, token) {
    try {
      const r = await fetch(
        `${SUPABASE_URL}/rest/v1/votes?user_id=eq.${userId}&plan_id=eq.${planId}&select=plan_id`,
        { headers: this.ah(token) }
      );
      const d = await r.json();
      return Array.isArray(d) && d.length > 0;
    } catch { return false; }
  },

  async checkIsSaved(planId, userId, token) {
    try {
      const r = await fetch(
        `${SUPABASE_URL}/rest/v1/saved_plans?user_id=eq.${userId}&plan_id=eq.${planId}&select=plan_id`,
        { headers: this.ah(token) }
      );
      const d = await r.json();
      return Array.isArray(d) && d.length > 0;
    } catch { return false; }
  },

  async updateProfile(userId, data, token) {
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}`, {
        method:"PATCH", headers:{...this.ah(token), Prefer:"return=minimal"},
        body: JSON.stringify(data),
      });
      return true;
    } catch { return false; }
  },

  async getProfile(userId) {
    try {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}&select=*`, {headers:this.h});
      const d = await r.json();
      return Array.isArray(d) && d.length > 0 ? d[0] : null;
    } catch { return null; }
  },

  async deletePlan(plan, token) {
    // 1. Borrar imágenes de Storage (no hay FK cascade)
    const allUrls = [...(Array.isArray(plan.photos) ? plan.photos : []), plan.image_url, plan.img]
      .filter(u => typeof u === "string" && u.includes("/plan-images/"));
    const filenames = [...new Set(allUrls.map(u => u.split("/plan-images/")[1]).filter(Boolean))];
    if (filenames.length > 0) {
      try {
        await fetch(`${SUPABASE_URL}/storage/v1/object/plan-images`, {
          method: "DELETE",
          headers: { ...this.ah(token), "Content-Type": "application/json" },
          body: JSON.stringify({ prefixes: filenames }),
        });
      } catch {}
    }
    // 2. Borrar plan (votes y saved_plans se eliminan por CASCADE automáticamente)
    try {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/plans?id=eq.${plan.id}`, {
        method: "DELETE",
        headers: { ...this.ah(token), Prefer: "count=exact" },
      });
      return r.ok;
    } catch { return false; }
  },

  async getPlanById(id) {
    try {
      const r = await fetch(
        `${SUPABASE_URL}/rest/v1/plans?id=eq.${id}&is_approved=eq.true&limit=1`,
        {headers:this.h}
      );
      const d = await r.json();
      return Array.isArray(d) && d.length > 0 ? d[0] : null;
    } catch { return null; }
  },

  async report(desc) {
    try { await fetch(`${SUPABASE_URL}/rest/v1/incidents`, {method:"POST", headers:this.h, body:JSON.stringify({description:desc})}); } catch {}
  },
};

// ── Auth ──────────────────────────────────────────────────────────────────────
const auth = {
  async signUp(email, password, name) {
    const r = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method:"POST", headers:{apikey:SUPABASE_KEY,"Content-Type":"application/json"},
      body: JSON.stringify({email, password, data:{full_name:name}}),
    });
    return r.json();
  },
  async signIn(email, password) {
    const r = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method:"POST", headers:{apikey:SUPABASE_KEY,"Content-Type":"application/json"},
      body: JSON.stringify({email, password}),
    });
    return r.json();
  },
  save(data) {
    try { localStorage.setItem("op_session", JSON.stringify({token:data.access_token, id:data.user?.id, email:data.user?.email, name:data.user?.user_metadata?.full_name||data.user?.email?.split("@")[0]})); } catch {}
  },
  load() { try { const s=localStorage.getItem("op_session"); return s?JSON.parse(s):null; } catch { return null; } },
  clear() { try { localStorage.removeItem("op_session"); } catch {} },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const tagC = (c) => ({green:C.tagGreen,orange:C.tagOrange,accent:C.tagAccent,purple:C.tagPurple,muted:C.tagMuted}[c]||C.tagMuted);

function Tag({label,color}) {
  const s=tagC(color);
  return <span style={{fontSize:10,fontWeight:700,letterSpacing:0.6,textTransform:"uppercase",color:s.t,background:s.b,padding:"3px 9px",borderRadius:20}}>{label}</span>;
}

function Btn({children,onClick,variant="black",style={}}) {
  const v={black:{background:C.black,color:C.white,border:"none"},accent:{background:C.accent,color:C.accentText,border:"none"},ghost:{background:"transparent",color:C.muted,border:`1.5px solid ${C.border}`}};
  return <button onClick={onClick} style={{borderRadius:12,padding:"13px 20px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:F,transition:"all 0.15s",display:"flex",alignItems:"center",justifyContent:"center",gap:6,...v[variant],...style}}>{children}</button>;
}

// ── Photo Carousel ────────────────────────────────────────────────────────────
function PhotoCarousel({photos, fallback, height=220, emoji=""}) {
  const [idx, setIdx] = useState(0);
  const touchStartX = useRef(0);

  const validUrl = (u) => typeof u === "string" && u.startsWith("http");
  const photoList = Array.isArray(photos) ? photos.filter(validUrl) : [];
  const fallbackUrl = validUrl(fallback) ? fallback : null;
  const imgs = photoList.length > 0 ? photoList : (fallbackUrl ? [fallbackUrl] : []);

  if (!imgs.length) {
    return (
      <div style={{height, background:`linear-gradient(135deg,${C.accent}30,${C.accent}10)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:56}}>
        {emoji || "🗺️"}
      </div>
    );
  }

  const prev = (e) => { e?.stopPropagation(); setIdx(i => (i - 1 + imgs.length) % imgs.length); };
  const next = (e) => { e?.stopPropagation(); setIdx(i => (i + 1) % imgs.length); };
  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { diff > 0 ? next() : prev(); }
  };

  return (
    <div style={{position:"relative", height, overflow:"hidden", background:`linear-gradient(135deg,${C.accent}30,${C.accent}10)`}}
      onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <img src={imgs[idx]} alt="" style={{width:"100%", height:"100%", objectFit:"cover"}}
        onError={e => { e.target.style.display = "none"; }}/>
      <div style={{position:"absolute", inset:0, background:"linear-gradient(to top,rgba(0,0,0,0.45) 0%,transparent 55%)"}}/>
      {imgs.length > 1 && (
        <>
          <button onClick={prev} style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",background:"rgba(255,255,255,0.8)",border:"none",borderRadius:"50%",width:28,height:28,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>‹</button>
          <button onClick={next} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"rgba(255,255,255,0.8)",border:"none",borderRadius:"50%",width:28,height:28,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>›</button>
          <div style={{position:"absolute",bottom:8,left:"50%",transform:"translateX(-50%)",display:"flex",gap:4}}>
            {imgs.map((_,i) => <div key={i} style={{width:i===idx?12:6,height:6,borderRadius:3,background:i===idx?"#fff":"rgba(255,255,255,0.5)",transition:"all 0.2s"}}/>)}
          </div>
        </>
      )}
    </div>
  );
}

// ── Top Navbar ────────────────────────────────────────────────────────────────
function TopNav({screen, go, t, user, onCreatePlan, onUpload}) {
  return (
    <div style={{position:"fixed",top:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:C.bg,borderBottom:`1px solid ${C.border}`,zIndex:100,display:"flex",alignItems:"center",padding:"0 14px",height:52,gap:8}}>
      <div onClick={()=>go("feed")} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:7,flexShrink:0}}>
        <div style={{width:28,height:28,background:C.accent,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:11,color:C.accentText,fontFamily:F}}>OP</div>
        <span style={{fontFamily:F,fontWeight:800,fontSize:15,color:C.black,letterSpacing:-0.3}}>OnlyPlans</span>
      </div>
      <div style={{flex:1}}/>
      <button onClick={onCreatePlan} style={{background:C.black,border:"none",borderRadius:20,padding:"6px 14px",cursor:"pointer",fontSize:12,fontWeight:700,color:C.white,fontFamily:F,whiteSpace:"nowrap"}}>
        {t.createPlan}
      </button>
      <button onClick={onUpload} style={{background:C.accent,border:"none",borderRadius:20,padding:"6px 14px",cursor:"pointer",fontSize:12,fontWeight:700,color:C.accentText,fontFamily:F,whiteSpace:"nowrap"}}>
        {t.uploadPlan}
      </button>
      <button onClick={()=>go("profile")} style={{background:screen==="profile"?C.accent:"transparent",border:`1px solid ${screen==="profile"?C.accent:C.border}`,borderRadius:"50%",width:32,height:32,cursor:"pointer",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
        {user?.avatar ? <img src={user.avatar} style={{width:32,height:32,borderRadius:"50%",objectFit:"cover"}} alt=""/> : "👤"}
      </button>
    </div>
  );
}

// ── Feed Card ─────────────────────────────────────────────────────────────────
function FeedCard({plan, t, onClick, user, onRequireAuth}) {
  const [saved, setSaved] = useState(() => !!db.getSavedLocal().find(p=>p.id===plan.id));
  const [votes, setVotes] = useState(plan.votes_count||0);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    if (!user?.id || !user?.token) return;
    db.checkIsSaved(plan.id, user.id, user.token).then(isSaved => setSaved(isSaved));
    db.checkVoted(plan.id, user.id, user.token).then(isVoted => {
      setVoted(isVoted);
    });
  }, [plan.id, user?.id]);

  const handleVote = (e) => {
    e.stopPropagation();
    if (!user) { onRequireAuth(); return; }
    if (voted) {
      setVoted(false);
      setVotes(v => Math.max(0, v - 1));
      db.removeVote(plan.id, user.id, user.token);
    } else {
      setVoted(true);
      setVotes(v => v + 1);
      db.castVote(plan.id, user.id, user.token);
    }
  };

  const handleSave = async (e) => {
    e.stopPropagation();
    if (!user) { onRequireAuth(); return; }
    if (saved) {
      setSaved(false);
      db.removeSavedLocal(plan.id);
      db.unsavePlan(plan.id, user.id, user.token);
    } else {
      setSaved(true);
      db.saveToLocal(plan);
      db.savePlan(plan.id, user.id, user.token);
    }
  };

  return (
    <div onClick={onClick} style={{background:C.card,borderRadius:18,overflow:"hidden",boxShadow:"0 1px 12px rgba(0,0,0,0.05)",cursor:"pointer",transition:"transform 0.2s,box-shadow 0.2s",marginBottom:14}}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 28px rgba(0,0,0,0.1)";}}
      onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 1px 12px rgba(0,0,0,0.05)";}}>
      <div style={{position:"relative"}}>
        <PhotoCarousel photos={plan.photos} fallback={plan.image_url || plan.img} height={210} emoji={plan.emoji}/>
        {(plan.location_name || plan.zone) && (
          <div style={{position:"absolute",top:12,left:12,background:"rgba(255,255,255,0.88)",backdropFilter:"blur(8px)",borderRadius:20,padding:"4px 11px",fontSize:11,fontWeight:600,color:C.black}}>
            📍 {plan.location_name || plan.zone}
          </div>
        )}
        <button onClick={handleSave} style={{position:"absolute",top:10,right:10,background:saved?"rgba(181,217,106,0.9)":"rgba(255,255,255,0.88)",backdropFilter:"blur(8px)",border:"none",borderRadius:"50%",width:34,height:34,cursor:"pointer",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s"}}>
          {saved?"🔖":"🤍"}
        </button>
        <div style={{position:"absolute",bottom:10,left:12,fontSize:28}}>{plan.emoji}</div>
      </div>
      <div style={{padding:"14px 16px"}}>
        <h3 style={{fontFamily:F,fontSize:16,fontWeight:800,color:C.black,marginBottom:5,lineHeight:1.25,letterSpacing:-0.2}}>{plan.title}</h3>
        <p style={{fontSize:13,color:C.muted,marginBottom:12,lineHeight:1.5}}>{plan.subtitle}</p>
        <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
          {plan.vibe && t.vibeLabels?.[plan.vibe] && <Tag label={t.vibeLabels[plan.vibe]} color="green"/>}
          {plan.duration_type && t.durTypes?.[plan.duration_type] && <Tag label={t.durTypes[plan.duration_type]} color="muted"/>}
          {plan.budget && t.budgetVals && <Tag label={t.budgetOpts[t.budgetVals.indexOf(plan.budget)] || plan.budget} color="muted"/>}
          {plan.categories?.[0] && t.catLabels?.[plan.categories[0]] && <Tag label={t.catLabels[plan.categories[0]]} color="accent"/>}
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",gap:8}}>
            <button onClick={handleVote} style={{background:voted?C.accent:C.bg,border:`1.5px solid ${voted?C.accent:C.border}`,borderRadius:20,padding:"5px 12px",cursor:"pointer",fontSize:12,fontWeight:700,color:voted?C.accentText:C.muted,transition:"all 0.2s"}}>▲ {votes}</button>
            <button onClick={e=>{e.stopPropagation();navigator.share&&navigator.share({title:plan.title,text:plan.subtitle,url:window.location.href});}} style={{background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:20,padding:"5px 12px",cursor:"pointer",fontSize:12,fontWeight:600,color:C.muted}}>↗ {t.share}</button>
          </div>
          {plan.author_name && <span style={{fontSize:11,color:C.dim}}>por {plan.author_name}</span>}
        </div>
      </div>
    </div>
  );
}

// ── Filters Panel ─────────────────────────────────────────────────────────────
function FiltersPanel({t, onClose, onApply, activeFilters}) {
  const [cat,       setCat]       = useState(activeFilters.cat||null);
  const [dur,       setDur]       = useState(activeFilters.dur||null);
  const [budget,    setBudget]    = useState(activeFilters.budget||null);
  const [vibe,      setVibe]      = useState(activeFilters.vibe||null);
  const [group,     setGroup]     = useState(activeFilters.group||null);
  const [transport, setTransport] = useState(activeFilters.transport||null);

  const hasActive = cat||dur||budget||vibe||group||transport;
  const activeCount = [cat,dur,budget,vibe,group,transport].filter(Boolean).length;

  const clearAll = () => { setCat(null);setDur(null);setBudget(null);setVibe(null);setGroup(null);setTransport(null); };

  // Row genérico — opts son labels, vals son los slugs reales que van a la DB
  const Row = ({label, opts, vals, val, set}) => (
    <div style={{marginBottom:18}}>
      <div style={{fontSize:12,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:0.6,marginBottom:8}}>{label}</div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        {opts.map((o,i) => {
          const v = vals ? vals[i] : o;
          return (
            <button key={v} onClick={()=>set(val===v?null:v)}
              style={{background:val===v?C.black:C.bg,color:val===v?C.white:C.muted,border:`1.5px solid ${val===v?C.black:C.border}`,borderRadius:20,padding:"7px 14px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:F,transition:"all 0.15s"}}>
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );

  const touchStartY = useRef(0);
  const handleDragStart = (e) => { touchStartY.current = e.touches[0].clientY; };
  const handleDragEnd   = (e) => { if (e.changedTouches[0].clientY - touchStartY.current > 60) onClose(); };

  const handleApply = () => {
    onApply({cat, dur, budget, vibe, group, transport});
    onClose();
  };

  return (
    <div style={{position:"fixed",inset:0,background:C.overlay,zIndex:300,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={onClose}>
      <div style={{background:C.card,borderRadius:"20px 20px 0 0",width:"100%",maxWidth:480,maxHeight:"85vh",display:"flex",flexDirection:"column"}} onClick={e=>e.stopPropagation()}>

        {/* Drag handle */}
        <div onTouchStart={handleDragStart} onTouchEnd={handleDragEnd}
          style={{padding:"16px 24px 8px",flexShrink:0,cursor:"grab"}}>
          <div style={{width:36,height:4,background:C.border,borderRadius:2,margin:"0 auto"}}/>
        </div>

        {/* Scrollable content */}
        <div style={{overflowY:"auto",padding:"0 24px 24px",flex:1}}>

          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
            <span style={{fontFamily:F,fontSize:18,fontWeight:800,color:C.black}}>{t.filters}</span>
            <button onClick={clearAll} style={{background:"transparent",border:"none",fontSize:13,color:hasActive?C.black:C.dim,cursor:"pointer",fontFamily:F,fontWeight:hasActive?700:400}}>{t.clearFilters}</button>
          </div>

          <Row label="Categoría"       opts={t.cats}         val={cat}       set={setCat}/>
          <Row label={t.durationFilter} opts={t.durOpts}     vals={t.durVals}  val={dur}   set={setDur}/>
          <Row label={t.vibeFilter}     opts={t.vibeOpts}    vals={t.vibeVals} val={vibe}  set={setVibe}/>
          <Row label={t.budgetFilter}   opts={t.budgetOpts}  vals={t.budgetVals} val={budget} set={setBudget}/>
          <Row label={t.groupFilter}    opts={t.groupOpts}   vals={t.groupVals}  val={group}  set={setGroup}/>
          <Row label={t.transportFilter} opts={t.transportOpts} vals={t.transportVals} val={transport} set={setTransport}/>

          {/* Distancia — proximamente */}
          <div style={{marginBottom:18}}>
            <div style={{fontSize:12,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:0.6,marginBottom:8}}>{t.distanceFilter}</div>
            <div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:12,padding:"12px 14px"}}>
              <span style={{fontSize:13,color:C.dim}}>🗺️ Próximamente — filtrar por distancia desde tu ciudad</span>
            </div>
          </div>

          <Btn onClick={handleApply} variant="black" style={{width:"100%",padding:"15px",borderRadius:14,marginTop:4}}>
            {t.applyFilters}{hasActive ? ` (${activeCount})` : ""}
          </Btn>

        </div>
      </div>
    </div>
  );
}

// ── Feed Screen ───────────────────────────────────────────────────────────────
function FeedScreen({t, go, onPlanClick, onUpload, user, onRequireAuth}) {
  const [filter, setFilter] = useState("all");
  const [sortRandom, setSortRandom] = useState(false);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  const hasActiveFilters = Object.values(activeFilters).some(Boolean);

  const load = async (f, adv, rand) => {
    setLoading(true);
    const data = await db.getPlans(f, adv, rand);
    setPlans(data);
    setLoading(false);
  };

  useEffect(() => { load("all", {}, false); }, []);

  const handleCat = (f) => {
    const nf = filter===f?"all":f;
    setFilter(nf);
    load(nf, activeFilters, sortRandom);
  };

  const toggleSort = () => {
    const nr = !sortRandom;
    setSortRandom(nr);
    load(filter, activeFilters, nr);
  };

  const applyFilters = (f) => {
    setActiveFilters(f);
    // Si se cambió la categoría desde el panel avanzado, sincronizar la barra rápida
    const newCatFilter = f.cat ? f.cat : filter;
    if (f.cat) setFilter(f.cat);
    load(newCatFilter, f, sortRandom);
  };

  return (
    <div style={{minHeight:"100vh",background:C.bg,paddingTop:52}}>
      {showFilters && <FiltersPanel t={t} onClose={()=>setShowFilters(false)} onApply={applyFilters} activeFilters={activeFilters}/>}

      <div style={{padding:"16px 16px 0"}}>
        <p style={{fontSize:14,color:C.muted,lineHeight:1.6}}>{t.subtitle}</p>
      </div>

      <div style={{display:"flex",alignItems:"center",paddingTop:12,paddingBottom:10,overflowX:"auto",scrollbarWidth:"none",gap:0}}>
        <div style={{width:16,flexShrink:0}}/>
        <button onClick={toggleSort} style={{background:C.card,border:`1.5px solid ${C.border}`,borderRadius:20,padding:"7px 13px",fontSize:12,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap",color:C.muted,fontFamily:F,marginRight:8,flexShrink:0,display:"flex",alignItems:"center",gap:4}}>
          {sortRandom?"🔀":"▲"} {sortRandom?t.random:t.topVoted}
        </button>
        {t.cats.map(f=>(
          <button key={f} onClick={()=>handleCat(f)} style={{background:filter===f?C.black:C.card,color:filter===f?C.white:C.muted,border:`1.5px solid ${filter===f?C.black:C.border}`,borderRadius:20,padding:"7px 14px",fontSize:13,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",marginRight:8,transition:"all 0.2s",fontFamily:F,flexShrink:0}}>{f}</button>
        ))}
        <button onClick={()=>setShowFilters(true)} style={{background:hasActiveFilters?C.accent:C.card,color:hasActiveFilters?C.accentText:C.muted,border:`1.5px solid ${hasActiveFilters?C.accent:C.border}`,borderRadius:20,padding:"7px 13px",fontSize:13,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap",marginRight:16,flexShrink:0,fontFamily:F}}>
          ⚙️ {t.filters}{hasActiveFilters?` ✓`:""}
        </button>
      </div>

      <div style={{padding:"4px 16px 100px"}}>
        {loading ? (
          <div style={{textAlign:"center",padding:60,color:C.muted}}>
            <div style={{fontSize:28,animation:"spin 1.5s linear infinite",marginBottom:12}}>◌</div>
            Cargando...
          </div>
        ) : (
          plans.map(plan=><FeedCard key={plan.id} plan={plan} t={t} onClick={()=>onPlanClick(plan)} user={user} onRequireAuth={onRequireAuth}/>)
        )}
        <div style={{background:C.accent+"30",border:`1.5px solid ${C.accent}`,borderRadius:18,padding:22,textAlign:"center",marginTop:8}}>
          <div style={{fontSize:28,marginBottom:10}}>📝</div>
          <div style={{fontFamily:F,fontSize:16,fontWeight:800,color:C.black,marginBottom:6}}>¿Has hecho un plan increíble?</div>
          <div style={{fontSize:13,color:C.muted,marginBottom:14}}>Compártelo con la comunidad</div>
          <Btn onClick={onUpload} variant="black">{t.uploadPlan}</Btn>
        </div>
      </div>
    </div>
  );
}

// ── Plan Detail ───────────────────────────────────────────────────────────────
function PlanDetail({plan, t, onBack, user, onRequireAuth, go}) {
  const [saved, setSaved] = useState(() => !!db.getSavedLocal().find(p=>p.id===plan.id));
  const [reported, setReported] = useState(false);
  const [reportTxt, setReportTxt] = useState("");
  const [showReport, setShowReport] = useState(false);
  const [planDone, setPlanDone] = useState(false);
  const [authorName, setAuthorName] = useState(plan.author_name||null);
  const [authorAvatar, setAuthorAvatar] = useState(plan.author_avatar_url||null);

  useEffect(() => {
    if (!user?.id || !user?.token) return;
    db.checkIsSaved(plan.id, user.id, user.token).then(isSaved => setSaved(isSaved));
  }, [plan.id, user?.id]);

  // Cargar nombre y avatar del autor desde profiles si no están cacheados en el plan
  useEffect(() => {
    if ((!authorName || !authorAvatar) && plan.user_id) {
      db.getProfile(plan.user_id).then(profile => {
        if (profile?.full_name && !authorName) setAuthorName(profile.full_name);
        if (profile?.avatar_url && !authorAvatar) setAuthorAvatar(profile.avatar_url);
      }).catch(()=>{});
    }
  }, [plan.user_id]);

  const handleSave = async () => {
    if (!user) { onRequireAuth(); return; }
    if (saved) {
      setSaved(false);
      db.removeSavedLocal(plan.id);
      db.unsavePlan(plan.id, user.id, user.token);
    } else {
      setSaved(true);
      db.saveToLocal(plan);
      db.savePlan(plan.id, user.id, user.token);
    }
  };

  const handleDoPlan = () => {
    if (!user) { onRequireAuth(); return; }
    setSaved(true);
    setPlanDone(true);
    db.saveToLocal(plan);
    db.savePlan(plan.id, user.id, user.token);
  };

  return (
    <div style={{minHeight:"100vh",background:C.bg,paddingTop:52,paddingBottom:40}}>
      <div style={{position:"relative"}}>
        <PhotoCarousel photos={plan.photos} fallback={plan.image_url || plan.img} height={280} emoji={plan.emoji}/>
        <button onClick={onBack} style={{position:"absolute",top:16,left:16,background:"rgba(255,255,255,0.9)",backdropFilter:"blur(8px)",border:"none",borderRadius:20,padding:"8px 16px",cursor:"pointer",fontSize:13,fontWeight:600,color:C.black,fontFamily:F}}>← Volver</button>
        <div style={{position:"absolute",bottom:16,left:16,right:16}}>
          <div style={{fontSize:36,marginBottom:6}}>{plan.emoji}</div>
          <h1 style={{fontFamily:F,fontSize:20,fontWeight:900,color:"#fff",lineHeight:1.2}}>{plan.title}</h1>
        </div>
      </div>

      <div style={{padding:"20px 16px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div style={{fontSize:13,color:C.muted}}>📍 {plan.location_name || plan.zone || "Sin ubicación"}</div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={handleSave} style={{background:saved?C.accent:"transparent",border:`1.5px solid ${saved?C.accent:C.border}`,borderRadius:20,padding:"6px 14px",cursor:"pointer",fontSize:12,fontWeight:700,color:saved?C.accentText:C.muted,transition:"all 0.2s",fontFamily:F}}>{saved?t.saved:t.save}</button>
            <button onClick={()=>navigator.share&&navigator.share({title:plan.title,text:plan.subtitle,url:window.location.href})} style={{background:"transparent",border:`1.5px solid ${C.border}`,borderRadius:20,padding:"6px 12px",cursor:"pointer",fontSize:12,color:C.muted,fontFamily:F}}>↗</button>
          </div>
        </div>

        <p style={{fontSize:14,color:C.muted,lineHeight:1.6,marginBottom:20}}>{plan.subtitle}</p>

        <Btn onClick={handleDoPlan} variant="black" style={{width:"100%",padding:"15px",fontSize:15,marginBottom:24,borderRadius:14}}>
          {planDone?"✓ Guardado en tu perfil":t.doPlan}
        </Btn>

        {plan.stops?.length>0 && (
          <>
            <h2 style={{fontFamily:F,fontSize:17,fontWeight:800,color:C.black,marginBottom:16}}>{t.planDay}</h2>
            <div style={{marginBottom:24}}>
              {plan.stops.map((stop,i)=>{
                const s=tagC(stop.tagColor);
                return (
                  <div key={i} style={{display:"flex",gap:14}}>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center",width:34,flexShrink:0}}>
                      <div style={{width:32,height:32,borderRadius:"50%",background:s.b,border:`2px solid ${s.t}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>{stop.icon}</div>
                      {i<plan.stops.length-1&&<div style={{width:2,flex:1,background:C.border,margin:"4px 0"}}/>}
                    </div>
                    <div style={{paddingBottom:18,flex:1}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                        <span style={{fontSize:12,color:C.accentText,fontWeight:800}}>{stop.time}</span>
                        <span style={{fontSize:10,fontWeight:700,color:s.t,background:s.b,padding:"2px 8px",borderRadius:20,textTransform:"uppercase"}}>{stop.tag}</span>
                      </div>
                      <div style={{fontSize:14,fontWeight:700,color:C.black,marginBottom:3,fontFamily:F}}>{stop.title}</div>
                      <div style={{fontSize:13,color:C.muted,lineHeight:1.5}}>{stop.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {plan.tips?.length>0 && (
          <div style={{background:C.accent+"25",border:`1.5px solid ${C.accent}`,borderRadius:16,padding:16,marginBottom:24}}>
            <div style={{fontSize:13,fontWeight:800,color:C.accentText,marginBottom:10,fontFamily:F}}>💡 {t.tips}</div>
            {plan.tips.map((tip,i)=><div key={i} style={{fontSize:13,color:C.text,marginBottom:6,display:"flex",gap:8}}><span style={{color:C.accentText}}>•</span><span>{tip}</span></div>)}
          </div>
        )}

        {plan.user_id && (
          <div onClick={()=>go("userProfile",{userId:plan.user_id,userName:authorName})} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:14,marginBottom:24,display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}>
            <div style={{width:40,height:40,borderRadius:"50%",background:C.accent,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:700,color:C.accentText,flexShrink:0}}>
              {authorAvatar ? <img src={authorAvatar} style={{width:40,height:40,borderRadius:"50%",objectFit:"cover"}} alt=""/> : (authorName||"U")[0].toUpperCase()}
            </div>
            <div>
              <div style={{fontSize:13,fontWeight:700,color:C.black}}>{authorName ? `Plan de ${authorName}` : "Ver perfil del autor"}</div>
              <div style={{fontSize:11,color:C.muted}}>{t.viewProfile} →</div>
            </div>
          </div>
        )}

        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:16}}>
          <div style={{fontSize:13,fontWeight:700,color:C.black,marginBottom:4}}>⚠️ {t.report}</div>
          <div style={{fontSize:12,color:C.muted,marginBottom:12}}>{t.reportDesc}</div>
          {reported ? <div style={{fontSize:13,color:"#1D6334",fontWeight:600}}>✓ {t.reportSent}</div>
          : showReport ? (
            <div>
              <textarea value={reportTxt} onChange={e=>setReportTxt(e.target.value)} placeholder="Describe el problema..." style={{width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:"10px 14px",fontSize:13,color:C.text,outline:"none",fontFamily:F,minHeight:80,resize:"none",boxSizing:"border-box",marginBottom:10}}/>
              <Btn onClick={async()=>{await db.report(reportTxt);setReported(true);}} variant="black" style={{width:"100%"}}>Enviar</Btn>
            </div>
          ) : (
            <button onClick={()=>setShowReport(true)} style={{background:C.bg,border:`1px solid ${C.border}`,color:C.muted,borderRadius:10,padding:"10px 16px",fontSize:13,cursor:"pointer",width:"100%",fontFamily:F}}>{t.reportBtn}</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Geocoding ─────────────────────────────────────────────────────────────────
const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const COMMUNITY_NORM = {
  "Catalonia":"Catalunya","Community of Madrid":"Madrid","Madrid":"Madrid",
  "Andalusia":"Andalucía","Valencian Community":"Comunitat Valenciana",
  "Basque Country":"País Vasco","Galicia":"Galicia",
  "Castile and León":"Castilla y León","Castile-La Mancha":"Castilla-La Mancha",
  "Canary Islands":"Canarias","Aragon":"Aragón","Extremadura":"Extremadura",
  "Region of Murcia":"Murcia","Balearic Islands":"Illes Balears",
  "Navarre":"Navarra","Cantabria":"Cantabria","La Rioja":"La Rioja",
  "Principality of Asturias":"Asturias","Ceuta":"Ceuta","Melilla":"Melilla",
};
async function geoSearch(q) {
  try {
    const r = await fetch(
      `${NOMINATIM_URL}?q=${encodeURIComponent(q)}&countrycodes=es&format=json&addressdetails=1&limit=8`,
      {headers:{"Accept-Language":"es"}}
    );
    const data = await r.json();
    return (Array.isArray(data)?data:[])
      // Solo entidades de tipo lugar (ciudad, pueblo, municipio) — filtra calles y edificios
      .filter(item => item.class === "place" || item.class === "boundary" || item.type === "administrative")
      .map(item=>{
        const a = item.address||{};
        const city = a.city||a.town||a.village||a.municipality||a.hamlet||item.name;
        const province = a.province||a.state_district||null;
        const community = COMMUNITY_NORM[a.state]||a.state||null;
        return {
          label:[city,province,community].filter(Boolean).join(" · "),
          locationName:city, province, community,
          lat:parseFloat(item.lat), lon:parseFloat(item.lon),
        };
      })
      .filter(s=>s.locationName)
      .slice(0,5);
  } catch { return []; }
}

// ── Upload options ─────────────────────────────────────────────────────────────
const CAT_OPTS = [
  {slug:"montana",    label:"Montaña",      icon:"⛰️"},
  {slug:"playa",      label:"Playa",        icon:"🏖️"},
  {slug:"ciudad",     label:"Ciudad",       icon:"🏙️"},
  {slug:"pueblos",    label:"Pueblos",      icon:"🏡"},
  {slug:"gastronomia",label:"Gastronomía",  icon:"🍽️"},
  {slug:"cultura",    label:"Cultura",      icon:"🏛️"},
  {slug:"ocio",       label:"Ocio",         icon:"🎡"},
];
const VIBE_OPTS_UP = [
  {v:"relax",    l:"Relax",    i:"😌"},
  {v:"aventura", l:"Aventura", i:"⚡"},
  {v:"social",   l:"Social",   i:"🎉"},
];
const DUR_OPTS = [
  {v:"unas-horas",    l:"Menos de 4h"},
  {v:"medio-dia",     l:"Medio día"},
  {v:"dia-completo",  l:"Día completo"},
  {v:"fin-de-semana", l:"Fin de semana"},
  {v:"varios-dias",   l:"Varios días"},
];
const BUDGET_OPTS_UP = [
  {v:"low",  l:"Económico · <30€"},
  {v:"mid",  l:"Normal · 30–80€"},
  {v:"high", l:"Premium · >80€"},
];
const DIFF_OPTS = [
  {v:"facil",    l:"🟢 Fácil"},
  {v:"moderado", l:"🟡 Moderado"},
  {v:"dificil",  l:"🔴 Difícil"},
];
const TAG_LABELS = {
  "solo":"Solo","pareja":"Pareja","amigos":"Amigos","familia":"Familia",
  "romantico":"Romántico","familiar":"Familiar",
  "sin-coche":"Sin coche","con-coche":"Con coche",
  "transporte-publico":"Transporte público","en-bici":"En bici","moto":"Moto",
  "senderismo":"Senderismo","ciclismo":"Ciclismo","escalada":"Escalada",
  "esqui":"Esquí","caiac":"Caiac · Paddle surf","bano":"Baño",
  "spa":"Spa","piscina":"Piscina","termas":"Termas",
  "cata-vinos":"Cata de vinos","bodega":"Bodega",
  "mercado":"Mercado gastronómico","brunch":"Brunch",
  "museo":"Museo","monumento":"Monumento","castillo":"Castillo",
  "casco-antiguo":"Casco antiguo","ruta-historica":"Ruta histórica",
  "con-ninos":"Con niños","pet-friendly":"Pet Friendly",
  "sin-reserva":"Sin reserva","reserva-necesaria":"Reserva necesaria",
  "gratuito":"Gratuito","aparcamiento":"Aparcamiento gratuito",
  "manana":"Mañana","tarde":"Tarde","nocturno":"Nocturno",
  "todo-el-ano":"Todo el año","verano":"Verano","invierno":"Invierno",
};
const TAG_GROUPS = [
  {id:"grupo",   label:"Grupo",       tags:["solo","pareja","amigos","familia","romantico","familiar"],            limit:4, show:()=>true},
  {id:"trans",   label:"Transporte",  tags:["sin-coche","con-coche","transporte-publico","en-bici","moto"],        limit:3, show:()=>true},
  {id:"activ",   label:"Actividades", tags:["senderismo","ciclismo","escalada","esqui","caiac","bano"],            limit:4, show:(cats)=>cats.some(c=>["montana","playa","ocio"].includes(c))},
  {id:"relax-t", label:"Relax",       tags:["spa","piscina","termas"],                                             limit:3, show:(_,v)=>v==="relax"},
  {id:"gastro-t",label:"Gastronomía", tags:["cata-vinos","bodega","mercado","brunch"],                             limit:4, show:(cats)=>cats.includes("gastronomia")},
  {id:"cult-t",  label:"Cultura",     tags:["museo","monumento","castillo","casco-antiguo","ruta-historica"],      limit:4, show:(cats)=>cats.includes("cultura")},
  {id:"fam-t",   label:"Familia",     tags:["con-ninos","pet-friendly"],                                           limit:2, show:()=>true},
  {id:"logist",  label:"Logística",   tags:["sin-reserva","reserva-necesaria","gratuito","aparcamiento"],          limit:4, show:()=>true},
  {id:"hora-t",  label:"Horario",     tags:["manana","tarde","nocturno","todo-el-ano","verano","invierno"],        limit:4, show:()=>true},
];

// ── Upload Modal ──────────────────────────────────────────────────────────────
function UploadModal({t, onClose, user, onUploaded}) {
  const STEPS = 4;
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [publishError, setPublishError] = useState(null);

  // Step 1
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [geoSugg, setGeoSugg] = useState([]);
  const [geoStatus, setGeoStatus] = useState("idle"); // idle | loading | found | error
  const [geoData, setGeoData] = useState(null);
  const [zone, setZone] = useState("");
  const geoTimerRef = useRef(null);
  const scrollRef = useRef(null);

  // Step 2
  const [categories, setCategories] = useState([]);
  const [vibe, setVibe] = useState(null);
  const [durationTypeVal, setDurationTypeVal] = useState(null);
  const [budget, setBudget] = useState(null);
  const [diffLevel, setDiffLevel] = useState(null);
  const [tags, setTags] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState({});

  // Step 3
  const [stops, setStops] = useState([
    {time:"",icon:"📍",title:"",desc:""},
    {time:"",icon:"🍽️",title:"",desc:""},
    {time:"",icon:"🏠",title:"",desc:""},
  ]);
  const [tips, setTips] = useState(["",""]);
  const [photos, setPhotos] = useState([]);
  const fileRef = useRef();

  // ── Geocoding ───────────────────────────────────────────────────────────────
  const handleLocationInput = (val) => {
    setLocationInput(val);
    setGeoData(null);
    setGeoStatus("idle");
    setGeoSugg([]);
    clearTimeout(geoTimerRef.current);
    if (val.trim().length < 3) return;
    geoTimerRef.current = setTimeout(async () => {
      setGeoStatus("loading");
      const results = await geoSearch(val);
      setGeoSugg(results);
      setGeoStatus(results.length > 0 ? "idle" : "error");
    }, 400);
  };

  const selectGeoSugg = (s) => {
    setGeoData(s);
    setLocationInput(s.locationName);
    setGeoSugg([]);
    setGeoStatus("found");
  };

  // Reset scroll al cambiar de paso
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [step]);

  const clearGeo = () => {
    setGeoData(null);
    setLocationInput("");
    setGeoSugg([]);
    setGeoStatus("idle");
  };

  // ── Categories & Tags ───────────────────────────────────────────────────────
  const toggleCategory = (slug) => {
    setCategories(prev => prev.includes(slug) ? prev.filter(c=>c!==slug) : [...prev, slug]);
    if (slug === "montana" && categories.includes("montana")) setDiffLevel(null);
  };
  const toggleTagSimple = (slug) => setTags(prev => prev.includes(slug) ? prev.filter(s=>s!==slug) : [...prev, slug]);
  const toggleGroupExpand = (id) => setExpandedGroups(prev => ({...prev, [id]:!prev[id]}));
  const visibleGroups = TAG_GROUPS.filter(g => g.show(categories, vibe));

  // ── Stops & Tips ────────────────────────────────────────────────────────────
  const updateStop = (i,f,v) => { const s=[...stops]; s[i]={...s[i],[f]:v}; setStops(s); };
  const addStop = () => setStops([...stops,{time:"",icon:"📍",title:"",desc:""}]);
  const removeStop = (i) => stops.length>1&&setStops(stops.filter((_,idx)=>idx!==i));
  const updateTip = (i,v) => { const arr=[...tips]; arr[i]=v; setTips(arr); };
  const addTip = () => tips.length<5&&setTips([...tips,""]);
  const removeTip = (i) => tips.length>1&&setTips(tips.filter((_,idx)=>idx!==i));

  const handlePhotos = (e) => {
    const files = Array.from(e.target.files).slice(0,5);
    setPhotos(files.map(f=>({file:f,url:URL.createObjectURL(f)})));
  };

  // ── Publish ─────────────────────────────────────────────────────────────────
  const handlePublish = async () => {
    setUploading(true);
    setPublishError(null);
    let photoUrls = [];
    for (const p of photos) {
      const url = await db.uploadPhoto(p.file, user?.token);
      if (url) photoUrls.push(url);
    }
    const planData = {
      title: title.trim(),
      subtitle: subtitle.trim()||null,
      zone: zone.trim()||null,
      categories,
      vibe,
      duration_type: durationTypeVal,
      tags,
      difficulty_level: categories.includes("montana") ? diffLevel : null,
      location_name: geoData?.locationName || locationInput.trim() || null,
      province: geoData?.province||null,
      community: geoData?.community||null,
      lat: geoData?.lat||null,
      lon: geoData?.lon||null,
      budget,
      transport: tags.includes("con-coche")?"yes":tags.includes("sin-coche")?"no":null,
      group_type: ["pareja","amigos","familia","solo"].find(tg=>tags.includes(tg))||null,
      is_ai_generated: false,
      stops: stops.filter(s=>s.title.trim()).map(s=>({...s,tag:"Parada",tagColor:"accent"})),
      tips: tips.filter(Boolean),
      photos: photoUrls,
      image_url: photoUrls[0]||null,
      user_id: user?.id||null,
      author_name: user?.name||null,
      author_avatar_url: user?.avatar||null,
    };
    try {
      await db.submitPlan(planData, user?.token);
      setUploading(false);
      setDone(true);
      if (onUploaded) onUploaded();
    } catch(e) {
      setUploading(false);
      setPublishError(e.message||"No se pudo publicar el plan. Inténtalo de nuevo.");
    }
  };

  // ── Validation ──────────────────────────────────────────────────────────────
  const can1 = title.trim().length > 3 && (geoData !== null || locationInput.trim().length > 0);
  const can2 = durationTypeVal && categories.length > 0 && vibe && budget;
  const can3 = stops.filter(s=>s.title.trim()).length >= 1;

  // ── Style helpers ───────────────────────────────────────────────────────────
  const inp = (val) => ({
    background:C.bg, border:`1.5px solid ${val?C.accent:C.border}`,
    borderRadius:12, padding:"12px 14px", fontSize:14, color:C.text,
    outline:"none", fontFamily:F, width:"100%", transition:"border-color 0.2s", boxSizing:"border-box",
  });
  const SLabel = ({children}) => (
    <div style={{fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:0.8,marginBottom:8}}>{children}</div>
  );
  const Divider = () => <div style={{height:1,background:C.border,margin:"16px 0"}}/>;
  const Chip = ({active,onClick,children}) => (
    <button onClick={onClick} style={{
      background:active?C.black:C.bg, color:active?C.white:C.muted,
      border:`1.5px solid ${active?C.black:C.border}`,
      borderRadius:20, padding:"7px 13px", fontSize:13, fontWeight:600,
      cursor:"pointer", fontFamily:F, transition:"all 0.15s", flexShrink:0,
    }}>{children}</button>
  );

  const stepTitles = ["Título y ubicación","Cómo es el plan","El contenido","Revisar y publicar"];

  return (
    <div style={{position:"fixed",inset:0,background:C.overlay,zIndex:300,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={onClose}>
      <div style={{background:C.card,borderRadius:"20px 20px 0 0",width:"100%",maxWidth:480,maxHeight:"92vh",display:"flex",flexDirection:"column"}} onClick={e=>e.stopPropagation()}>

        {/* Header */}
        <div style={{padding:"16px 24px 0",flexShrink:0}}>
          <div style={{width:36,height:4,background:C.border,borderRadius:2,margin:"0 auto 14px"}}/>
          {!done && <>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <span style={{fontFamily:F,fontSize:17,fontWeight:800,color:C.black}}>{stepTitles[step-1]}</span>
              <span style={{fontSize:12,color:C.dim}}>{step}/{STEPS}</span>
            </div>
            <div style={{height:3,background:C.border,borderRadius:2}}>
              <div style={{height:"100%",width:`${(step/STEPS)*100}%`,background:C.accent,borderRadius:2,transition:"width 0.3s"}}/>
            </div>
          </>}
        </div>

        {/* Scrollable content */}
        <div ref={scrollRef} style={{overflowY:"auto",padding:"16px 24px 32px",flex:1}}>

          {/* Done */}
          {done && (
            <div style={{textAlign:"center",padding:"20px 0"}}>
              <div style={{fontSize:56,marginBottom:16}}>🎉</div>
              <div style={{fontFamily:F,fontSize:22,fontWeight:800,color:C.black,marginBottom:8}}>{t.thanks}</div>
              <div style={{fontSize:14,color:C.muted,marginBottom:24}}>{t.thanksDesc}</div>
              <Btn onClick={onClose} variant="black">{t.close}</Btn>
            </div>
          )}

          {/* ── PASO 1 ── */}
          {!done && step===1 && (
            <div style={{display:"flex",flexDirection:"column",gap:0}}>
              <SLabel>Título del plan *</SLabel>
              <input value={title} onChange={e=>setTitle(e.target.value)}
                placeholder="Ej: Amanecer en Montserrat + Viñedos Penedès"
                style={{...inp(title),marginBottom:14}}/>

              <SLabel>Subtítulo · <span style={{fontWeight:400,textTransform:"none",letterSpacing:0}}>Opcional</span></SLabel>
              <input value={subtitle} onChange={e=>setSubtitle(e.target.value)}
                placeholder="Ej: Montaña sagrada, vistas únicas y vino de la tierra"
                style={{...inp(subtitle),marginBottom:14}}/>

              <SLabel>Ubicación principal *</SLabel>
              <div style={{position:"relative",marginBottom:4}}>
                {geoStatus==="found" ? (
                  <div style={{display:"flex",alignItems:"center",gap:8,background:"#D6F0E0",border:"1.5px solid #1D6334",borderRadius:12,padding:"11px 14px"}}>
                    <span style={{fontSize:14,color:"#1D6334",fontWeight:600,flex:1}}>✅ {geoData?.label}</span>
                    <button onClick={clearGeo} style={{background:"transparent",border:"none",color:"#1D6334",cursor:"pointer",fontSize:18,lineHeight:1}}>×</button>
                  </div>
                ) : (
                  <>
                    <input value={locationInput} onChange={e=>handleLocationInput(e.target.value)}
                      placeholder="Ej: Ripoll, Montserrat, Madrid, Valencia..."
                      style={inp(locationInput)}/>
                    {geoStatus==="loading" && (
                      <div style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",fontSize:12,color:C.muted}}>Buscando...</div>
                    )}
                  </>
                )}
                {geoSugg.length>0 && geoStatus!=="found" && (
                  <div style={{position:"absolute",top:"100%",left:0,right:0,background:C.card,border:`1px solid ${C.border}`,borderRadius:12,boxShadow:"0 4px 16px rgba(0,0,0,0.1)",zIndex:10,overflow:"hidden",marginTop:4}}>
                    {geoSugg.map((s,i)=>(
                      <div key={i} onMouseDown={()=>selectGeoSugg(s)}
                        style={{padding:"10px 14px",fontSize:13,color:C.text,cursor:"pointer",borderBottom:i<geoSugg.length-1?`1px solid ${C.border}`:"none"}}
                        onMouseEnter={e=>e.currentTarget.style.background=C.bg}
                        onMouseLeave={e=>e.currentTarget.style.background=C.card}>
                        📍 {s.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {geoStatus==="error" && locationInput.length>=3 && (
                <div style={{fontSize:12,color:"#B91C1C",marginBottom:8,background:"#FEE2E2",borderRadius:8,padding:"6px 10px"}}>
                  No hemos encontrado esa ubicación. Prueba con la ciudad más cercana.
                </div>
              )}
              <div style={{fontSize:12,color:C.muted,marginBottom:14}}>Coordenadas y provincia se obtienen automáticamente.</div>

              <SLabel>¿El plan pasa por varios lugares? · <span style={{fontWeight:400,textTransform:"none",letterSpacing:0}}>Opcional</span></SLabel>
              <input value={zone} onChange={e=>setZone(e.target.value)}
                placeholder="Ej: Ripoll · Queralbs · Vall de Núria"
                style={{...inp(zone),marginBottom:6}}/>
              <div style={{fontSize:12,color:C.muted,marginBottom:16}}>Solo para mostrar en la tarjeta.</div>

              <Btn onClick={()=>can1&&setStep(2)} variant={can1?"black":"ghost"} style={{width:"100%",padding:"14px",borderRadius:14}}>
                Continuar →
              </Btn>
            </div>
          )}

          {/* ── PASO 2 ── */}
          {!done && step===2 && (
            <div>
              <SLabel>Duración *</SLabel>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {DUR_OPTS.map(o=><Chip key={o.v} active={durationTypeVal===o.v} onClick={()=>setDurationTypeVal(durationTypeVal===o.v?null:o.v)}>{o.l}</Chip>)}
              </div>

              <Divider/>

              <SLabel>Categorías * · <span style={{fontWeight:400,textTransform:"none",letterSpacing:0}}>Elige las que mejor describan el plan</span></SLabel>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {CAT_OPTS.map(o=><Chip key={o.slug} active={categories.includes(o.slug)} onClick={()=>toggleCategory(o.slug)}>{o.icon} {o.label}</Chip>)}
              </div>
              {categories.includes("montana") && (
                <div style={{marginTop:12}}>
                  <div style={{fontSize:12,color:C.muted,marginBottom:8}}>⛰️ Dificultad · Opcional</div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    {DIFF_OPTS.map(o=><Chip key={o.v} active={diffLevel===o.v} onClick={()=>setDiffLevel(diffLevel===o.v?null:o.v)}>{o.l}</Chip>)}
                  </div>
                </div>
              )}

              <Divider/>

              <SLabel>Vibe *</SLabel>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {VIBE_OPTS_UP.map(o=><Chip key={o.v} active={vibe===o.v} onClick={()=>setVibe(vibe===o.v?null:o.v)}>{o.i} {o.l}</Chip>)}
              </div>

              <Divider/>

              <SLabel>Presupuesto *</SLabel>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {BUDGET_OPTS_UP.map(o=><Chip key={o.v} active={budget===o.v} onClick={()=>setBudget(budget===o.v?null:o.v)}>{o.l}</Chip>)}
              </div>

              <Divider/>

              {/* Tags section */}
              <div style={{background:C.bg,borderRadius:14,padding:"14px 16px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <span style={{fontSize:13,fontWeight:700,color:C.black}}>Tags · <span style={{color:C.muted,fontWeight:500}}>Opcional</span></span>
                  {tags.length>0&&<span style={{fontSize:12,color:C.accentText,fontWeight:700,background:C.accent+"30",padding:"2px 8px",borderRadius:10}}>{tags.length} seleccionados</span>}
                </div>
                {visibleGroups.map(g=>{
                  const expanded = expandedGroups[g.id];
                  const shown = expanded ? g.tags : g.tags.slice(0,g.limit);
                  const hasMore = g.tags.length > g.limit;
                  return (
                    <div key={g.id} style={{marginBottom:12}}>
                      <div style={{fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:0.6,marginBottom:6}}>{g.label}</div>
                      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                        {shown.map(tag=>(
                          <button key={tag} onClick={()=>toggleTagSimple(tag)} style={{
                            background:tags.includes(tag)?C.accent:C.card,
                            color:tags.includes(tag)?C.accentText:C.muted,
                            border:`1.5px solid ${tags.includes(tag)?C.accent:C.border}`,
                            borderRadius:20,padding:"5px 11px",fontSize:12,fontWeight:600,
                            cursor:"pointer",fontFamily:F,transition:"all 0.15s",
                          }}>{TAG_LABELS[tag]||tag}</button>
                        ))}
                        {hasMore&&(
                          <button onClick={()=>toggleGroupExpand(g.id)} style={{
                            background:"transparent",border:`1.5px dashed ${C.border}`,
                            borderRadius:20,padding:"5px 11px",fontSize:12,color:C.dim,cursor:"pointer",fontFamily:F,
                          }}>{expanded?`Ver menos`:`+ ${g.tags.length-g.limit} más`}</button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:16}}>
                <Btn onClick={()=>setStep(1)} variant="ghost">{t.back}</Btn>
                <Btn onClick={()=>can2&&setStep(3)} variant={can2?"black":"ghost"}>{t.next}</Btn>
              </div>
            </div>
          )}

          {/* ── PASO 3 ── */}
          {!done && step===3 && (
            <div>
              <p style={{fontSize:13,color:C.muted,marginBottom:14,lineHeight:1.5}}>Mínimo 1 parada. La primera suele ser la salida y la última la vuelta.</p>
              <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:12}}>
                {stops.map((stop,i)=>(
                  <div key={i} style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:14,padding:14}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                      <span style={{fontSize:13,fontWeight:700,color:C.black}}>Parada {i+1}</span>
                      {stops.length>1&&<button onClick={()=>removeStop(i)} style={{background:"transparent",border:"none",color:C.muted,cursor:"pointer",fontSize:18}}>×</button>}
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"70px 1fr",gap:8,marginBottom:8}}>
                      <input value={stop.time} onChange={e=>updateStop(i,"time",e.target.value)} placeholder="10:00" style={{...inp(stop.time),padding:"10px 10px"}}/>
                      <input value={stop.title} onChange={e=>updateStop(i,"title",e.target.value)} placeholder={t.stopName} style={{...inp(stop.title),padding:"10px 12px"}}/>
                    </div>
                    <textarea value={stop.desc} onChange={e=>updateStop(i,"desc",e.target.value)} placeholder={t.stopDesc} style={{...inp(stop.desc),minHeight:60,resize:"none",padding:"10px 12px"}}/>
                  </div>
                ))}
              </div>
              <button onClick={addStop} style={{background:"transparent",border:`1.5px dashed ${C.border}`,borderRadius:12,padding:"12px",width:"100%",fontSize:13,fontWeight:600,color:C.muted,cursor:"pointer",fontFamily:F,marginBottom:20}}>{t.addStop}</button>

              <SLabel>Consejos · <span style={{fontWeight:400,textTransform:"none",letterSpacing:0}}>Opcional</span></SLabel>
              <p style={{fontSize:12,color:C.muted,marginBottom:10,lineHeight:1.5}}>Lo que no está en Google pero marca la diferencia.</p>
              <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:8}}>
                {tips.map((tip,i)=>(
                  <div key={i} style={{display:"flex",gap:8,alignItems:"center"}}>
                    <input value={tip} onChange={e=>updateTip(i,e.target.value)}
                      placeholder={`Consejo ${i+1} · Ej: Reserva el teleférico online`}
                      style={{...inp(tip),flex:1}}/>
                    {tips.length>1&&<button onClick={()=>removeTip(i)} style={{background:"transparent",border:"none",color:C.muted,cursor:"pointer",fontSize:18,flexShrink:0}}>×</button>}
                  </div>
                ))}
              </div>
              {tips.length<5&&<button onClick={addTip} style={{background:"transparent",border:`1.5px dashed ${C.border}`,borderRadius:10,padding:"8px",width:"100%",fontSize:12,color:C.dim,cursor:"pointer",fontFamily:F,marginBottom:16}}>+ Añadir consejo</button>}

              <SLabel>Fotos · <span style={{fontWeight:400,textTransform:"none",letterSpacing:0}}>Opcional</span></SLabel>
              <div style={{background:C.bg,border:`1.5px dashed ${C.border}`,borderRadius:14,padding:16,textAlign:"center",marginBottom:8}}>
                <div style={{fontSize:24,marginBottom:6}}>📸</div>
                <div style={{fontSize:12,color:C.muted,marginBottom:10}}>{t.photosDesc}</div>
                <input ref={fileRef} type="file" accept="image/*" multiple style={{display:"none"}} onChange={handlePhotos}/>
                <button onClick={()=>fileRef.current.click()} style={{background:C.accent,color:C.accentText,border:"none",borderRadius:10,padding:"8px 20px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:F}}>
                  {photos.length>0?`✓ ${photos.length} foto${photos.length>1?"s":""}`:t.addPhotos}
                </button>
                {photos.length>0&&(
                  <div style={{display:"flex",gap:8,marginTop:12,overflowX:"auto",justifyContent:"center"}}>
                    {photos.map((p,i)=><img key={i} src={p.url} style={{width:56,height:56,borderRadius:8,objectFit:"cover",flexShrink:0}} alt=""/>)}
                  </div>
                )}
              </div>

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:16}}>
                <Btn onClick={()=>setStep(2)} variant="ghost">{t.back}</Btn>
                <Btn onClick={()=>can3&&setStep(4)} variant={can3?"black":"ghost"}>{t.next}</Btn>
              </div>
            </div>
          )}

          {/* ── PASO 4 ── */}
          {!done && step===4 && (
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:14,padding:16}}>
                <div style={{fontSize:16,fontWeight:800,color:C.black,marginBottom:4,fontFamily:F}}>{title}</div>
                {subtitle&&<div style={{fontSize:13,color:C.muted,marginBottom:8}}>{subtitle}</div>}
                <div style={{fontSize:12,color:C.muted,marginBottom:2}}>📍 {geoData?.label||locationInput}</div>
                {zone&&<div style={{fontSize:12,color:C.muted,marginBottom:8}}>🗺️ {zone}</div>}
                <div style={{display:"flex",gap:6,flexWrap:"wrap",margin:"10px 0"}}>
                  {categories.map(c=>{const o=CAT_OPTS.find(x=>x.slug===c); return o?<span key={c} style={{fontSize:11,fontWeight:700,color:C.tagGreen.t,background:C.tagGreen.b,padding:"3px 9px",borderRadius:20}}>{o.icon} {o.label}</span>:null;})}
                  {vibe&&<span style={{fontSize:11,fontWeight:700,color:C.tagAccent.t,background:C.tagAccent.b,padding:"3px 9px",borderRadius:20}}>{VIBE_OPTS_UP.find(o=>o.v===vibe)?.i} {VIBE_OPTS_UP.find(o=>o.v===vibe)?.l}</span>}
                  {durationTypeVal&&<span style={{fontSize:11,fontWeight:700,color:C.tagMuted.t,background:C.tagMuted.b,padding:"3px 9px",borderRadius:20}}>{DUR_OPTS.find(o=>o.v===durationTypeVal)?.l}</span>}
                  {budget&&<span style={{fontSize:11,fontWeight:700,color:C.tagMuted.t,background:C.tagMuted.b,padding:"3px 9px",borderRadius:20}}>{BUDGET_OPTS_UP.find(o=>o.v===budget)?.l}</span>}
                </div>
                {tags.length>0&&<div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:8}}>{tags.map(tag=><span key={tag} style={{fontSize:10,fontWeight:600,color:C.muted,background:C.border,padding:"2px 8px",borderRadius:20}}>{TAG_LABELS[tag]||tag}</span>)}</div>}
                {diffLevel&&categories.includes("montana")&&<div style={{fontSize:12,color:C.muted,marginBottom:4}}>⛰️ {DIFF_OPTS.find(o=>o.v===diffLevel)?.l}</div>}
                <div style={{fontSize:12,color:C.muted}}>
                  {stops.filter(s=>s.title).length} parada{stops.filter(s=>s.title).length!==1?"s":""} · {tips.filter(Boolean).length} consejo{tips.filter(Boolean).length!==1?"s":""} · {photos.length} foto{photos.length!==1?"s":""}
                </div>
              </div>
              <div style={{background:C.accent+"20",border:`1px solid ${C.accent}`,borderRadius:12,padding:12,fontSize:13,color:C.accentText}}>
                ✓ Tu plan aparecerá en el feed inmediatamente
              </div>
              {publishError&&<div style={{background:"#FEE2E2",border:"1px solid #FCA5A5",borderRadius:10,padding:"10px 14px",fontSize:13,color:"#B91C1C"}}>{publishError}</div>}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <Btn onClick={()=>setStep(3)} variant="ghost">{t.back}</Btn>
                <Btn onClick={handlePublish} variant="accent" style={{opacity:uploading?0.7:1}}>{uploading?"Subiendo...":"Publicar plan ✓"}</Btn>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ── Auth Modal ────────────────────────────────────────────────────────────────
function AuthModal({t, onClose, onSuccess}) {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()||!password.trim()) { setError("Rellena todos los campos"); return; }
    if (!isLogin&&password.length<6) { setError("La contraseña debe tener al menos 6 caracteres"); return; }
    setLoading(true); setError("");
    try {
      const data = isLogin ? await auth.signIn(email,password) : await auth.signUp(email,password,name);
      if (data.error||data.msg) { setError(data.error_description||data.msg||"Error. Inténtalo de nuevo."); setLoading(false); return; }
      if (data.access_token) {
        auth.save(data);
        setDone(true);
        setTimeout(()=>{ onSuccess({token:data.access_token,id:data.user?.id,email:data.user?.email,name:data.user?.user_metadata?.full_name||data.user?.email?.split("@")[0]}); onClose(); },800);
      } else { setError("Error inesperado. Inténtalo de nuevo."); setLoading(false); }
    } catch { setError("Error de conexión."); setLoading(false); }
  };

  const inp = {background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:12,padding:"14px 16px",fontSize:14,color:C.text,outline:"none",fontFamily:F,width:"100%",boxSizing:"border-box"};

  return (
    <div style={{position:"fixed",inset:0,background:C.overlay,zIndex:400,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={onClose}>
      <div style={{background:C.card,borderRadius:"20px 20px 0 0",padding:24,width:"100%",maxWidth:480}} onClick={e=>e.stopPropagation()}>
        <div style={{width:36,height:4,background:C.border,borderRadius:2,margin:"0 auto 20px"}}/>
        {done ? (
          <div style={{textAlign:"center",padding:"20px 0"}}>
            <div style={{fontSize:48,marginBottom:12}}>✓</div>
            <div style={{fontSize:18,fontWeight:700,color:C.black,fontFamily:F}}>¡Bienvenido/a!</div>
          </div>
        ) : (
          <>
            <h2 style={{fontFamily:F,fontSize:20,fontWeight:900,color:C.black,marginBottom:6}}>{isLogin?t.login:t.register}</h2>
            <p style={{fontSize:13,color:C.muted,marginBottom:20}}>{t.loginSub}</p>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {!isLogin&&<input value={name} onChange={e=>setName(e.target.value)} placeholder={t.name} style={inp}/>}
              <input value={email} onChange={e=>setEmail(e.target.value)} placeholder={t.email} type="email" style={{...inp,border:`1.5px solid ${email?C.accent:C.border}`}}/>
              <input value={password} onChange={e=>setPassword(e.target.value)} placeholder={t.password} type="password" style={{...inp,border:`1.5px solid ${password.length>=6?C.accent:C.border}`}}/>
              {error&&<div style={{background:"#FEE2E2",border:"1px solid #FCA5A5",borderRadius:10,padding:"10px 14px",fontSize:13,color:"#B91C1C"}}>{error}</div>}
              <Btn onClick={handleSubmit} variant="black" style={{width:"100%",padding:"15px",fontSize:15,borderRadius:14,opacity:loading?0.7:1}}>{loading?"...":(isLogin?t.login:t.register)}</Btn>
              <button onClick={()=>{setIsLogin(!isLogin);setError("");}} style={{background:"transparent",border:"none",color:C.muted,fontSize:13,cursor:"pointer",fontFamily:F}}>{isLogin?t.noAccount:t.alreadyAccount}</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Time Selector ─────────────────────────────────────────────────────────────
function TimeSelector({t, onComplete}) {
  const [mode, setMode] = useState("day");
  const [sel, setSel] = useState(null);
  const [end, setEnd] = useState(null);
  const [sh, setSh] = useState(9);
  const [eh, setEh] = useState(20);

  // Month navigation
  const nowRef = new Date();
  const [viewYear, setViewYear] = useState(nowRef.getFullYear());
  const [viewMonth, setViewMonth] = useState(nowRef.getMonth());

  const todayYear = nowRef.getFullYear();
  const todayMonth = nowRef.getMonth();
  const todayDay = nowRef.getDate();

  const daysInMonth = new Date(viewYear, viewMonth+1, 0).getDate();
  const rawFirst = new Date(viewYear, viewMonth, 1).getDay();
  const fd = rawFirst===0?6:rawFirst-1;
  const monthName = new Date(viewYear, viewMonth, 1).toLocaleString("es",{month:"long",year:"numeric"});
  const fmt = h=>`${String(h).padStart(2,"0")}:00`;

  const isCurrentMonth = viewYear===todayYear && viewMonth===todayMonth;
  const isPast = (day) => isCurrentMonth && day < todayDay;

  const prevMonth = () => {
    if (isCurrentMonth) return; // can't go before current month
    if (viewMonth===0) { setViewMonth(11); setViewYear(viewYear-1); }
    else setViewMonth(viewMonth-1);
    setSel(null); setEnd(null);
  };
  const nextMonth = () => {
    if (viewMonth===11) { setViewMonth(0); setViewYear(viewYear+1); }
    else setViewMonth(viewMonth+1);
    setSel(null); setEnd(null);
  };

  const click = day => {
    if (isPast(day)) return;
    if (mode==="day") { setSel(day); setEnd(day); }
    else if (mode==="weekend") {
      const dow = new Date(viewYear,viewMonth,day).getDay();
      let sat = dow===6?day:dow===0?day-1:day+(6-dow);
      sat = Math.min(sat,daysInMonth);
      setSel(sat); setEnd(Math.min(sat+1,daysInMonth));
    } else {
      if (!sel||end) { setSel(day); setEnd(null); }
      else { day<sel?(setEnd(sel),setSel(day)):setEnd(day); }
    }
  };

  const isSel = d=>d===sel||d===end;
  const isRange = d=>sel&&end&&end>sel&&d>sel&&d<end;
  const isToday = d=>isCurrentMonth&&d===todayDay;
  const dur = !sel?null:(!end||end===sel)?"1 día":end-sel+1===2?"Fin de semana":`${end-sel+1} días`;

  return (
    <div>
      <div style={{display:"flex",gap:8,marginBottom:18}}>
        {[{id:"day",l:"Un día"},{id:"weekend",l:"Fin de semana"},{id:"custom",l:"Personalizado"}].map(m=>(
          <button key={m.id} onClick={()=>{setMode(m.id);setSel(null);setEnd(null);}} style={{flex:1,background:mode===m.id?C.black:C.bg,color:mode===m.id?C.white:C.muted,border:`1.5px solid ${mode===m.id?C.black:C.border}`,borderRadius:10,padding:"10px 0",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:F}}>{m.l}</button>
        ))}
      </div>

      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:16,marginBottom:14}}>
        {/* Month navigation */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
          <button onClick={prevMonth} disabled={isCurrentMonth} style={{background:"transparent",border:"none",fontSize:18,cursor:isCurrentMonth?"default":"pointer",color:isCurrentMonth?C.dim:C.black,padding:"0 8px"}}>‹</button>
          <div style={{textAlign:"center",fontSize:14,fontWeight:800,color:C.black,textTransform:"capitalize"}}>{monthName}</div>
          <button onClick={nextMonth} style={{background:"transparent",border:"none",fontSize:18,cursor:"pointer",color:C.black,padding:"0 8px"}}>›</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",marginBottom:6}}>
          {["L","M","X","J","V","S","D"].map(d=><div key={d} style={{textAlign:"center",fontSize:11,color:C.dim,fontWeight:700}}>{d}</div>)}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}}>
          {Array.from({length:fd},(_,i)=><div key={`e${i}`}/>)}
          {Array.from({length:daysInMonth},(_,i)=>{
            const day=i+1; const s=isSel(day); const r=isRange(day); const past=isPast(day);
            return <button key={day} onClick={()=>click(day)} style={{aspectRatio:"1",borderRadius:8,background:s?C.accent:r?C.accent+"40":"transparent",border:isToday(day)&&!s?`2px solid ${C.accent}`:"1px solid transparent",color:s?C.accentText:past?C.dim:C.black,fontSize:13,fontWeight:s?800:400,cursor:past?"default":"pointer",fontFamily:F}}>{day}</button>;
          })}
        </div>
        {sel&&<div style={{marginTop:10,textAlign:"center",fontSize:13,color:C.accentText,fontWeight:700,background:C.accent+"25",borderRadius:8,padding:"6px"}}>{mode==="custom"&&!end?"Selecciona el día de vuelta":`✓ ${dur} seleccionado`}</div>}
      </div>

      {mode!=="weekend" && (
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:16,marginBottom:18}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <span style={{fontSize:14,fontWeight:800,color:C.black,fontFamily:F}}>⏰ Horas disponibles</span>
            <span style={{fontSize:12,fontWeight:700,color:C.accentText,background:C.accent+"30",padding:"3px 10px",borderRadius:20}}>{eh-sh}h</span>
          </div>
          <div style={{height:6,background:C.border,borderRadius:3,marginBottom:12,position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",left:`${(sh/23)*100}%`,width:`${((eh-sh)/23)*100}%`,height:"100%",background:C.accent,borderRadius:3}}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[{label:"Desde",opts:[7,8,9,10,11,12],val:sh,set:setSh},{label:"Hasta",opts:[14,16,18,20,22,23],val:eh,set:setEh}].map(({label,opts,val,set})=>(
              <div key={label}>
                <div style={{fontSize:11,color:C.muted,marginBottom:6,fontWeight:700,textTransform:"uppercase",letterSpacing:0.5}}>{label}</div>
                <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                  {opts.map(h=><button key={h} onClick={()=>set(h)} style={{background:val===h?C.black:C.bg,color:val===h?C.white:C.muted,border:`1.5px solid ${val===h?C.black:C.border}`,borderRadius:8,padding:"5px 7px",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:F}}>{fmt(h)}</button>)}
                </div>
              </div>
            ))}
          </div>
          <div style={{marginTop:12,padding:"8px",background:C.accent+"20",borderRadius:10,fontSize:13,color:C.accentText,fontWeight:700,textAlign:"center"}}>{fmt(sh)} → {fmt(eh)} · {eh-sh}h</div>
        </div>
      )}

      {mode==="weekend"&&sel&&(
        <div style={{background:C.accent+"15",border:`1px solid ${C.accent}`,borderRadius:14,padding:14,marginBottom:18,textAlign:"center",fontSize:13,color:C.accentText,fontWeight:600}}>
          🗓️ Plan para todo el fin de semana · Días {sel} y {end}
        </div>
      )}

      <button onClick={()=>sel&&onComplete({date:sel,endDate:end,startHour:sh,endHour:eh,mode,year:viewYear,month:viewMonth})}
        style={{width:"100%",background:sel?C.black:C.border,color:sel?C.white:C.dim,border:"none",borderRadius:14,padding:"15px",fontSize:15,fontWeight:700,cursor:sel?"pointer":"default",fontFamily:F}}>
        {sel?`Continuar con ${dur} →`:t.selectDay}
      </button>
    </div>
  );
}

// ── Quiz ──────────────────────────────────────────────────────────────────────
function QuizScreen({t, timeData, onComplete, onBack}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [txt, setTxt] = useState("");
  const q = QUESTIONS[step];

  const labels = {
    group:{pareja:t.couple,amigos:t.friends,familia:t.family,solo:t.solo},
    transport:{yes:t.withCar,no:t.noCar},
    budget:{low:t.cheap,mid:t.normal,high:t.unlimited},
    vibe:{naturaleza:t.nature,cultura:t.culture,gastronomia:t.food,tranquilidad:t.chill,aventura:t.adventure},
  };

  const qData = {
    location:{q:t.whereFrom,sub:t.whereFromSub},
    group:{q:t.whosComing,sub:t.whosComingSub},
    transport:{q:t.haveCar,sub:t.haveCarSub},
    budget:{q:t.budget,sub:t.budgetSub},
    vibe:{q:t.vibe,sub:t.vibeSub},
  }[q.id];

  const answer = val => {
    const a={...answers,[q.id]:val};
    setAnswers(a);
    if (step<QUESTIONS.length-1) { setStep(step+1); setTxt(""); }
    else onComplete(a);
  };

  return (
    <div style={{minHeight:"100vh",background:C.bg,paddingTop:52}}>
      <div style={{height:3,background:C.border}}>
        <div style={{height:"100%",width:`${(step/QUESTIONS.length)*100}%`,background:C.accent,transition:"width 0.4s"}}/>
      </div>
      <div style={{padding:"20px 16px 40px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
          <button onClick={()=>step>0?setStep(step-1):onBack()} style={{background:"transparent",border:"none",color:C.muted,cursor:"pointer",fontSize:14,fontFamily:F}}>{t.back}</button>
          <span style={{fontSize:12,color:C.dim,fontWeight:600}}>{step+1} / {QUESTIONS.length}</span>
        </div>
        {timeData&&<div style={{background:C.accent+"20",border:`1px solid ${C.accent}`,borderRadius:12,padding:"10px 14px",fontSize:12,color:C.accentText,fontWeight:700,marginBottom:20}}>📅 {timeData.mode==="weekend"?"Fin de semana":"1 día"} · ⏰ {String(timeData.startHour||9).padStart(2,"0")}:00 → {String(timeData.endHour||20).padStart(2,"0")}:00</div>}
        <div style={{fontSize:40,marginBottom:14}}>{q.emoji}</div>
        <h2 style={{fontFamily:F,fontSize:24,fontWeight:900,color:C.black,marginBottom:8,lineHeight:1.2,letterSpacing:-0.3}}>{qData.q}</h2>
        <p style={{fontSize:14,color:C.muted,marginBottom:26}}>{qData.sub}</p>
        {q.type==="text"?(
          <div>
            <input value={txt} onChange={e=>setTxt(e.target.value)} placeholder="Barcelona, Madrid, Sevilla..." onKeyDown={e=>e.key==="Enter"&&txt.trim()&&answer(txt)}
              style={{width:"100%",background:C.card,border:`2px solid ${txt?C.accent:C.border}`,borderRadius:14,padding:"15px 18px",fontSize:15,color:C.black,outline:"none",marginBottom:14,boxSizing:"border-box",fontFamily:F,transition:"border-color 0.2s"}}/>
            <Btn onClick={()=>txt.trim()&&answer(txt)} variant={txt.trim()?"black":"ghost"} style={{width:"100%",padding:"15px",fontSize:15,borderRadius:14}}>{t.next}</Btn>
          </div>
        ):(
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {q.opts.map(o=>(
              <button key={o.v} onClick={()=>answer(o.v)}
                style={{background:C.card,border:`2px solid ${C.border}`,borderRadius:14,padding:"14px 18px",cursor:"pointer",display:"flex",alignItems:"center",gap:14,color:C.black,transition:"all 0.15s",fontFamily:F}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=C.accent;e.currentTarget.style.background=C.accent+"15";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.card;}}>
                <span style={{fontSize:26}}>{o.i}</span>
                <div>
                  <div style={{fontSize:15,fontWeight:700}}>{labels[q.id]?.[o.v]||o.v}</div>
                  {o.s&&<div style={{fontSize:12,color:C.muted}}>{o.s}</div>}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Loading ───────────────────────────────────────────────────────────────────
function LoadingScreen({t}) {
  const [phase, setPhase] = useState(0);
  useEffect(()=>{ const i=setInterval(()=>setPhase(p=>p<t.loadingSteps.length-1?p+1:p),800); return()=>clearInterval(i); },[]);
  return (
    <div style={{minHeight:"100vh",background:C.black,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{fontSize:56,marginBottom:20,animation:"spin 2s linear infinite"}}>◌</div>
      <h2 style={{fontFamily:F,fontSize:22,fontWeight:900,color:C.white,marginBottom:6,textAlign:"center"}}>{t.preparing}</h2>
      <p style={{fontSize:13,color:"rgba(255,255,255,0.35)",marginBottom:36}}>OnlyPlans IA</p>
      <div style={{width:"100%",maxWidth:280,display:"flex",flexDirection:"column",gap:14}}>
        {t.loadingSteps.map((p,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:12,opacity:i<=phase?1:0.15,transition:"opacity 0.5s"}}>
            <div style={{width:20,height:20,borderRadius:"50%",background:i<phase?C.accent:i===phase?C.white:"rgba(255,255,255,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,flexShrink:0,color:i<phase?C.accentText:C.black}}>{i<phase?"✓":""}</div>
            <span style={{fontSize:13,color:i<=phase?C.white:"rgba(255,255,255,0.3)",fontFamily:F}}>{p}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Generated Plan ────────────────────────────────────────────────────────────
function GeneratedPlan({plan, answers, t, onBack, onRegen, go, error, user, onRequireAuth}) {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    // Punto 1: usuario no autenticado → solicitar login, no marcar como guardado
    if (!user) { onRequireAuth(); return; }
    if (!plan || saving || saved) return;
    setSaving(true);
    try {
      // Valores por defecto seguros para campos opcionales que puede omitir la IA (Punto 3)
      const planData = {
        title:     plan.title     || "Plan generado",
        subtitle:  plan.subtitle  || "",
        zone:      plan.zone      || "",
        emoji:     plan.emoji     || "🗺️",
        vibe:      ["relax","aventura","social"].includes(plan.vibe) ? plan.vibe : "social",
        budget:    plan.budget    || "mid",
        transport: plan.transport || "yes",
        stops:     Array.isArray(plan.stops) ? plan.stops : [],
        tips:      Array.isArray(plan.tips)  ? plan.tips  : [],
        photos: [], image_url: null,
        is_ai_generated: true,
        user_id: user.id,
      };
      // Punto 2: solo marcar como guardado si Supabase confirma el INSERT
      const result = await db.submitPlan(planData, user.token);
      if (result?.id) {
        await db.savePlan(result.id, user.id, user.token);
        db.saveToLocal({...planData, id: result.id});
        setSaved(true);
      }
    } catch {}
    setSaving(false);
  };

  if (error) return (
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,paddingTop:80}}>
      <div style={{fontSize:52,marginBottom:16}}>😕</div>
      <h2 style={{fontFamily:F,fontSize:20,fontWeight:900,color:C.black,marginBottom:10,textAlign:"center"}}>Algo ha fallado</h2>
      <p style={{fontSize:14,color:C.muted,textAlign:"center",marginBottom:24,lineHeight:1.6}}>{error}</p>
      <Btn onClick={onRegen} variant="black">Intentar de nuevo</Btn>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:C.bg,paddingTop:52,paddingBottom:40}}>
      <div style={{padding:"20px 16px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <button onClick={onBack} style={{background:"transparent",border:"none",color:C.muted,cursor:"pointer",fontSize:14,fontFamily:F}}>← Inicio</button>
          <span style={{fontSize:12,color:C.muted}}>Plan generado por IA</span>
        </div>
        {plan&&(
          <>
            <div style={{background:C.black,borderRadius:20,padding:22,marginBottom:20}}>
              <div style={{fontSize:40,marginBottom:12}}>{plan.emoji||"🗺️"}</div>
              <h1 style={{fontFamily:F,fontSize:20,fontWeight:900,color:C.white,marginBottom:8,lineHeight:1.2}}>{plan.title}</h1>
              <p style={{fontSize:13,color:"rgba(255,255,255,0.55)",marginBottom:10}}>{plan.subtitle}</p>
              <div style={{fontSize:12,color:C.accent,fontWeight:700}}>📍 {plan.zone}</div>
            </div>
            <h2 style={{fontFamily:F,fontSize:17,fontWeight:800,color:C.black,marginBottom:16}}>{t.planDay}</h2>
            <div style={{marginBottom:20}}>
              {plan.stops?.map((stop,i)=>{
                const s=tagC(stop.tagColor);
                return (
                  <div key={i} style={{display:"flex",gap:14}}>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center",width:34,flexShrink:0}}>
                      <div style={{width:32,height:32,borderRadius:"50%",background:s.b,border:`2px solid ${s.t}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>{stop.icon}</div>
                      {i<plan.stops.length-1&&<div style={{width:2,flex:1,background:C.border,margin:"4px 0"}}/>}
                    </div>
                    <div style={{paddingBottom:18,flex:1}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                        <span style={{fontSize:12,color:C.accentText,fontWeight:800}}>{stop.time}</span>
                        <span style={{fontSize:10,fontWeight:700,color:s.t,background:s.b,padding:"2px 8px",borderRadius:20,textTransform:"uppercase"}}>{stop.tag}</span>
                      </div>
                      <div style={{fontSize:14,fontWeight:700,color:C.black,marginBottom:3,fontFamily:F}}>{stop.title}</div>
                      <div style={{fontSize:13,color:C.muted,lineHeight:1.5}}>{stop.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            {plan.tips?.length>0&&(
              <div style={{background:C.accent+"25",border:`1.5px solid ${C.accent}`,borderRadius:16,padding:16,marginBottom:20}}>
                <div style={{fontSize:13,fontWeight:800,color:C.accentText,marginBottom:10,fontFamily:F}}>💡 {t.tips}</div>
                {plan.tips.map((tip,i)=><div key={i} style={{fontSize:13,color:C.text,marginBottom:6,display:"flex",gap:8}}><span style={{color:C.accentText}}>•</span><span>{tip}</span></div>)}
              </div>
            )}
          </>
        )}
        <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:8}}>
          <Btn onClick={handleSave} variant={saved?"accent":"black"} style={{width:"100%",padding:"15px",fontSize:15,borderRadius:14,opacity:saving?0.7:1}}>{saved?"✓ "+t.saved:saving?"...":t.save+" este plan"}</Btn>
          <Btn onClick={onRegen} variant="ghost" style={{width:"100%",padding:"14px",borderRadius:14}}>{t.generateNew}</Btn>
          <Btn onClick={()=>go("feed")} variant="ghost" style={{width:"100%",padding:"14px",borderRadius:14}}>Ver más planes →</Btn>
        </div>
      </div>
    </div>
  );
}

// ── Profile Screen ────────────────────────────────────────────────────────────
function ProfileScreen({t, lang, setLang, onUpload, isLoggedIn, onLogin, user, onLogout, go, onPlanClick}) {
  const [savedPlans, setSavedPlans] = useState([]);
  const [myPlans, setMyPlans] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState(null);
  const avatarRef = useRef();

  useEffect(()=>{
    // Load saved plans from Supabase when logged in, fallback to localStorage
    if (user?.id && user?.token) {
      db.getSavedPlans(user.id, user.token).then(plans => {
        if (plans && plans.length >= 0) {
          setSavedPlans(plans);
        } else {
          setSavedPlans(db.getSavedLocal());
        }
      }).catch(() => setSavedPlans(db.getSavedLocal()));
    } else {
      setSavedPlans(db.getSavedLocal());
    }
    // Load my plans from Supabase
    if (user?.id) {
      fetch(`${SUPABASE_URL}/rest/v1/plans?user_id=eq.${user.id}&order=created_at.desc`, {headers:db.h})
        .then(r=>r.json())
        .then(d=>{ setMyPlans(Array.isArray(d) ? d : []); })
        .catch(()=>setMyPlans([]));
    } else {
      setMyPlans([]);
    }
    // Load persisted bio/avatar
    try {
      const profile = JSON.parse(localStorage.getItem("op_profile") || "{}");
      if (profile.bio) setBio(profile.bio);
      if (profile.avatar) setAvatar(profile.avatar);
    } catch {}
  },[user?.id]);

  if (!isLoggedIn) return (
    <div style={{minHeight:"100vh",background:C.bg,paddingTop:52,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"52px 24px 40px"}}>
      <div style={{fontSize:56,marginBottom:20}}>👤</div>
      <h2 style={{fontFamily:F,fontSize:22,fontWeight:900,color:C.black,marginBottom:10,textAlign:"center"}}>{t.register}</h2>
      <p style={{fontSize:14,color:C.muted,textAlign:"center",marginBottom:32,lineHeight:1.6}}>Regístrate para guardar planes, subir los tuyos y llevar un historial de tus escapadas.</p>
      <Btn onClick={onLogin} variant="black" style={{width:"100%",maxWidth:320,padding:"15px",fontSize:15,borderRadius:14,marginBottom:12}}>{t.register}</Btn>
      <button onClick={onLogin} style={{background:"transparent",border:"none",color:C.muted,fontSize:14,cursor:"pointer",fontFamily:F}}>{t.alreadyAccount}</button>
    </div>
  );

  const initial = (user?.name||user?.email||"U")[0].toUpperCase();

  return (
    <div style={{minHeight:"100vh",background:C.bg,paddingTop:52,paddingBottom:60,overscrollBehaviorY:"contain"}}>

      {/* Cover + Avatar */}
      <div style={{position:"relative",height:120,background:`linear-gradient(135deg,${C.accent}60,${C.accentDark}80)`,marginBottom:50}}>
        <div style={{position:"absolute",bottom:-40,left:20,width:80,height:80,borderRadius:"50%",background:C.accent,border:`3px solid ${C.bg}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,fontWeight:900,color:C.accentText,fontFamily:F,overflow:"hidden",cursor:editMode?"pointer":"default"}}
          onClick={()=>editMode&&avatarRef.current.click()}>
          {avatar?<img src={avatar} style={{width:80,height:80,objectFit:"cover"}} alt=""/>:initial}
          {editMode&&<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>📷</div>}
        </div>
        <input ref={avatarRef} type="file" accept="image/*" style={{display:"none"}} onChange={e => {
          const f = e.target.files[0];
          if (!f) return;
          const reader = new FileReader();
          reader.onload = (ev) => setAvatar(ev.target.result);
          reader.readAsDataURL(f);
        }}/>
        <div style={{position:"absolute",top:12,right:12,display:"flex",gap:8}}>
          <button onClick={()=>{
            if (editMode) { try { localStorage.setItem("op_profile", JSON.stringify({bio, avatar})); } catch {} }
            setEditMode(!editMode);
          }} style={{background:editMode?C.black:C.bg,color:editMode?C.white:C.muted,border:`1px solid ${editMode?C.black:C.border}`,borderRadius:20,padding:"6px 14px",fontSize:12,cursor:"pointer",fontFamily:F,fontWeight:700}}>
            {editMode?t.saveProfile:t.editProfile}
          </button>
          <button onClick={onLogout} style={{background:"rgba(255,255,255,0.8)",border:"none",borderRadius:20,padding:"6px 14px",fontSize:12,color:C.muted,cursor:"pointer",fontFamily:F}}>{t.logout}</button>
        </div>
      </div>

      <div style={{padding:"0 16px"}}>
        {/* Name + bio */}
        <div style={{marginBottom:16}}>
          <div style={{fontFamily:F,fontSize:20,fontWeight:900,color:C.black,marginBottom:2}}>{user?.name||"Mi perfil"}</div>
          <div style={{fontSize:12,color:C.muted,marginBottom:8}}>{user?.email}</div>
          {editMode ? (
            <textarea value={bio} onChange={e=>setBio(e.target.value)} placeholder={t.bioPlaceholder} style={{width:"100%",background:C.card,border:`1.5px solid ${C.accent}`,borderRadius:12,padding:"10px 14px",fontSize:13,color:C.text,outline:"none",fontFamily:F,minHeight:70,resize:"none",boxSizing:"border-box"}}/>
          ) : bio ? (
            <div style={{fontSize:13,color:C.text,lineHeight:1.6}}>{bio}</div>
          ) : (
            <button onClick={()=>setEditMode(true)} style={{background:"transparent",border:`1px dashed ${C.border}`,borderRadius:10,padding:"8px 14px",fontSize:12,color:C.dim,cursor:"pointer",fontFamily:F}}>+ Añadir bio</button>
          )}
        </div>

        {/* Stats */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:1,background:C.border,borderRadius:16,overflow:"hidden",marginBottom:20}}>
          {[{n:String(myPlans.length),l:"Planes"},{n:String(savedPlans.length),l:"Guardados"},{n:String(myPlans.filter(p=>!p.is_ai_generated).length),l:"Subidos"}].map((s,i)=>(
            <div key={i} style={{background:C.card,padding:"16px 8px",textAlign:"center"}}>
              <div style={{fontFamily:F,fontSize:22,fontWeight:900,color:C.black}}>{s.n}</div>
              <div style={{fontSize:11,color:C.muted,marginTop:2}}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Upload CTA */}
        <Btn onClick={onUpload} variant="black" style={{width:"100%",padding:"13px",fontSize:14,borderRadius:14,marginBottom:24}}>
          📝 {t.uploadPlan}
        </Btn>

        {/* My plans gallery */}
        {myPlans.length > 0 && (
          <div style={{marginBottom:24}}>
            <h3 style={{fontFamily:F,fontSize:15,fontWeight:800,color:C.black,marginBottom:12}}>Mis planes</h3>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {myPlans.map((p,i)=>(
                <div key={i} style={{borderRadius:14,overflow:"hidden",background:C.card,border:`1px solid ${C.border}`,cursor:"pointer",position:"relative"}}
                  onClick={()=>onPlanClick&&onPlanClick(p)}>
                  {(() => {
                    const src = p.img || (Array.isArray(p.photos) && p.photos[0]) || null;
                    return src
                      ? <img src={src} alt="" style={{width:"100%",height:100,objectFit:"cover"}} onError={e=>e.target.style.display="none"}/>
                      : <div style={{width:"100%",height:100,background:`linear-gradient(135deg,${C.accent}40,${C.accent}20)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:32}}>{p.emoji||"🗺️"}</div>;
                  })()}
                  <div style={{padding:"8px 10px 10px"}}>
                    <div style={{fontSize:12,fontWeight:700,color:C.black,lineHeight:1.3,marginBottom:2,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{p.title}</div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={{fontSize:10,color:C.muted}}>{p.zone}</span>
                      <span style={{fontSize:10,color:C.accentText}}>{p.is_ai_generated?"✦ IA":"📝"}</span>
                    </div>
                  </div>
                  <button onClick={async e=>{
                    e.stopPropagation();
                    if (!window.confirm("¿Seguro que quieres eliminar este plan? Esta acción no se puede deshacer.")) return;
                    const ok = await db.deletePlan(p, user.token);
                    if (ok) setMyPlans(prev => prev.filter(x => x.id !== p.id));
                  }}
                    style={{position:"absolute",top:6,right:6,background:"rgba(0,0,0,0.5)",border:"none",borderRadius:"50%",width:22,height:22,cursor:"pointer",fontSize:11,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Saved plans */}
        <div style={{marginBottom:24}}>
          <h3 style={{fontFamily:F,fontSize:15,fontWeight:800,color:C.black,marginBottom:12}}>{t.savedPlans}</h3>
          {savedPlans.length>0?(
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {savedPlans.map((p,i)=>(
                <div key={i} onClick={()=>onPlanClick&&onPlanClick(p)} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",background:C.card,border:`1px solid ${C.border}`,borderRadius:14,cursor:"pointer"}}>
                  {p.img?<img src={p.img} style={{width:52,height:52,borderRadius:10,objectFit:"cover",flexShrink:0}} alt="" onError={e=>e.target.style.display="none"}/>:<span style={{fontSize:28,flexShrink:0}}>{p.emoji||"🗺️"}</span>}
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:700,color:C.black,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{p.title}</div>
                    <div style={{fontSize:11,color:C.muted}}>{p.zone}</div>
                  </div>
                  <button onClick={e=>{e.stopPropagation();db.removeSavedLocal(p.id);if(user?.id&&user?.token)db.unsavePlan(p.id,user.id,user.token);setSavedPlans(prev=>prev.filter(x=>x.id!==p.id));}} style={{background:"transparent",border:"none",color:C.dim,cursor:"pointer",fontSize:18,padding:"4px"}}>×</button>
                </div>
              ))}
            </div>
          ):(
            <div style={{textAlign:"center",padding:"24px 0",background:C.card,border:`1px solid ${C.border}`,borderRadius:16}}>
              <div style={{fontSize:32,marginBottom:8}}>🔖</div>
              <div style={{fontSize:13,color:C.muted}}>{t.noSaved}</div>
            </div>
          )}
        </div>

        {/* Language */}
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:16}}>
          <div style={{fontSize:13,fontWeight:800,color:C.black,marginBottom:12,fontFamily:F}}>🌐 {t.language}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[{code:"es",label:t.langEs},{code:"ca",label:t.langCa}].map(l=>(
              <button key={l.code} onClick={()=>setLang(l.code)} style={{background:lang===l.code?C.accent:C.bg,color:lang===l.code?C.accentText:C.muted,border:`1.5px solid ${lang===l.code?C.accent:C.border}`,borderRadius:12,padding:"12px 0",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:F,transition:"all 0.2s"}}>{l.label}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── User Profile Screen ───────────────────────────────────────────────────────
function UserProfileScreen({userId, userName, t, onBack, onPlanClick}) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState(userName||null);

  useEffect(()=>{
    if (!userId) { setLoading(false); return; }

    // Cargar nombre real desde profiles si author_name no llegó o es genérico
    if (!userName || userName === "usuario") {
      db.getProfile(userId).then(profile => {
        if (profile?.full_name) setDisplayName(profile.full_name);
      }).catch(()=>{});
    }

    fetch(`${SUPABASE_URL}/rest/v1/plans?user_id=eq.${userId}&is_approved=eq.true&order=votes_count.desc`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    })
      .then(r=>r.json())
      .then(d=>{
        const list = Array.isArray(d) ? d : [];
        setPlans(list);
        // Si aún no tenemos nombre, intentar obtenerlo del primer plan
        if (!displayName && list.length > 0 && list[0].author_name) {
          setDisplayName(list[0].author_name);
        }
        setLoading(false);
      })
      .catch(()=>setLoading(false));
  },[userId]);

  const name = displayName || "Usuario";
  const initial = name[0].toUpperCase();

  const getPlanImage = (p) => {
    if (Array.isArray(p.photos) && p.photos.length > 0) return p.photos[0];
    if (p.image_url) return p.image_url;
    if (p.img) return p.img;
    return null;
  };

  return (
    <div style={{minHeight:"100vh",background:C.bg,paddingTop:52,paddingBottom:40}}>
      <div style={{padding:"20px 16px"}}>
        <button onClick={onBack} style={{background:"transparent",border:"none",color:C.muted,cursor:"pointer",fontSize:14,fontFamily:F,marginBottom:20}}>← Volver</button>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:24}}>
          <div style={{width:64,height:64,borderRadius:"50%",background:C.accent,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,fontWeight:900,color:C.accentText,fontFamily:F}}>{initial}</div>
          <div>
            <div style={{fontFamily:F,fontSize:18,fontWeight:900,color:C.black}}>{name}</div>
            <div style={{fontSize:12,color:C.muted}}>{plans.length} plan{plans.length!==1?"es":""} publicado{plans.length!==1?"s":""}</div>
          </div>
        </div>
        <h2 style={{fontFamily:F,fontSize:16,fontWeight:800,color:C.black,marginBottom:16}}>{t.plansByUser} {name}</h2>
        {loading ? (
          <div style={{textAlign:"center",padding:40,color:C.muted}}>Cargando...</div>
        ) : plans.length === 0 ? (
          <div style={{textAlign:"center",padding:40,color:C.muted}}>Este usuario aún no ha publicado planes.</div>
        ) : (
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {plans.map(p=>{
              const src = getPlanImage(p);
              return (
                <div key={p.id}
                  onClick={()=>onPlanClick&&onPlanClick(p)}
                  style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden",cursor:onPlanClick?"pointer":"default",transition:"transform 0.2s,box-shadow 0.2s"}}
                  onMouseEnter={e=>{if(onPlanClick){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 28px rgba(0,0,0,0.1)";}}}
                  onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";}}>
                  {src
                    ? <img src={src} alt="" style={{width:"100%",height:140,objectFit:"cover"}} onError={e=>e.target.style.display="none"}/>
                    : <div style={{width:"100%",height:140,background:`linear-gradient(135deg,${C.accent}40,${C.accent}20)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:40}}>{p.emoji||"🗺️"}</div>
                  }
                  <div style={{padding:14}}>
                    <div style={{fontSize:15,fontWeight:800,color:C.black,fontFamily:F,marginBottom:4}}>{p.title}</div>
                    <div style={{fontSize:12,color:C.muted}}>📍 {p.location_name||p.zone}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("feed");
  const [screenParams, setScreenParams] = useState({});
  const [lang, setLang] = useState(()=>{ try{return localStorage.getItem("op_lang")||"es";}catch{return"es";} });
  const [timeData, setTimeData] = useState(null);
  const [answers, setAnswers] = useState(null);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [planError, setPlanError] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [feedKey, setFeedKey] = useState(0);
  const [profileKey, setProfileKey] = useState(0);
  const t = T[lang];

  // Persist lang
  useEffect(()=>{ try{localStorage.setItem("op_lang",lang);}catch{} },[lang]);

  // Restore session
  useEffect(()=>{ const s=auth.load(); if(s?.token) setUser(s); },[]);

  // ── URL routing ──────────────────────────────────────────────────────────────
  // Convierte screen+params a una URL limpia
  const screenToUrl = (s, params={}) => {
    if (s === "detail" && params.planId) return `/p/${params.planId}`;
    return "/";
  };

  // Aplica un screen sin tocar el historial (usado por popstate)
  const applyScreen = (s, params={}) => {
    setScreen(s);
    setScreenParams(params);
    if (s !== "profile") window.scrollTo(0,0);
  };

  const go = (s, params={}) => {
    applyScreen(s, params);
    const url = screenToUrl(s, params);
    window.history.pushState({screen:s, params}, "", url);
  };

  // Botón atrás del navegador
  useEffect(() => {
    const onPop = (e) => {
      const state = e.state;
      if (state?.screen) {
        // Si volvemos a un detail, necesitamos el plan en memoria
        if (state.screen === "detail" && state.params?.planId && selectedPlan?.id === state.params.planId) {
          applyScreen("detail", state.params);
        } else {
          applyScreen(state.screen === "detail" ? "feed" : state.screen, state.params||{});
        }
      } else {
        applyScreen("feed", {});
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [selectedPlan]);

  // Al montar: detectar si la URL es /p/{id} y cargar ese plan directamente
  useEffect(() => {
    const path = window.location.pathname;
    const match = path.match(/^\/p\/([a-f0-9-]{36})$/i);
    if (match) {
      const planId = match[1];
      db.getPlanById(planId).then(plan => {
        if (plan) {
          setSelectedPlan(plan);
          applyScreen("detail", {planId: plan.id, from:"feed"});
          window.history.replaceState({screen:"detail", params:{planId:plan.id, from:"feed"}}, "", `/p/${plan.id}`);
        } else {
          // Plan no encontrado → ir al feed
          applyScreen("feed", {});
          window.history.replaceState({screen:"feed", params:{}}, "", "/");
        }
      });
    } else {
      // URL normal → iniciar en feed y registrar estado inicial
      window.history.replaceState({screen:"feed", params:{}}, "", "/");
    }
  }, []);
  const requireAuth = () => setShowAuth(true);
  const handleUpload = () => { if(!user){setShowAuth(true);return;} setShowUpload(true); };
  const handleLogout = () => { auth.clear(); setUser(null); };
  const handleUploaded = () => { setFeedKey(k=>k+1); setProfileKey(k=>k+1); }; // reload feed+profile after upload

  const handleQuizComplete = async (ans) => {
    setAnswers(ans);
    go("loading");
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);
      const p = await fetch("/api/generate-plan",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({answers:ans,timeData,lang}),signal:controller.signal});
      clearTimeout(timeout);
      if (!p.ok) throw new Error(`${p.status}`);
      const plan = await p.json();
      setGeneratedPlan(plan); setPlanError(null); go("generated");
    } catch(e) {
      setPlanError(e.name==="AbortError"?"El plan tardó demasiado. Inténtalo de nuevo.":"No hemos podido generar el plan. Comprueba tu conexión e inténtalo de nuevo.");
      go("generated");
    }
  };

  const handleRegen = async () => {
    if(!answers){go("feed");return;}
    go("loading");
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);
      const p = await fetch("/api/generate-plan",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({answers,timeData,lang}),signal:controller.signal});
      clearTimeout(timeout);
      if(!p.ok) throw new Error(`${p.status}`);
      const plan = await p.json();
      setGeneratedPlan(plan); setPlanError(null); go("generated");
    } catch(e) { setPlanError(e.name==="AbortError"?"El plan tardó demasiado. Inténtalo de nuevo.":"No hemos podido regenerar el plan."); go("generated"); }
  };

  return (
    <div style={{fontFamily:F,WebkitFontSmoothing:"antialiased",maxWidth:480,margin:"0 auto",background:C.bg,minHeight:"100vh"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        *{margin:0;padding:0;box-sizing:border-box;}
        body{background:${C.bg};}
        ::-webkit-scrollbar{width:0;}
        input::placeholder,textarea::placeholder{color:${C.dim};}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      `}</style>

      {showUpload&&<UploadModal t={t} onClose={()=>setShowUpload(false)} user={user} onUploaded={handleUploaded}/>}
      {showAuth&&<AuthModal t={t} onClose={()=>setShowAuth(false)} onSuccess={u=>{setUser(u);setShowAuth(false);}}/>}

      {screen!=="loading"&&<TopNav screen={screen} go={go} t={t} user={user} onCreatePlan={()=>go("time")} onUpload={handleUpload}/>}

      {screen==="feed"&&<FeedScreen key={feedKey} t={t} go={go} onPlanClick={p=>{setSelectedPlan(p);go("detail",{planId:p.id,from:"feed"});}} onUpload={handleUpload} user={user} onRequireAuth={requireAuth}/>}
      {screen==="detail"&&selectedPlan&&<PlanDetail plan={selectedPlan} t={t} onBack={()=>{ const from=screenParams.from||"feed"; from==="userProfile"?go("userProfile",{userId:screenParams.userId,userName:screenParams.userName,from:"feed"}):go(from); }} user={user} onRequireAuth={requireAuth} go={go}/>}
      {screen==="userProfile"&&<UserProfileScreen userId={screenParams.userId} userName={screenParams.userName} t={t} onBack={()=>go(screenParams.from||"feed")} onPlanClick={p=>{setSelectedPlan(p);go("detail",{planId:p.id,from:"userProfile",userId:screenParams.userId,userName:screenParams.userName});}}/>}
      {screen==="time"&&(
        <div style={{minHeight:"100vh",background:C.bg,paddingTop:52}}>
          <div style={{padding:"20px 16px"}}>
            <div style={{fontSize:36,marginBottom:12}}>📅</div>
            <h2 style={{fontFamily:F,fontSize:24,fontWeight:900,color:C.black,marginBottom:6,letterSpacing:-0.3}}>{t.when}</h2>
            <p style={{fontSize:14,color:C.muted,marginBottom:22}}>{t.whenSub}</p>
            <TimeSelector t={t} onComplete={d=>{setTimeData(d);go("quiz");}}/>
          </div>
        </div>
      )}
      {screen==="quiz"&&<QuizScreen t={t} timeData={timeData} onComplete={handleQuizComplete} onBack={()=>go("time")}/>}
      {screen==="loading"&&<LoadingScreen t={t}/>}
      {screen==="generated"&&<GeneratedPlan plan={generatedPlan} answers={answers} t={t} onBack={()=>go("feed")} onRegen={handleRegen} go={go} error={planError} user={user} onRequireAuth={requireAuth}/>}
      {screen==="profile"&&<ProfileScreen key={profileKey} t={t} lang={lang} setLang={setLang} onUpload={handleUpload} isLoggedIn={!!user} onLogin={()=>setShowAuth(true)} user={user} onLogout={handleLogout} go={go} onPlanClick={p=>{setSelectedPlan(p);go("detail",{planId:p.id,from:"profile"});}}/> }
    </div>
  );
}
