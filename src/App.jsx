import { useState, useEffect, useCallback } from "react";

const SUPABASE_URL = "https://ricrcrmabkcqkmqqbbcw.supabase.co";
const SUPABASE_KEY = "sb_publishable_rrB-RExn7Kwi4k66MwZBew_2zMFWkoq";

// ── i18n ──────────────────────────────────────────────────────────────────────
const LANGS = {
  es: {
    tagline: "Tu fin de semana, planificado.", subtitle: "Descubre planes cerca de ti o crea los tuyos con IA.",
    createPlan: "Crear mi plan", topVoted: "Más votados", random: "Aleatorio",
    filters: ["Montaña","Playa","Ciudad","Pueblos","Espectáculos","Gastronomía"],
    moreFilters: "Filtros", save: "Guardar", saved: "Guardado ✓", share: "Compartir",
    doPlan: "Hacer este plan", generateNew: "Generar otro plan",
    whereFrom: "¿Desde dónde salís?", whereFromSub: "Escribe tu ciudad de origen",
    whosComing: "¿Quién viene?", whosComingSub: "El plan cambia según esto",
    haveCar: "¿Tenéis coche?", haveCarSub: "Determina los destinos posibles",
    budget: "¿Presupuesto por persona?", budgetSub: "Aproximado para el día",
    vibe: "¿Qué os apetece?", vibeSub: "Elige uno para un plan coherente",
    couple: "En pareja", friends: "Con amigos", family: "Familia con niños", solo: "Solo/a",
    withCar: "Sí, tenemos coche", noCar: "Sin coche",
    cheap: "Económico", normal: "Normal", unlimited: "Sin límite",
    nature: "Naturaleza", culture: "Cultura", food: "Gastronomía", chill: "Tranquilidad", adventure: "Aventura",
    when: "¿Cuándo y cuánto tiempo?", whenSub: "Para ajustar el plan a tu disponibilidad",
    planDay: "El plan del día", tips: "Consejos", report: "¿Problema en la ruta?",
    reportDesc: "Carretera cortada, restaurante cerrado...", reportBtn: "Reportar incidencia", reportSent: "Recibido. Lo gestionamos.",
    uploadPlan: "+ Subir plan", descPlan: "Describe tu plan", zoneLbl: "Zona / destino",
    publish: "Publicar plan", thanks: "¡Plan publicado!", thanksDesc: "Ya está visible en el feed.",
    feed: "Plans", profile: "Perfil", myProfile: "Mi perfil",
    savedPlans: "Guardados", myPlans: "Mis planes", generatedLbl: "Generados",
    language: "Idioma", langEs: "Castellano", langCa: "Català",
    preparing: "Preparando tu plan...",
    steps: ["Analizando tu situación...","Buscando el mejor destino...","Verificando el tiempo...","Confirmando restaurantes...","Calculando ruta y aparcamiento...","¡Plan listo!"],
    selectDay: "Selecciona un día primero", continueWith: "Continuar",
    back: "← Atrás", next: "Continuar →", close: "Cerrar",
    addPlanFromProfile: "Subir un plan",
    // Filters panel
    distance: "Distancia", distOpts: ["10 km","30 km","50 km","100 km","Sin límite"],
    duration: "Duración", durOpts: ["Mañana","Tarde","Día completo","Fin de semana"],
    budgetF: "Presupuesto", budgetOpts: ["Económico","Normal","Sin límite"],
    transportF: "Transporte", transportOpts: ["Con coche","Sin coche"],
    groupF: "Grupo", groupOpts: ["Pareja","Amigos","Familia","Solo"],
    applyFilters: "Aplicar filtros", clearFilters: "Limpiar",
    locationNeeded: "Activa tu ubicación para filtrar por distancia",
    allowLocation: "Permitir ubicación",
  },
  ca: {
    tagline: "El teu cap de setmana, planificat.", subtitle: "Descobreix plans a prop teu o crea els teus amb IA.",
    createPlan: "Crear el meu pla", topVoted: "Més votats", random: "Aleatori",
    filters: ["Muntanya","Platja","Ciutat","Pobles","Espectacles","Gastronomia"],
    moreFilters: "Filtres", save: "Guardar", saved: "Guardat ✓", share: "Compartir",
    doPlan: "Fer aquest pla", generateNew: "Generar un altre pla",
    whereFrom: "Des d'on sortiu?", whereFromSub: "Escriu la teva ciutat d'origen",
    whosComing: "Qui ve?", whosComingSub: "El pla canvia segons això",
    haveCar: "Teniu cotxe?", haveCarSub: "Determina les destinacions possibles",
    budget: "Pressupost per persona?", budgetSub: "Aproximat per al dia",
    vibe: "Què us ve de gust?", vibeSub: "Tria un per a un pla coherent",
    couple: "En parella", friends: "Amb amics", family: "Família amb nens", solo: "Sol/a",
    withCar: "Sí, tenim cotxe", noCar: "Sense cotxe",
    cheap: "Econòmic", normal: "Normal", unlimited: "Sense límit",
    nature: "Natura", culture: "Cultura", food: "Gastronomia", chill: "Tranquil·litat", adventure: "Aventura",
    when: "Quan i quant temps?", whenSub: "Per ajustar el pla a la teva disponibilitat",
    planDay: "El pla del dia", tips: "Consells", report: "Problema a la ruta?",
    reportDesc: "Carretera tallada, restaurant tancat...", reportBtn: "Reportar incidència", reportSent: "Rebut. Ho gestionem.",
    uploadPlan: "+ Pujar pla", descPlan: "Descriu el teu pla", zoneLbl: "Zona / destinació",
    publish: "Publicar pla", thanks: "Pla publicat!", thanksDesc: "Ja és visible al feed.",
    feed: "Plans", profile: "Perfil", myProfile: "El meu perfil",
    savedPlans: "Guardats", myPlans: "Els meus plans", generatedLbl: "Generats",
    language: "Idioma", langEs: "Castellano", langCa: "Català",
    preparing: "Preparant el teu pla...",
    steps: ["Analitzant la teva situació...","Buscant la millor destinació...","Verificant el temps...","Confirmant restaurants...","Calculant ruta i aparcament...","Pla llest!"],
    selectDay: "Selecciona un dia primer", continueWith: "Continuar",
    back: "← Enrere", next: "Continuar →", close: "Tancar",
    addPlanFromProfile: "Pujar un pla",
    distance: "Distància", distOpts: ["10 km","30 km","50 km","100 km","Sense límit"],
    duration: "Durada", durOpts: ["Matí","Tarda","Dia complet","Cap de setmana"],
    budgetF: "Pressupost", budgetOpts: ["Econòmic","Normal","Sense límit"],
    transportF: "Transport", transportOpts: ["Amb cotxe","Sense cotxe"],
    groupF: "Grup", groupOpts: ["Parella","Amics","Família","Sol"],
    applyFilters: "Aplicar filtres", clearFilters: "Netejar",
    locationNeeded: "Activa la teva ubicació per filtrar per distància",
    allowLocation: "Permetre ubicació",
  }
};

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  bg: "#F7F6F2", card: "#FFFFFF", border: "#E5E3DC",
  accent: "#B5D96A", accentDark: "#94BB4A", accentText: "#2A4A08",
  black: "#111110", text: "#1A1A18", muted: "#737368", dim: "#BBBAB2",
  white: "#FFFFFF", overlay: "rgba(17,17,16,0.5)",
  tagGreen: { text: "#1D6334", bg: "#D6F0E0" },
  tagOrange: { text: "#B54A0E", bg: "#FDEBD6" },
  tagAccent: { text: "#2A4A08", bg: "#E4F5C0" },
  tagPurple: { text: "#5B2E9E", bg: "#EDE0FA" },
  tagMuted: { text: "#737368", bg: "#EFEFEB" },
};

const FONT = { display: "'Plus Jakarta Sans', sans-serif", body: "'Plus Jakarta Sans', sans-serif" };

// ── Mock data ─────────────────────────────────────────────────────────────────
const MOCK = [
  { id:"1", emoji:"⛰️", title:"Amanecer en Montserrat + Viñedos Penedès", subtitle:"Montaña sagrada, vistas únicas y vino de la tierra", zone:"Barcelona · 1h", vibe:"naturaleza", budget:"mid", transport:"yes", votes_count:412, duration:"Día completo", img:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80", stops:[{time:"08:00",icon:"🚗",title:"Salida hacia Montserrat",desc:"A-2 dirección Martorell. Aparcamiento en la base del teleférico.",tag:"Viaje",tagColor:"muted"},{time:"09:30",icon:"⛰️",title:"Montserrat",desc:"Sube en teleférico. Visita la Moreneta y haz la ruta Sant Joan. Vistas espectaculares.",tag:"Naturaleza",tagColor:"green"},{time:"13:00",icon:"🍷",title:"Bodega Torres",desc:"Visita guiada con cata incluida. Reserva previa obligatoria. ~25€/persona.",tag:"Gastronomía",tagColor:"orange"},{time:"15:30",icon:"🌿",title:"Viñedos del Penedès",desc:"Paseo entre viñas. Paisaje precioso en primavera y otoño.",tag:"Naturaleza",tagColor:"green"},{time:"18:00",icon:"🏠",title:"Vuelta a casa",desc:"Por la AP-7. Llegarás antes de las 19:30.",tag:"Viaje",tagColor:"muted"}], tips:["Reserva el teleférico online para evitar colas","La Bodega Torres necesita reserva con antelación"] },
  { id:"2", emoji:"🏰", title:"Besalú Medieval + Volcanes de la Garrotxa", subtitle:"Puente románico del siglo XII y paisaje volcánico único", zone:"Girona · 1h 30min", vibe:"cultura", budget:"mid", transport:"yes", votes_count:347, duration:"Día completo", img:"https://images.unsplash.com/photo-1555993539-1732b0258235?w=800&q=80", stops:[{time:"08:30",icon:"🚗",title:"Salida hacia Besalú",desc:"C-17 y N-260. Aparcamiento junto al río Fluvià.",tag:"Viaje",tagColor:"muted"},{time:"10:00",icon:"🏰",title:"Besalú",desc:"Cruza el puente románico del s.XII. Visita el barrio judío y la iglesia de Sant Pere.",tag:"Cultura",tagColor:"accent"},{time:"12:30",icon:"🌋",title:"Volcà del Croscat",desc:"El volcán más joven de la Península. Ruta de 3km muy sencilla.",tag:"Naturaleza",tagColor:"green"},{time:"14:30",icon:"🍽️",title:"Can Jubany",desc:"Restaurante de referencia. Cocina catalana de autor. Reserva imprescindible.",tag:"Restaurante",tagColor:"orange"},{time:"17:00",icon:"🌲",title:"Fageda d'en Jordà",desc:"El hayedo más conocido de Cataluña. 45 min entre hayas centenarias.",tag:"Naturaleza",tagColor:"green"}], tips:["Mejor en otoño para los colores del hayedo","Can Jubany: reserva imprescindible con antelación"] },
  { id:"3", emoji:"🏙️", title:"Barrio Gótico + Santa Caterina + Barceloneta", subtitle:"Lo mejor de Barcelona en un día sin agobios ni colas", zone:"Barcelona · Ciudad", vibe:"cultura", budget:"low", transport:"no", votes_count:289, duration:"Día completo", img:"https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&q=80", stops:[{time:"10:00",icon:"🚇",title:"Metro Jaume I",desc:"Línea 4 amarilla. Salida directa al Gótico.",tag:"Viaje",tagColor:"muted"},{time:"10:15",icon:"🏛️",title:"Barrio Gótico",desc:"Catedral, Pont del Bisbe, Plaça Reial. 2h sin prisas.",tag:"Cultura",tagColor:"accent"},{time:"12:30",icon:"🛒",title:"Mercat de Santa Caterina",desc:"Sin turistas. Tapa de calamar y vermut. ~10€.",tag:"Gastronomía",tagColor:"orange"},{time:"14:00",icon:"🦞",title:"La Mar Salada",desc:"Arròs negre y mariscos. Terraza con vistas al mar. ~30€.",tag:"Restaurante",tagColor:"orange"},{time:"16:00",icon:"🏖️",title:"Barceloneta",desc:"Paseo marítimo hasta el Port Olímpic.",tag:"Ocio",tagColor:"green"}], tips:["Evita la Barceloneta en agosto","El Mercat de Santa Caterina abre L-S hasta las 15h"] },
  { id:"4", emoji:"🏖️", title:"Costa Brava: Calella + Begur + Pals medieval", subtitle:"Calas de roca, pueblo medieval y gastronomía de mar", zone:"Girona · 1h 45min", vibe:"naturaleza", budget:"mid", transport:"yes", votes_count:231, duration:"Día completo", img:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80", stops:[{time:"09:00",icon:"🚗",title:"Salida hacia Calella",desc:"AP-7. Aparcamiento en el pueblo, a pie a las calas.",tag:"Viaje",tagColor:"muted"},{time:"11:00",icon:"🏊",title:"Calas de Calella de Palafrugell",desc:"Aguas cristalinas. Las más bonitas de la Costa Brava.",tag:"Naturaleza",tagColor:"green"},{time:"13:30",icon:"🐟",title:"Sa Riera",desc:"Pescado fresco del día en primera línea de mar.",tag:"Restaurante",tagColor:"orange"},{time:"15:30",icon:"🏰",title:"Begur",desc:"Castillo medieval con vistas al mar.",tag:"Cultura",tagColor:"accent"},{time:"17:00",icon:"🏘️",title:"Pals medieval",desc:"Uno de los pueblos medievales mejor conservados de Cataluña.",tag:"Cultura",tagColor:"accent"}], tips:["Llega antes de las 10h a las calas en verano","Pals es precioso al atardecer"] },
  { id:"5", emoji:"🌊", title:"Delta del Ebro + Flamencos + Arroz del Delta", subtitle:"Naturaleza salvaje, flamencos rosas y el mejor arroz", zone:"Tarragona · 2h", vibe:"naturaleza", budget:"low", transport:"yes", votes_count:178, duration:"Día completo", img:"https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80", stops:[{time:"08:00",icon:"🚗",title:"Salida hacia el Delta",desc:"AP-7. Llegada a Deltebre en 2h.",tag:"Viaje",tagColor:"muted"},{time:"10:00",icon:"🦩",title:"Observatorio de flamencos",desc:"Miles de flamencos rosas. Mejor con prismáticos.",tag:"Naturaleza",tagColor:"green"},{time:"12:00",icon:"🚤",title:"Crucero por los canales",desc:"Recorrido en barca. ~15€/persona.",tag:"Actividad",tagColor:"accent"},{time:"14:00",icon:"🍚",title:"L'Algadir del Delta",desc:"El mejor arroz del Delta. ~25€.",tag:"Restaurante",tagColor:"orange"},{time:"16:00",icon:"🌅",title:"Playa del Trabucador",desc:"Lengua de arena entre el mar y la laguna.",tag:"Naturaleza",tagColor:"green"}], tips:["Lleva ropa para el viento","Mejor época: primavera y otoño"] },
];

const QUESTIONS = [
  { id:"location", emoji:"📍", type:"text" },
  { id:"group", emoji:"👥", type:"opts", opts:[{v:"pareja",i:"💑"},{v:"amigos",i:"🎉"},{v:"familia",i:"👨‍👩‍👧"},{v:"solo",i:"🚶"}] },
  { id:"transport", emoji:"🚗", type:"opts", opts:[{v:"yes",i:"🚗"},{v:"no",i:"🚇"}] },
  { id:"budget", emoji:"💰", type:"opts", opts:[{v:"low",i:"🤏",s:"< 30€"},{v:"mid",i:"👍",s:"30–80€"},{v:"high",i:"✨",s:"> 80€"}] },
  { id:"vibe", emoji:"🎯", type:"opts", opts:[{v:"naturaleza",i:"🌿"},{v:"cultura",i:"🏛️"},{v:"gastronomia",i:"🍽️"},{v:"tranquilidad",i:"😌"},{v:"aventura",i:"⚡"}] },
];

// ── Supabase ──────────────────────────────────────────────────────────────────
const db = {
  h: { apikey: SUPABASE_KEY, Authorization:`Bearer ${SUPABASE_KEY}`, "Content-Type":"application/json" },
  async getPlans(filter="all", sortRandom=false) {
    const order = sortRandom ? "id.asc" : "votes_count.desc";
    let url = `${SUPABASE_URL}/rest/v1/plans?is_approved=eq.true&order=${order}&limit=20`;
    if (filter==="Montaña"||filter==="Muntanya"||filter==="Playa"||filter==="Platja"||filter==="Pueblos"||filter==="Pobles") url+="&vibe=eq.naturaleza";
    if (filter==="Ciudad"||filter==="Ciutat") url+="&vibe=eq.cultura";
    if (filter==="Gastronomía"||filter==="Gastronomia") url+="&vibe=eq.gastronomia";
    if (filter==="Espectáculos"||filter==="Espectacles") url+="&vibe=eq.aventura";
    try { const r=await fetch(url,{headers:this.h}); const d=await r.json(); return Array.isArray(d)&&d.length>0?d:null; }
    catch { return null; }
  },
  async submitPlan(data) {
    try { await fetch(`${SUPABASE_URL}/rest/v1/plans`,{method:"POST",headers:this.h,body:JSON.stringify({...data,is_approved:true,votes_count:0})}); return true; }
    catch { return false; }
  },
  async savePlan(plan,answers) {
    try { await fetch(`${SUPABASE_URL}/rest/v1/plans`,{method:"POST",headers:this.h,body:JSON.stringify({title:plan.title,subtitle:plan.subtitle,zone:plan.zone,stops:plan.stops,tips:plan.tips,emoji:plan.emoji,budget:answers?.budget,transport:answers?.transport,vibe:answers?.vibe,group_type:answers?.group,is_ai_generated:true,is_approved:true,votes_count:0})}); }
    catch {}
  },
  async report(desc) {
    try { await fetch(`${SUPABASE_URL}/rest/v1/incidents`,{method:"POST",headers:this.h,body:JSON.stringify({description:desc})}); }
    catch {}
  },
};

// ── AI ────────────────────────────────────────────────────────────────────────
async function generatePlan(answers, timeData, lang) {
  const r = await fetch("/api/generate-plan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers, timeData, lang }),
  });
  if (!r.ok) throw new Error(`${r.status}`);
  return r.json();
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const tagStyle = (color) => {
  const map = { green: C.tagGreen, orange: C.tagOrange, accent: C.tagAccent, purple: C.tagPurple, muted: C.tagMuted };
  return map[color] || C.tagMuted;
};

function Tag({ label, color }) {
  const s = tagStyle(color);
  return <span style={{ fontSize:10, fontWeight:700, letterSpacing:0.6, textTransform:"uppercase", color:s.text, background:s.bg, padding:"3px 9px", borderRadius:20 }}>{label}</span>;
}

function Btn({ children, onClick, style={}, variant="black" }) {
  const base = { border:"none", borderRadius:12, padding:"13px 20px", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:FONT.body, transition:"all 0.15s", display:"flex", alignItems:"center", justifyContent:"center", gap:6 };
  const variants = {
    black: { background:C.black, color:C.white },
    accent: { background:C.accent, color:C.accentText },
    ghost: { background:"transparent", border:`1px solid ${C.border}`, color:C.muted },
  };
  return <button onClick={onClick} style={{...base,...variants[variant],...style}}>{children}</button>;
}

// ── Upload Modal ──────────────────────────────────────────────────────────────
function UploadModal({ t, onClose }) {
  const TOTAL_STEPS = 5;
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);

  // Step 1 — Basic info
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");

  // Step 2 — Tags / filters
  const [vibes, setVibes] = useState([]);
  const toggleVibe = (v) => setVibes(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);
  const [budget, setBudget] = useState(null);
  const [transport, setTransport] = useState(null);
  const [zone, setZone] = useState("");

  // Step 3 — Stops
  const [stops, setStops] = useState([
    { time: "", icon: "📍", title: "", desc: "" },
    { time: "", icon: "🍽️", title: "", desc: "" },
    { time: "", icon: "🏠", title: "", desc: "" },
  ]);

  // Step 4 — Tips
  const [tip1, setTip1] = useState("");
  const [tip2, setTip2] = useState("");

  const vibeOpts = [
    { v: "naturaleza", l: "Naturaleza 🌿" },
    { v: "cultura", l: "Cultura 🏛️" },
    { v: "gastronomia", l: "Gastronomía 🍽️" },
    { v: "tranquilidad", l: "Tranquilidad 😌" },
    { v: "aventura", l: "Aventura ⚡" },
  ];

  const budgetOpts = [
    { v: "low", l: "Económico · <30€" },
    { v: "mid", l: "Normal · 30-80€" },
    { v: "high", l: "Sin límite · >80€" },
  ];

  const updateStop = (i, field, val) => {
    const s = [...stops];
    s[i] = { ...s[i], [field]: val };
    setStops(s);
  };

  const addStop = () => setStops([...stops, { time: "", icon: "📍", title: "", desc: "" }]);
  const removeStop = (i) => stops.length > 2 && setStops(stops.filter((_, idx) => idx !== i));

  const handlePublish = async () => {
    const planData = {
      title,
      subtitle,
      zone,
      vibe: vibes[0] || "naturaleza",
      budget,
      transport,
      group_type: "amigos",
      is_ai_generated: false,
      stops: stops.filter(s => s.title.trim()).map(s => ({ ...s, tag: "Parada", tagColor: "accent" })),
      tips: [tip1, tip2].filter(Boolean),
    };
    await db.submitPlan(planData);
    setDone(true);
  };

  const canNext1 = title.trim().length > 3;
  const canNext2 = vibes.length > 0 && budget && transport && zone.trim();
  const canNext3 = stops.filter(s => s.title.trim()).length >= 2;
  const canPublish = tip1.trim() || true;

  const inputStyle = (val) => ({
    background: C.bg, border: `1.5px solid ${val ? C.accent : C.border}`,
    borderRadius: 12, padding: "12px 14px", fontSize: 14, color: C.text,
    outline: "none", fontFamily: FONT.body, width: "100%", transition: "border-color 0.2s",
    boxSizing: "border-box",
  });

  const ChipRow = ({ label, opts, val, set, multi }) => (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 8 }}>{label}</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {opts.map(o => {
          const active = multi ? val.includes(o.v) : val === o.v;
          return (
            <button key={o.v} onClick={() => set(o.v)}
              style={{ background: active ? C.black : C.bg, color: active ? C.white : C.muted, border: `1.5px solid ${active ? C.black : C.border}`, borderRadius: 20, padding: "7px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FONT.body, transition: "all 0.15s" }}>
              {o.l}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: C.overlay, zIndex: 300, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={onClose}>
      <div style={{ background: C.card, borderRadius: "20px 20px 0 0", padding: 24, width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
        <div style={{ width: 36, height: 4, background: C.border, borderRadius: 2, margin: "0 auto 20px" }} />

        {done ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
            <div style={{ fontFamily: FONT.display, fontSize: 22, fontWeight: 800, color: C.black, marginBottom: 8 }}>{t.thanks}</div>
            <div style={{ fontSize: 14, color: C.muted, marginBottom: 24 }}>{t.thanksDesc}</div>
            <Btn onClick={onClose} variant="black">{t.close}</Btn>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontFamily: FONT.display, fontSize: 18, fontWeight: 800, color: C.black }}>
                {step === 1 ? "¿De qué va el plan?" : step === 2 ? "¿Cómo es el plan?" : step === 3 ? "Las paradas del día" : step === 4 ? "Consejos útiles" : "Confirmar y publicar"}
              </span>
              <span style={{ fontSize: 12, color: C.dim, fontWeight: 600 }}>{step}/{TOTAL_STEPS}</span>
            </div>

            {/* Progress bar */}
            <div style={{ height: 3, background: C.border, borderRadius: 2, marginBottom: 20 }}>
              <div style={{ height: "100%", width: `${(step / TOTAL_STEPS) * 100}%`, background: C.accent, borderRadius: 2, transition: "width 0.3s" }} />
            </div>

            {/* Step 1 — Title & subtitle */}
            {step === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 8 }}>Título del plan</div>
                  <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Ej: Amanecer en Montserrat + Viñedos Penedès" style={inputStyle(title)} />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 8 }}>Subtítulo <span style={{ fontWeight: 400, textTransform: "none" }}>(opcional)</span></div>
                  <input value={subtitle} onChange={e => setSubtitle(e.target.value)} placeholder="Ej: Montaña sagrada, vistas únicas y vino de la tierra" style={inputStyle(subtitle)} />
                </div>
                <Btn onClick={() => canNext1 && setStep(2)} variant={canNext1 ? "black" : "ghost"} style={{ width: "100%", padding: "14px", borderRadius: 14, marginTop: 8 }}>{t.next}</Btn>
              </div>
            )}

            {/* Step 2 — Tags */}
            {step === 2 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <ChipRow label="Tipo de plan (puedes elegir varios)" opts={vibeOpts} val={vibes} set={toggleVibe} multi />
                <ChipRow label="Presupuesto por persona" opts={budgetOpts} val={budget} set={setBudget} />
                <ChipRow label="Transporte" opts={[{ v: "yes", l: "Con coche 🚗" }, { v: "no", l: "Sin coche 🚇" }]} val={transport} set={setTransport} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 8 }}>Zona / destino</div>
                  <input value={zone} onChange={e => setZone(e.target.value)} placeholder="Ej: Girona · 1h 30min desde Barcelona" style={inputStyle(zone)} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 8 }}>
                  <Btn onClick={() => setStep(1)} variant="ghost">{t.back}</Btn>
                  <Btn onClick={() => canNext2 && setStep(3)} variant={canNext2 ? "black" : "ghost"}>{t.next}</Btn>
                </div>
              </div>
            )}

            {/* Step 3 — Stops */}
            {step === 3 && (
              <div>
                <p style={{ fontSize: 13, color: C.muted, marginBottom: 16, lineHeight: 1.5 }}>Añade las paradas del día en orden. Mínimo 2. La primera debería ser la salida y la última la vuelta.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 14 }}>
                  {stops.map((stop, i) => (
                    <div key={i} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: C.black, fontFamily: FONT.display }}>Parada {i + 1}</span>
                        {stops.length > 2 && <button onClick={() => removeStop(i)} style={{ background: "transparent", border: "none", color: C.muted, cursor: "pointer", fontSize: 18 }}>×</button>}
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: 8, marginBottom: 8 }}>
                        <input value={stop.time} onChange={e => updateStop(i, "time", e.target.value)} placeholder="10:00" style={{ ...inputStyle(stop.time), padding: "10px 12px" }} />
                        <input value={stop.title} onChange={e => updateStop(i, "title", e.target.value)} placeholder="Nombre del lugar" style={{ ...inputStyle(stop.title), padding: "10px 12px" }} />
                      </div>
                      <textarea value={stop.desc} onChange={e => updateStop(i, "desc", e.target.value)} placeholder="Descripción práctica: cómo llegar, qué hacer, precio aproximado..." style={{ ...inputStyle(stop.desc), minHeight: 70, resize: "none", padding: "10px 12px" }} />
                    </div>
                  ))}
                </div>
                <button onClick={addStop} style={{ background: "transparent", border: `1.5px dashed ${C.border}`, borderRadius: 12, padding: "12px", width: "100%", fontSize: 13, fontWeight: 600, color: C.muted, cursor: "pointer", fontFamily: FONT.body, marginBottom: 14 }}>
                  + Añadir parada
                </button>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <Btn onClick={() => setStep(2)} variant="ghost">{t.back}</Btn>
                  <Btn onClick={() => canNext3 && setStep(4)} variant={canNext3 ? "black" : "ghost"}>{t.next}</Btn>
                </div>
              </div>
            )}

            {/* Step 4 — Tips */}
            {step === 4 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <p style={{ fontSize: 13, color: C.muted, marginBottom: 4, lineHeight: 1.5 }}>Comparte consejos prácticos que no están en Google. Opcionales pero muy valorados.</p>
                <input value={tip1} onChange={e => setTip1(e.target.value)} placeholder="Consejo 1 · Ej: Reserva el teleférico online" style={inputStyle(tip1)} />
                <input value={tip2} onChange={e => setTip2(e.target.value)} placeholder="Consejo 2 · Ej: Mejor ir entre semana" style={inputStyle(tip2)} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 8 }}>
                  <Btn onClick={() => setStep(3)} variant="ghost">{t.back}</Btn>
                  <Btn onClick={() => setStep(5)} variant="black">{t.next}</Btn>
                </div>
              </div>
            )}

            {/* Step 5 — Confirm */}
            {step === 5 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16 }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: C.black, marginBottom: 4, fontFamily: FONT.display }}>{title}</div>
                  {subtitle && <div style={{ fontSize: 13, color: C.muted, marginBottom: 8 }}>{subtitle}</div>}
                  <div style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>📍 {zone}</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                    {vibes.length > 0 && vibes.map(v => <span key={v} style={{ fontSize: 11, fontWeight: 700, color: C.tagGreen.text, background: C.tagGreen.bg, padding: "3px 9px", borderRadius: 20, textTransform: "uppercase" }}>{vibeOpts.find(o => o.v === v)?.l}</span>)}
                    {budget && <span style={{ fontSize: 11, fontWeight: 700, color: C.tagMuted.text, background: C.tagMuted.bg, padding: "3px 9px", borderRadius: 20, textTransform: "uppercase" }}>{budgetOpts.find(o => o.v === budget)?.l}</span>}
                    {transport && <span style={{ fontSize: 11, fontWeight: 700, color: C.tagAccent.text, background: C.tagAccent.bg, padding: "3px 9px", borderRadius: 20, textTransform: "uppercase" }}>{transport === "yes" ? "Con coche 🚗" : "Sin coche 🚇"}</span>}
                  </div>
                  <div style={{ fontSize: 12, color: C.muted }}>{stops.filter(s => s.title).length} paradas · {[tip1, tip2].filter(Boolean).length} consejos</div>
                </div>
                <div style={{ background: C.accent + "20", border: `1px solid ${C.accent}`, borderRadius: 12, padding: 12, fontSize: 13, color: C.accentText }}>
                  ✓ Tu plan aparecerá en el feed inmediatamente
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <Btn onClick={() => setStep(4)} variant="ghost">{t.back}</Btn>
                  <Btn onClick={handlePublish} variant="accent">{t.publish} ✓</Btn>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ── Filters Panel ─────────────────────────────────────────────────────────────
function FiltersPanel({ t, onClose, onApply, userLocation, onRequestLocation }) {
  const [dist, setDist] = useState(null);
  const [dur, setDur] = useState(null);
  const [budget, setBudget] = useState(null);
  const [transport, setTransport] = useState(null);
  const [group, setGroup] = useState(null);

  const Row = ({ label, opts, val, set }) => (
    <div style={{ marginBottom:20 }}>
      <div style={{ fontSize:12, fontWeight:700, color:C.muted, letterSpacing:0.6, textTransform:"uppercase", marginBottom:10 }}>{label}</div>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        {opts.map(o => (
          <button key={o} onClick={()=>set(val===o?null:o)} style={{ background:val===o?C.black:C.bg, color:val===o?C.white:C.muted, border:`1.5px solid ${val===o?C.black:C.border}`, borderRadius:20, padding:"7px 14px", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:FONT.body, transition:"all 0.15s" }}>{o}</button>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ position:"fixed", inset:0, background:C.overlay, zIndex:300, display:"flex", alignItems:"flex-end", justifyContent:"center" }} onClick={onClose}>
      <div style={{ background:C.card, borderRadius:"20px 20px 0 0", padding:24, width:"100%", maxWidth:480, maxHeight:"85vh", overflowY:"auto" }} onClick={e=>e.stopPropagation()}>
        <div style={{ width:36, height:4, background:C.border, borderRadius:2, margin:"0 auto 20px" }} />
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
          <span style={{ fontFamily:FONT.display, fontSize:18, fontWeight:800, color:C.black }}>{t.moreFilters}</span>
          <button onClick={()=>{setDist(null);setDur(null);setBudget(null);setTransport(null);setGroup(null);}} style={{ background:"transparent", border:"none", fontSize:13, color:C.muted, cursor:"pointer", fontFamily:FONT.body }}>{t.clearFilters}</button>
        </div>

        {/* Distance — needs location */}
        <div style={{ marginBottom:20 }}>
          <div style={{ fontSize:12, fontWeight:700, color:C.muted, letterSpacing:0.6, textTransform:"uppercase", marginBottom:10 }}>{t.distance}</div>
          {!userLocation ? (
            <div style={{ background:C.accent+"20", border:`1px solid ${C.accent}`, borderRadius:14, padding:14, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:13, color:C.accentText, fontWeight:600 }}>{t.locationNeeded}</span>
              <button onClick={onRequestLocation} style={{ background:C.accent, border:"none", borderRadius:10, padding:"7px 14px", fontSize:12, fontWeight:700, cursor:"pointer", color:C.accentText, fontFamily:FONT.body, whiteSpace:"nowrap" }}>{t.allowLocation}</button>
            </div>
          ) : (
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {t.distOpts.map(o => (
                <button key={o} onClick={()=>setDist(dist===o?null:o)} style={{ background:dist===o?C.black:C.bg, color:dist===o?C.white:C.muted, border:`1.5px solid ${dist===o?C.black:C.border}`, borderRadius:20, padding:"7px 14px", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:FONT.body, transition:"all 0.15s" }}>{o}</button>
              ))}
            </div>
          )}
        </div>

        <Row label={t.duration} opts={t.durOpts} val={dur} set={setDur} />
        <Row label={t.budgetF} opts={t.budgetOpts} val={budget} set={setBudget} />
        <Row label={t.transportF} opts={t.transportOpts} val={transport} set={setTransport} />
        <Row label={t.groupF} opts={t.groupOpts} val={group} set={setGroup} />

        <Btn onClick={()=>{ onApply({dist,dur,budget,transport,group}); onClose(); }} variant="black" style={{ width:"100%", padding:"15px" }}>{t.applyFilters}</Btn>
      </div>
    </div>
  );
}

// ── Top Navbar ────────────────────────────────────────────────────────────────
function TopNav({ screen, go, t, onCreatePlan, onUpload }) {
  return (
    <div style={{ position:"fixed", top:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:480, background:C.bg, borderBottom:`1px solid ${C.border}`, zIndex:100, display:"flex", alignItems:"center", padding:"0 14px", height:52, gap:8 }}>
      {/* Logo */}
      <div onClick={()=>go("feed")} style={{ cursor:"pointer", display:"flex", alignItems:"center", gap:7, flexShrink:0 }}>
        <div style={{ width:28, height:28, background:C.accent, borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:11, color:C.accentText, fontFamily:FONT.display }}>OP</div>
        <span style={{ fontFamily:FONT.display, fontWeight:800, fontSize:15, color:C.black, letterSpacing:-0.3 }}>OnlyPlans</span>
      </div>

      <div style={{ flex:1 }} />

      {/* Create plan button */}
      <button onClick={onCreatePlan} style={{ background:C.black, border:"none", borderRadius:20, padding:"6px 14px", cursor:"pointer", fontSize:12, fontWeight:700, color:C.white, fontFamily:FONT.body, whiteSpace:"nowrap", transition:"background 0.15s" }}
        onMouseEnter={e=>e.currentTarget.style.background="#333"}
        onMouseLeave={e=>e.currentTarget.style.background=C.black}>
        {t.createPlan}
      </button>

      {/* Upload */}
      <button onClick={onUpload} style={{ background:C.accent, border:"none", borderRadius:20, padding:"6px 14px", cursor:"pointer", fontSize:12, fontWeight:700, color:C.accentText, fontFamily:FONT.body, whiteSpace:"nowrap" }}>
        {t.uploadPlan}
      </button>

      {/* Profile */}
      <button onClick={()=>go("profile")} style={{ background: screen==="profile" ? C.accent : "transparent", border:`1px solid ${screen==="profile"?C.accent:C.border}`, borderRadius:"50%", width:32, height:32, cursor:"pointer", fontSize:15, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all 0.2s" }}>
        👤
      </button>
    </div>
  );
}

// ── Feed Card ─────────────────────────────────────────────────────────────────
function FeedCard({ plan, t, onClick }) {
  const [saved, setSaved] = useState(false);
  const [votes, setVotes] = useState(plan.votes_count||0);
  const [voted, setVoted] = useState(false);

  const budgetLabel = { low:"Económico", mid:"Normal", high:"Sin límite" };

  return (
    <div onClick={onClick} style={{ background:C.card, borderRadius:18, overflow:"hidden", boxShadow:"0 1px 12px rgba(0,0,0,0.05)", cursor:"pointer", transition:"transform 0.2s, box-shadow 0.2s", marginBottom:14 }}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 28px rgba(0,0,0,0.1)";}}
      onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 1px 12px rgba(0,0,0,0.05)";}}>

      {/* Image */}
      <div style={{ position:"relative", height:210, overflow:"hidden", background:`linear-gradient(135deg, ${C.accent}30, ${C.accent}10)` }}>
        <img src={plan.img||""} alt={plan.title} style={{ width:"100%", height:"100%", objectFit:"cover" }}
          onError={e=>{e.target.style.display="none";}}/>
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 55%)" }}/>
        <div style={{ position:"absolute", top:12, left:12, background:"rgba(255,255,255,0.88)", backdropFilter:"blur(8px)", borderRadius:20, padding:"4px 11px", fontSize:11, fontWeight:600, color:C.black }}>
          📍 {plan.zone}
        </div>
        <button onClick={e=>{e.stopPropagation();setSaved(!saved);}} style={{ position:"absolute", top:10, right:10, background:"rgba(255,255,255,0.88)", backdropFilter:"blur(8px)", border:"none", borderRadius:"50%", width:34, height:34, cursor:"pointer", fontSize:15, display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s" }}>
          {saved?"🔖":"🤍"}
        </button>
        <div style={{ position:"absolute", bottom:10, left:12, fontSize:28 }}>{plan.emoji}</div>
      </div>

      {/* Content */}
      <div style={{ padding:"14px 16px" }}>
        <h3 style={{ fontFamily:FONT.display, fontSize:16, fontWeight:800, color:C.black, marginBottom:5, lineHeight:1.25, letterSpacing:-0.2 }}>{plan.title}</h3>
        <p style={{ fontSize:13, color:C.muted, marginBottom:12, lineHeight:1.5 }}>{plan.subtitle}</p>
        <div style={{ display:"flex", gap:6, marginBottom:12, flexWrap:"wrap" }}>
          {plan.vibe && <Tag label={plan.vibe} color="green"/>}
          {plan.budget && <Tag label={budgetLabel[plan.budget]||plan.budget} color="muted"/>}
          {plan.duration && <Tag label={plan.duration} color="muted"/>}
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={e=>{e.stopPropagation();setVoted(!voted);setVotes(v=>voted?v-1:v+1);}}
              style={{ background:voted?C.accent:C.bg, border:`1.5px solid ${voted?C.accent:C.border}`, borderRadius:20, padding:"5px 12px", cursor:"pointer", fontSize:12, fontWeight:700, color:voted?C.accentText:C.muted, display:"flex", alignItems:"center", gap:4, transition:"all 0.2s" }}>
              ▲ {votes}
            </button>
            <button onClick={e=>{e.stopPropagation();navigator.share&&navigator.share({title:plan.title,text:plan.subtitle,url:window.location.href});}}
              style={{ background:C.bg, border:`1.5px solid ${C.border}`, borderRadius:20, padding:"5px 12px", cursor:"pointer", fontSize:12, fontWeight:600, color:C.muted }}>
              ↗ {t.share}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Feed Screen ───────────────────────────────────────────────────────────────
function FeedScreen({ t, go, onPlanClick, onUpload }) {
  const [filter, setFilter] = useState("all");
  const [sortRandom, setSortRandom] = useState(false);
  const [plans, setPlans] = useState(MOCK);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [activeAdvanced, setActiveAdvanced] = useState(null);

  const fetchPlans = async (f, rand) => {
    setLoading(true);
    const data = await db.getPlans(f, rand);
    let result;
    if (data) {
      result = data;
    } else {
      // Filter MOCK data locally
      result = MOCK.filter(p => {
        if (f === "all") return true;
        if (f === "Montaña" || f === "Muntanya") return p.vibe === "naturaleza" && (p.title.toLowerCase().includes("montserrat") || p.title.toLowerCase().includes("garrotxa") || p.title.toLowerCase().includes("delta") || p.emoji === "⛰️");
        if (f === "Playa" || f === "Platja") return p.vibe === "naturaleza" && (p.title.toLowerCase().includes("costa") || p.title.toLowerCase().includes("barceloneta") || p.emoji === "🏖️");
        if (f === "Ciudad" || f === "Ciutat") return p.vibe === "cultura" && p.transport === "no";
        if (f === "Pueblos" || f === "Pobles") return p.title.toLowerCase().includes("besalú") || p.title.toLowerCase().includes("pals") || p.emoji === "🏰";
        if (f === "Gastronomía" || f === "Gastronomia") return p.vibe === "gastronomia";
        return true;
      });
      if (result.length === 0) result = MOCK;
    }
    if (rand) result = [...result].sort(() => Math.random() - 0.5);
    setPlans(result);
    setLoading(false);
  };

  const handleFilterChange = (f) => {
    const newF = filter===f ? "all" : f;
    setFilter(newF);
    fetchPlans(newF, sortRandom);
  };

  const toggleSort = () => {
    const nr = !sortRandom;
    setSortRandom(nr);
    fetchPlans(filter, nr);
  };

  const requestLocation = () => {
    navigator.geolocation?.getCurrentPosition(
      pos => setUserLocation({ lat:pos.coords.latitude, lng:pos.coords.longitude }),
      () => {}
    );
  };

  const allFilters = t.filters;

  return (
    <div style={{ minHeight:"100vh", background:C.bg, paddingTop:52 }}>
      {showFilters && <FiltersPanel t={t} onClose={()=>setShowFilters(false)} onApply={f=>setActiveAdvanced(f)} userLocation={userLocation} onRequestLocation={requestLocation}/>}

      {/* Subtitle */}
      <div style={{ padding:"18px 16px 0" }}>
        <p style={{ fontSize:14, color:C.muted, lineHeight:1.6 }}>{t.subtitle}</p>
      </div>

      {/* Filters row */}
      <div style={{ display:"flex", alignItems:"center", gap:0, paddingTop:14, paddingBottom:12, overflowX:"auto", scrollbarWidth:"none" }}>
        <div style={{ width:16, flexShrink:0 }} />

        {/* Sort toggle */}
        <button onClick={toggleSort} style={{ background:C.card, border:`1.5px solid ${C.border}`, borderRadius:20, padding:"7px 13px", fontSize:12, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap", color:C.muted, fontFamily:FONT.body, marginRight:8, flexShrink:0, display:"flex", alignItems:"center", gap:5 }}>
          {sortRandom ? "🔀" : "▲"} {sortRandom ? t.random : t.topVoted}
        </button>

        {/* Category filters */}
        {allFilters.map(f => (
          <button key={f} onClick={()=>handleFilterChange(f)} style={{ background:filter===f?C.black:C.card, color:filter===f?C.white:C.muted, border:`1.5px solid ${filter===f?C.black:C.border}`, borderRadius:20, padding:"7px 14px", fontSize:13, fontWeight:600, cursor:"pointer", whiteSpace:"nowrap", marginRight:8, transition:"all 0.2s", fontFamily:FONT.body, flexShrink:0 }}>{f}</button>
        ))}

        {/* Advanced filters button */}
        <button onClick={()=>setShowFilters(true)} style={{ background: activeAdvanced ? C.accent : C.card, color: activeAdvanced ? C.accentText : C.muted, border:`1.5px solid ${activeAdvanced?C.accent:C.border}`, borderRadius:20, padding:"7px 13px", fontSize:13, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap", marginRight:16, flexShrink:0, display:"flex", alignItems:"center", gap:5, fontFamily:FONT.body }}>
          ⚙️ {t.moreFilters}{activeAdvanced?" ✓":""}
        </button>
      </div>

      {/* Feed */}
      <div style={{ padding:"4px 16px 100px" }}>
        {loading ? (
          <div style={{ textAlign:"center", padding:60, color:C.muted }}>
            <div style={{ fontSize:28, animation:"spin 1.5s linear infinite", marginBottom:12 }}>◌</div>
            Cargando planes...
          </div>
        ) : (
          plans.map(plan => <FeedCard key={plan.id} plan={plan} t={t} onClick={()=>onPlanClick(plan)}/>)
        )}

        {/* Upload CTA */}
        <div style={{ background:C.accent+"30", border:`1.5px solid ${C.accent}`, borderRadius:18, padding:22, textAlign:"center" }}>
          <div style={{ fontSize:28, marginBottom:10 }}>📝</div>
          <div style={{ fontFamily:FONT.display, fontSize:16, fontWeight:800, color:C.black, marginBottom:6 }}>¿Has hecho un plan increíble?</div>
          <div style={{ fontSize:13, color:C.muted, marginBottom:14 }}>Compártelo con la comunidad</div>
          <Btn onClick={onUpload} variant="black">{t.uploadPlan}</Btn>
        </div>
      </div>
    </div>
  );
}

// ── Plan Detail ───────────────────────────────────────────────────────────────
function PlanDetail({ plan, t, onBack, onDoPlan, onRequireAuth, isLoggedIn }) {
  const [saved, setSaved] = useState(false);
  const [planDone, setPlanDone] = useState(false);
  const [reported, setReported] = useState(false);
  const [reportTxt, setReportTxt] = useState("");
  const [showReport, setShowReport] = useState(false);

  const handleDoPlan = () => {
    if (!isLoggedIn) { onRequireAuth(); return; }
    setSaved(true);
    setPlanDone(true);
  };

  return (
    <div style={{ minHeight:"100vh", background:C.bg, paddingTop:52, paddingBottom:40 }}>
      <div style={{ position:"relative", height:260, overflow:"hidden", background:`linear-gradient(135deg,${C.accent}30,${C.accent}10)` }}>
        <img src={plan.img||""} alt={plan.title} style={{ width:"100%", height:"100%", objectFit:"cover" }} onError={e=>e.target.style.display="none"}/>
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)" }}/>
        <button onClick={onBack} style={{ position:"absolute", top:16, left:16, background:"rgba(255,255,255,0.88)", backdropFilter:"blur(8px)", border:"none", borderRadius:20, padding:"8px 16px", cursor:"pointer", fontSize:13, fontWeight:600, color:C.black, fontFamily:FONT.body }}>← Volver</button>
        <div style={{ position:"absolute", bottom:16, left:16, right:60 }}>
          <div style={{ fontSize:32, marginBottom:6 }}>{plan.emoji}</div>
          <h1 style={{ fontFamily:FONT.display, fontSize:20, fontWeight:900, color:"#fff", lineHeight:1.2 }}>{plan.title}</h1>
        </div>
      </div>

      <div style={{ padding:"20px 16px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <div style={{ fontSize:13, color:C.muted }}>📍 {plan.zone}</div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={()=>setSaved(!saved)} style={{ background:saved?C.accent:"transparent", border:`1.5px solid ${saved?C.accent:C.border}`, borderRadius:20, padding:"6px 14px", cursor:"pointer", fontSize:12, fontWeight:700, color:saved?C.accentText:C.muted, transition:"all 0.2s", fontFamily:FONT.body }}>{saved?t.saved:t.save}</button>
            <button onClick={()=>navigator.share&&navigator.share({title:plan.title,text:plan.subtitle,url:window.location.href})} style={{ background:"transparent", border:`1.5px solid ${C.border}`, borderRadius:20, padding:"6px 12px", cursor:"pointer", fontSize:12, color:C.muted, fontFamily:FONT.body }}>↗</button>
          </div>
        </div>

        <p style={{ fontSize:14, color:C.muted, lineHeight:1.6, marginBottom:20 }}>{plan.subtitle}</p>

        <Btn onClick={handleDoPlan} variant="black" style={{ width:"100%", padding:"15px", fontSize:15, marginBottom:24, borderRadius:14 }}>
          {planDone ? "✓ Plan guardado en tu perfil" : t.doPlan}
        </Btn>

        {plan.stops?.length > 0 && (
          <>
            <h2 style={{ fontFamily:FONT.display, fontSize:17, fontWeight:800, color:C.black, marginBottom:16 }}>{t.planDay}</h2>
            <div style={{ marginBottom:24 }}>
              {plan.stops.map((stop,i)=>{
                const s=tagStyle(stop.tagColor);
                return (
                  <div key={i} style={{ display:"flex", gap:14 }}>
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", width:34, flexShrink:0 }}>
                      <div style={{ width:32, height:32, borderRadius:"50%", background:s.bg, border:`2px solid ${s.text}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>{stop.icon}</div>
                      {i<plan.stops.length-1&&<div style={{ width:2, flex:1, background:C.border, margin:"4px 0" }}/>}
                    </div>
                    <div style={{ paddingBottom:18, flex:1 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                        <span style={{ fontSize:12, color:C.accentText, fontWeight:800, fontFamily:FONT.display }}>{stop.time}</span>
                        <span style={{ fontSize:10, fontWeight:700, color:s.text, background:s.bg, padding:"2px 8px", borderRadius:20, textTransform:"uppercase" }}>{stop.tag}</span>
                      </div>
                      <div style={{ fontSize:14, fontWeight:700, color:C.black, marginBottom:3, fontFamily:FONT.display }}>{stop.title}</div>
                      <div style={{ fontSize:13, color:C.muted, lineHeight:1.5 }}>{stop.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {plan.tips?.length > 0 && (
          <div style={{ background:C.accent+"25", border:`1.5px solid ${C.accent}`, borderRadius:16, padding:16, marginBottom:24 }}>
            <div style={{ fontSize:13, fontWeight:800, color:C.accentText, marginBottom:10, fontFamily:FONT.display }}>💡 {t.tips}</div>
            {plan.tips.map((tip,i)=><div key={i} style={{ fontSize:13, color:C.text, marginBottom:6, display:"flex", gap:8 }}><span style={{color:C.accentText}}>•</span><span>{tip}</span></div>)}
          </div>
        )}

        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:16 }}>
          <div style={{ fontSize:13, fontWeight:700, color:C.black, marginBottom:4 }}>⚠️ {t.report}</div>
          <div style={{ fontSize:12, color:C.muted, marginBottom:12 }}>{t.reportDesc}</div>
          {reported ? <div style={{ fontSize:13, color:"#1D6334", fontWeight:600 }}>✓ {t.reportSent}</div>
          : showReport ? (
            <div>
              <textarea value={reportTxt} onChange={e=>setReportTxt(e.target.value)} placeholder="Describe el problema..." style={{ width:"100%", background:C.bg, border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 14px", fontSize:13, color:C.text, outline:"none", fontFamily:FONT.body, minHeight:80, resize:"none", boxSizing:"border-box", marginBottom:10 }}/>
              <Btn onClick={async()=>{await db.report(reportTxt);setReported(true);}} variant="black" style={{ width:"100%" }}>Enviar</Btn>
            </div>
          ) : (
            <button onClick={()=>setShowReport(true)} style={{ background:C.bg, border:`1px solid ${C.border}`, color:C.muted, borderRadius:10, padding:"10px 16px", fontSize:13, cursor:"pointer", width:"100%", fontFamily:FONT.body }}>{t.reportBtn}</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Time Selector ─────────────────────────────────────────────────────────────
function TimeSelector({ t, onComplete }) {
  const [mode, setMode] = useState("day");
  const [sel, setSel] = useState(null);
  const [end, setEnd] = useState(null);
  const [sh, setSh] = useState(9);
  const [eh, setEh] = useState(20);
  const today = new Date().getDate();
  const days = 31; const fd = 3;
  const fmt = h=>`${String(h).padStart(2,"0")}:00`;
  const click = day => {
    if(day<today) return;
    if(mode==="day"){setSel(day);setEnd(day);}
    else if(mode==="weekend"){const dow=new Date(2026,4,day).getDay();const sat=dow===6?day:dow===0?day-1:day+(6-dow);setSel(Math.min(sat,days));setEnd(Math.min(sat+1,days));}
    else{if(!sel||end){setSel(day);setEnd(null);}else{day<sel?(setEnd(sel),setSel(day)):setEnd(day);}}
  };
  const isSel=d=>d===sel||d===end;
  const isRange=d=>sel&&end&&end>sel&&d>sel&&d<end;
  const dur=!sel?null:(!end||end===sel)?"1 día":end-sel+1===2?"Fin de semana":`${end-sel+1} días`;

  return (
    <div>
      <div style={{ display:"flex", gap:8, marginBottom:18 }}>
        {[{id:"day",l:"Un día"},{id:"weekend",l:"Fin de semana"},{id:"custom",l:"Personalizado"}].map(m=>(
          <button key={m.id} onClick={()=>{setMode(m.id);setSel(null);setEnd(null);}} style={{ flex:1, background:mode===m.id?C.black:C.bg, color:mode===m.id?C.white:C.muted, border:`1.5px solid ${mode===m.id?C.black:C.border}`, borderRadius:10, padding:"10px 0", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:FONT.body }}>{m.l}</button>
        ))}
      </div>
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:16, marginBottom:14 }}>
        <div style={{ textAlign:"center", fontSize:14, fontWeight:800, color:C.black, marginBottom:12, fontFamily:FONT.display }}>Mayo 2026</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", marginBottom:6 }}>
          {["D","L","M","X","J","V","S"].map(d=><div key={d} style={{ textAlign:"center", fontSize:11, color:C.dim, fontWeight:700 }}>{d}</div>)}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2 }}>
          {Array.from({length:fd},(_,i)=><div key={`e${i}`}/>)}
          {Array.from({length:days},(_,i)=>{
            const day=i+1;const s=isSel(day);const r=isRange(day);const past=day<today;
            return <button key={day} onClick={()=>click(day)} style={{ aspectRatio:"1", borderRadius:8, background:s?C.accent:r?C.accent+"40":"transparent", border:day===today&&!s?`2px solid ${C.accent}`:"1px solid transparent", color:s?C.accentText:past?C.dim:C.black, fontSize:13, fontWeight:s?800:400, cursor:past?"default":"pointer", fontFamily:FONT.body }}>{day}</button>;
          })}
        </div>
        {sel&&<div style={{ marginTop:10, textAlign:"center", fontSize:13, color:C.accentText, fontWeight:700, background:C.accent+"25", borderRadius:8, padding:"6px" }}>{mode==="custom"&&!end?"Selecciona el día de vuelta":`✓ ${dur} seleccionado`}</div>}
      </div>
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:16, marginBottom:18 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <span style={{ fontSize:14, fontWeight:800, color:C.black, fontFamily:FONT.display }}>⏰ Horas disponibles</span>
          <span style={{ fontSize:12, fontWeight:700, color:C.accentText, background:C.accent+"30", padding:"3px 10px", borderRadius:20 }}>{eh-sh}h</span>
        </div>
        <div style={{ height:6, background:C.border, borderRadius:3, marginBottom:12, position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", left:`${(sh/23)*100}%`, width:`${((eh-sh)/23)*100}%`, height:"100%", background:C.accent, borderRadius:3 }}/>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          {[{label:"Desde",opts:[7,8,9,10,11,12],val:sh,set:setSh},{label:"Hasta",opts:[14,16,18,20,22,23],val:eh,set:setEh}].map(({label,opts,val,set})=>(
            <div key={label}>
              <div style={{ fontSize:11, color:C.muted, marginBottom:6, fontWeight:700, textTransform:"uppercase", letterSpacing:0.5 }}>{label}</div>
              <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                {opts.map(h=><button key={h} onClick={()=>set(h)} style={{ background:val===h?C.black:C.bg, color:val===h?C.white:C.muted, border:`1.5px solid ${val===h?C.black:C.border}`, borderRadius:8, padding:"5px 7px", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:FONT.body }}>{fmt(h)}</button>)}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop:12, padding:"8px", background:C.accent+"20", borderRadius:10, fontSize:13, color:C.accentText, fontWeight:700, textAlign:"center" }}>{fmt(sh)} → {fmt(eh)} · {eh-sh}h</div>
      </div>
      <Btn onClick={()=>sel&&onComplete({date:sel,endDate:end,startHour:sh,endHour:eh,mode})} variant={sel?"black":"ghost"} style={{ width:"100%", padding:"15px", fontSize:15, borderRadius:14, opacity:sel?1:0.5 }}>
        {sel?`${t.continueWith} ${dur} →`:t.selectDay}
      </Btn>
    </div>
  );
}

// ── Quiz ──────────────────────────────────────────────────────────────────────
function QuizScreen({ t, timeData, onComplete, onBack }) {
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

  const answer = val=>{
    const a={...answers,[q.id]:val};
    setAnswers(a);
    if(step<QUESTIONS.length-1){setStep(step+1);setTxt("");}
    else onComplete(a);
  };

  return (
    <div style={{ minHeight:"100vh", background:C.bg, paddingTop:52 }}>
      <div style={{ height:3, background:C.border }}>
        <div style={{ height:"100%", width:`${(step/QUESTIONS.length)*100}%`, background:C.accent, transition:"width 0.4s" }}/>
      </div>
      <div style={{ padding:"20px 16px 40px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
          <button onClick={()=>step>0?setStep(step-1):onBack()} style={{ background:"transparent", border:"none", color:C.muted, cursor:"pointer", fontSize:14, fontFamily:FONT.body }}>{t.back}</button>
          <span style={{ fontSize:12, color:C.dim, fontWeight:600 }}>{step+1} / {QUESTIONS.length}</span>
        </div>
        {timeData&&<div style={{ background:C.accent+"20", border:`1px solid ${C.accent}`, borderRadius:12, padding:"10px 14px", fontSize:12, color:C.accentText, fontWeight:700, marginBottom:20 }}>📅 {timeData.mode==="weekend"?"Fin de semana":"1 día"} · ⏰ {String(timeData.startHour).padStart(2,"0")}:00 → {String(timeData.endHour).padStart(2,"0")}:00</div>}
        <div style={{ fontSize:40, marginBottom:14 }}>{q.emoji}</div>
        <h2 style={{ fontFamily:FONT.display, fontSize:24, fontWeight:900, color:C.black, marginBottom:8, lineHeight:1.2, letterSpacing:-0.3 }}>{qData.q}</h2>
        <p style={{ fontSize:14, color:C.muted, marginBottom:26 }}>{qData.sub}</p>
        {q.type==="text"?(
          <div>
            <input value={txt} onChange={e=>setTxt(e.target.value)} placeholder="Barcelona, Madrid, Sevilla..." onKeyDown={e=>e.key==="Enter"&&txt.trim()&&answer(txt)}
              style={{ width:"100%", background:C.card, border:`2px solid ${txt?C.accent:C.border}`, borderRadius:14, padding:"15px 18px", fontSize:15, color:C.black, outline:"none", marginBottom:14, boxSizing:"border-box", fontFamily:FONT.body, transition:"border-color 0.2s" }}/>
            <Btn onClick={()=>txt.trim()&&answer(txt)} variant={txt.trim()?"black":"ghost"} style={{ width:"100%", padding:"15px", fontSize:15, borderRadius:14 }}>{t.next}</Btn>
          </div>
        ):(
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {q.opts.map(o=>(
              <button key={o.v} onClick={()=>answer(o.v)}
                style={{ background:C.card, border:`2px solid ${C.border}`, borderRadius:14, padding:"14px 18px", cursor:"pointer", display:"flex", alignItems:"center", gap:14, color:C.black, transition:"all 0.15s", fontFamily:FONT.body }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=C.accent;e.currentTarget.style.background=C.accent+"15";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.card;}}>
                <span style={{ fontSize:26 }}>{o.i}</span>
                <div>
                  <div style={{ fontSize:15, fontWeight:700 }}>{labels[q.id]?.[o.v]||o.v}</div>
                  {o.s&&<div style={{ fontSize:12, color:C.muted }}>{o.s}</div>}
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
function LoadingScreen({ t }) {
  const [phase, setPhase] = useState(0);
  useEffect(()=>{ const i=setInterval(()=>setPhase(p=>p<t.steps.length-1?p+1:p),780); return()=>clearInterval(i); },[]);
  return (
    <div style={{ minHeight:"100vh", background:C.black, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ fontSize:56, marginBottom:20, animation:"spin 2s linear infinite" }}>◌</div>
      <h2 style={{ fontFamily:FONT.display, fontSize:22, fontWeight:900, color:C.white, marginBottom:6, textAlign:"center" }}>{t.preparing}</h2>
      <p style={{ fontSize:13, color:"rgba(255,255,255,0.35)", marginBottom:36 }}>OnlyPlans IA</p>
      <div style={{ width:"100%", maxWidth:280, display:"flex", flexDirection:"column", gap:14 }}>
        {t.steps.map((p,i)=>(
          <div key={i} style={{ display:"flex", alignItems:"center", gap:12, opacity:i<=phase?1:0.15, transition:"opacity 0.5s" }}>
            <div style={{ width:20, height:20, borderRadius:"50%", background:i<phase?C.accent:i===phase?C.white:"rgba(255,255,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, flexShrink:0, color:i<phase?C.accentText:C.black }}>{i<phase?"✓":""}</div>
            <span style={{ fontSize:13, color:i<=phase?C.white:"rgba(255,255,255,0.3)", fontFamily:FONT.body }}>{p}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Generated Plan ────────────────────────────────────────────────────────────
function GeneratedPlan({ plan, answers, t, onBack, onRegen, go, error }) {
  const [saved, setSaved] = useState(false);
  const handleSave=async()=>{setSaved(true);if(plan&&answers)await db.savePlan(plan,answers);};

  if(error) return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24, paddingTop:80 }}>
      <div style={{ fontSize:52, marginBottom:16 }}>😕</div>
      <h2 style={{ fontFamily:FONT.display, fontSize:20, fontWeight:900, color:C.black, marginBottom:10, textAlign:"center" }}>Algo ha fallado</h2>
      <p style={{ fontSize:14, color:C.muted, textAlign:"center", marginBottom:24, lineHeight:1.6 }}>{error}</p>
      <Btn onClick={onRegen} variant="black">Intentar de nuevo</Btn>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:C.bg, paddingTop:52, paddingBottom:40 }}>
      <div style={{ padding:"20px 16px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <button onClick={onBack} style={{ background:"transparent", border:"none", color:C.muted, cursor:"pointer", fontSize:14, fontFamily:FONT.body }}>← Inicio</button>
          <Btn onClick={handleSave} variant={saved?"accent":"ghost"} style={{ padding:"7px 16px", fontSize:12, borderRadius:20 }}>{saved?t.saved:t.save}</Btn>
        </div>
        {plan&&(
          <>
            <div style={{ background:C.black, borderRadius:20, padding:22, marginBottom:20 }}>
              <div style={{ fontSize:40, marginBottom:12 }}>{plan.emoji||"🗺️"}</div>
              <h1 style={{ fontFamily:FONT.display, fontSize:20, fontWeight:900, color:C.white, marginBottom:8, lineHeight:1.2 }}>{plan.title}</h1>
              <p style={{ fontSize:13, color:"rgba(255,255,255,0.55)", marginBottom:10 }}>{plan.subtitle}</p>
              <div style={{ fontSize:12, color:C.accent, fontWeight:700 }}>📍 {plan.zone}</div>
            </div>
            <h2 style={{ fontFamily:FONT.display, fontSize:17, fontWeight:800, color:C.black, marginBottom:16 }}>{t.planDay}</h2>
            <div style={{ marginBottom:20 }}>
              {plan.stops?.map((stop,i)=>{
                const s=tagStyle(stop.tagColor);
                return (
                  <div key={i} style={{ display:"flex", gap:14 }}>
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", width:34, flexShrink:0 }}>
                      <div style={{ width:32, height:32, borderRadius:"50%", background:s.bg, border:`2px solid ${s.text}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>{stop.icon}</div>
                      {i<plan.stops.length-1&&<div style={{ width:2, flex:1, background:C.border, margin:"4px 0" }}/>}
                    </div>
                    <div style={{ paddingBottom:18, flex:1 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                        <span style={{ fontSize:12, color:C.accentText, fontWeight:800 }}>{stop.time}</span>
                        <span style={{ fontSize:10, fontWeight:700, color:s.text, background:s.bg, padding:"2px 8px", borderRadius:20, textTransform:"uppercase" }}>{stop.tag}</span>
                      </div>
                      <div style={{ fontSize:14, fontWeight:700, color:C.black, marginBottom:3, fontFamily:FONT.display }}>{stop.title}</div>
                      <div style={{ fontSize:13, color:C.muted, lineHeight:1.5 }}>{stop.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            {plan.tips?.length>0&&(
              <div style={{ background:C.accent+"25", border:`1.5px solid ${C.accent}`, borderRadius:16, padding:16, marginBottom:20 }}>
                <div style={{ fontSize:13, fontWeight:800, color:C.accentText, marginBottom:10, fontFamily:FONT.display }}>💡 {t.tips}</div>
                {plan.tips.map((tip,i)=><div key={i} style={{ fontSize:13, color:C.text, marginBottom:6, display:"flex", gap:8 }}><span style={{color:C.accentText}}>•</span><span>{tip}</span></div>)}
              </div>
            )}
          </>
        )}
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          <Btn onClick={onRegen} variant="black" style={{ width:"100%", padding:"15px", fontSize:15, borderRadius:14 }}>{t.generateNew}</Btn>
          <Btn onClick={()=>go("feed")} variant="ghost" style={{ width:"100%", padding:"15px", borderRadius:14 }}>Ver más planes →</Btn>
        </div>
      </div>
    </div>
  );
}

// ── Profile ───────────────────────────────────────────────────────────────────
function ProfileScreen({ t, go, lang, setLang, onUpload, isLoggedIn, onLogin, user, onLogout }) {
  if (!isLoggedIn) {
    return (
      <div style={{ minHeight:"100vh", background:C.bg, paddingTop:52, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"52px 24px 40px" }}>
        <div style={{ fontSize:56, marginBottom:20 }}>👤</div>
        <h2 style={{ fontFamily:FONT.display, fontSize:22, fontWeight:900, color:C.black, marginBottom:10, textAlign:"center" }}>Crea tu cuenta</h2>
        <p style={{ fontSize:14, color:C.muted, textAlign:"center", marginBottom:32, lineHeight:1.6 }}>
          Regístrate para guardar planes, subir los tuyos y llevar un historial de tus escapadas.
        </p>
        <Btn onClick={onLogin} variant="black" style={{ width:"100%", maxWidth:320, padding:"15px", fontSize:15, borderRadius:14, marginBottom:12 }}>
          Crear cuenta
        </Btn>
        <button onClick={onLogin} style={{ background:"transparent", border:"none", color:C.muted, fontSize:14, cursor:"pointer", fontFamily:FONT.body }}>
          Ya tengo cuenta · Iniciar sesión
        </button>
      </div>
    );
  }

  const displayName = user?.name || user?.email?.split("@")[0] || "Usuario";
  const initial = displayName[0]?.toUpperCase() || "U";

  return (
    <div style={{ minHeight:"100vh", background:C.bg, paddingTop:52, paddingBottom:40 }}>
      <div style={{ padding:"24px 16px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:24 }}>
          <div style={{ width:60, height:60, borderRadius:"50%", background:C.accent, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, fontWeight:900, color:C.accentText, fontFamily:FONT.display }}>{initial}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:FONT.display, fontSize:18, fontWeight:900, color:C.black }}>{displayName}</div>
            <div style={{ fontSize:12, color:C.muted }}>{user?.email}</div>
          </div>
          <button onClick={onLogout} style={{ background:"transparent", border:`1px solid ${C.border}`, borderRadius:20, padding:"6px 14px", fontSize:12, color:C.muted, cursor:"pointer", fontFamily:FONT.body }}>Salir</button>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:24 }}>
          {[{n:"0",l:t.generatedLbl},{n:"0",l:t.savedPlans},{n:"0",l:t.myPlans}].map((s,i)=>(
            <div key={i} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:"14px 8px", textAlign:"center" }}>
              <div style={{ fontFamily:FONT.display, fontSize:26, fontWeight:900, color:C.accent }}>{s.n}</div>
              <div style={{ fontSize:11, color:C.muted, lineHeight:1.3, marginTop:4 }}>{s.l}</div>
            </div>
          ))}
        </div>

        <Btn onClick={onUpload} variant="accent" style={{ width:"100%", padding:"14px", fontSize:14, borderRadius:14, marginBottom:24 }}>
          📝 {t.addPlanFromProfile}
        </Btn>

        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:20, marginBottom:24, textAlign:"center" }}>
          <div style={{ fontSize:32, marginBottom:10 }}>🗺️</div>
          <div style={{ fontSize:14, color:C.muted }}>Aún no tienes planes guardados. ¡Empieza a explorar!</div>
        </div>

        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:16 }}>
          <div style={{ fontSize:13, fontWeight:800, color:C.black, marginBottom:14, fontFamily:FONT.display }}>🌐 {t.language}</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {[{code:"es",label:t.langEs},{code:"ca",label:t.langCa}].map(l=>(
              <button key={l.code} onClick={()=>setLang(l.code)} style={{ background:lang===l.code?C.accent:C.bg, color:lang===l.code?C.accentText:C.muted, border:`1.5px solid ${lang===l.code?C.accent:C.border}`, borderRadius:12, padding:"12px 0", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:FONT.body, transition:"all 0.2s" }}>{l.label}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Auth Modal ────────────────────────────────────────────────────────────────
const supabaseAuth = {
  async signUp(email, password, name) {
    const r = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: "POST",
      headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, data: { full_name: name } }),
    });
    return r.json();
  },
  async signIn(email, password) {
    const r = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return r.json();
  },
  async getUser(token) {
    const r = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}` },
    });
    return r.json();
  },
  saveSession(data) {
    try { localStorage.setItem("op_session", JSON.stringify({ token: data.access_token, email: data.user?.email, name: data.user?.user_metadata?.full_name || data.user?.email?.split("@")[0] })); } catch {}
  },
  loadSession() {
    try { const s = localStorage.getItem("op_session"); return s ? JSON.parse(s) : null; } catch { return null; }
  },
  clearSession() {
    try { localStorage.removeItem("op_session"); } catch {}
  },
};

function AuthModal({ t, onClose, onSuccess }) {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) { setError("Rellena todos los campos"); return; }
    if (!isLogin && password.length < 6) { setError("La contraseña debe tener al menos 6 caracteres"); return; }
    setLoading(true);
    setError("");
    try {
      let data;
      if (isLogin) {
        data = await supabaseAuth.signIn(email, password);
      } else {
        data = await supabaseAuth.signUp(email, password, name);
      }
      if (data.error || data.msg) {
        setError(data.error_description || data.msg || "Ha ocurrido un error. Inténtalo de nuevo.");
        setLoading(false);
        return;
      }
      if (data.access_token) {
        supabaseAuth.saveSession(data);
        setDone(true);
        setTimeout(() => {
          onSuccess({ email: data.user?.email, name: data.user?.user_metadata?.full_name || data.user?.email?.split("@")[0], token: data.access_token });
          onClose();
        }, 800);
      } else {
        setError("Ha ocurrido un error. Inténtalo de nuevo.");
        setLoading(false);
      }
    } catch {
      setError("Error de conexión. Inténtalo de nuevo.");
      setLoading(false);
    }
  };

  const inputStyle = { background: C.bg, border: `1.5px solid ${C.border}`, borderRadius: 12, padding: "14px 16px", fontSize: 14, color: C.text, outline: "none", fontFamily: FONT.body, width: "100%", boxSizing: "border-box" };

  return (
    <div style={{ position: "fixed", inset: 0, background: C.overlay, zIndex: 400, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={onClose}>
      <div style={{ background: C.card, borderRadius: "20px 20px 0 0", padding: 24, width: "100%", maxWidth: 480 }} onClick={e => e.stopPropagation()}>
        <div style={{ width: 36, height: 4, background: C.border, borderRadius: 2, margin: "0 auto 20px" }} />

        {done ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✓</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.black, fontFamily: FONT.display }}>¡Bienvenido/a!</div>
          </div>
        ) : (
          <>
            <h2 style={{ fontFamily: FONT.display, fontSize: 20, fontWeight: 900, color: C.black, marginBottom: 6 }}>
              {isLogin ? "Iniciar sesión" : "Crear cuenta"}
            </h2>
            <p style={{ fontSize: 13, color: C.muted, marginBottom: 20 }}>Para guardar planes y subir los tuyos</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {!isLogin && (
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre" style={inputStyle} />
              )}
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" style={{ ...inputStyle, border: `1.5px solid ${email ? C.accent : C.border}` }} />
              <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña (mínimo 6 caracteres)" type="password" style={{ ...inputStyle, border: `1.5px solid ${password.length >= 6 ? C.accent : C.border}` }} />

              {error && (
                <div style={{ background: "#FEE2E2", border: "1px solid #FCA5A5", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#B91C1C" }}>
                  {error}
                </div>
              )}

              <Btn onClick={handleSubmit} variant="black" style={{ width: "100%", padding: "15px", fontSize: 15, borderRadius: 14, opacity: loading ? 0.7 : 1 }}>
                {loading ? "..." : isLogin ? "Entrar" : "Crear cuenta"}
              </Btn>
              <button onClick={() => { setIsLogin(!isLogin); setError(""); }} style={{ background: "transparent", border: "none", color: C.muted, fontSize: 13, cursor: "pointer", fontFamily: FONT.body }}>
                {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("feed");
  const [lang, setLang] = useState("es");
  const [timeData, setTimeData] = useState(null);
  const [answers, setAnswers] = useState(null);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [planError, setPlanError] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState(null);
  const t = LANGS[lang];

  // Restore session on load
  useEffect(() => {
    const session = supabaseAuth.loadSession();
    if (session?.token) setUser(session);
  }, []);

  const go = s => { setScreen(s); window.scrollTo(0, 0); };
  const requireAuth = () => setShowAuth(true);

  const handleUpload = () => {
    if (!user) { setShowAuth(true); return; }
    setShowUpload(true);
  };

  const handleLogout = () => {
    supabaseAuth.clearSession();
    setUser(null);
  };

  const handleQuizComplete = async ans => {
    setAnswers(ans);
    go("loading");
    try {
      const p = await generatePlan(ans, timeData, lang);
      setGeneratedPlan(p); setPlanError(null); go("generated");
    } catch(e) {
      setPlanError("No hemos podido generar el plan. Comprueba tu conexión e inténtalo de nuevo.");
      go("generated");
    }
  };

  const handleRegen = async () => {
    if (!answers) { go("feed"); return; }
    go("loading");
    try {
      const p = await generatePlan(answers, timeData, lang);
      setGeneratedPlan(p); setPlanError(null); go("generated");
    } catch {
      setPlanError("No hemos podido regenerar el plan."); go("generated");
    }
  };

  return (
    <div style={{ fontFamily: FONT.body, WebkitFontSmoothing: "antialiased", maxWidth: 480, margin: "0 auto", background: C.bg, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        body { background:${C.bg}; }
        ::-webkit-scrollbar { width:0; }
        input::placeholder, textarea::placeholder { color:${C.dim}; }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>

      {showUpload && <UploadModal t={t} onClose={() => setShowUpload(false)} />}
      {showAuth && <AuthModal t={t} onClose={() => setShowAuth(false)} onSuccess={u => { setUser(u); setShowAuth(false); }} />}

      {screen !== "loading" && (
        <TopNav screen={screen} go={go} t={t} onCreatePlan={() => go("time")} onUpload={handleUpload} />
      )}

      {screen === "feed" && <FeedScreen t={t} go={go} onPlanClick={p => { setSelectedPlan(p); go("detail"); }} onUpload={handleUpload} />}
      {screen === "detail" && selectedPlan && <PlanDetail plan={selectedPlan} t={t} onBack={() => go("feed")} onDoPlan={() => go("time")} onRequireAuth={requireAuth} isLoggedIn={!!user} />}
      {screen === "time" && (
        <div style={{ minHeight: "100vh", background: C.bg, paddingTop: 52 }}>
          <div style={{ padding: "20px 16px" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>📅</div>
            <h2 style={{ fontFamily: FONT.display, fontSize: 24, fontWeight: 900, color: C.black, marginBottom: 6, letterSpacing: -0.3 }}>{t.when}</h2>
            <p style={{ fontSize: 14, color: C.muted, marginBottom: 22 }}>{t.whenSub}</p>
            <TimeSelector t={t} onComplete={d => { setTimeData(d); go("quiz"); }} />
          </div>
        </div>
      )}
      {screen === "quiz" && <QuizScreen t={t} timeData={timeData} onComplete={handleQuizComplete} onBack={() => go("time")} />}
      {screen === "loading" && <LoadingScreen t={t} />}
      {screen === "generated" && <GeneratedPlan plan={generatedPlan} answers={answers} t={t} onBack={() => go("feed")} onRegen={handleRegen} go={go} error={planError} />}
      {screen === "profile" && <ProfileScreen t={t} go={go} lang={lang} setLang={setLang} onUpload={handleUpload} isLoggedIn={!!user} onLogin={() => setShowAuth(true)} user={user} onLogout={handleLogout} />}
    </div>
  );
}
