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
    cats: ["Montaña","Playa","Ciudad","Pueblos","Espectáculos","Gastronomía"],
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
    budgetFilter: "Presupuesto", transportFilter: "Transporte",
    groupFilter: "Grupo", applyFilters: "Aplicar filtros",
    clearFilters: "Limpiar filtros",
    distOpts: ["10 km","30 km","50 km","100 km","Sin límite"],
    durOpts: ["Mañana","Tarde","Día completo","Fin de semana"],
    budgetOpts: ["Económico","Normal","Sin límite"],
    transportOpts: ["Con coche","Sin coche"],
    groupOpts: ["Pareja","Amigos","Familia","Solo"],
    locationNeeded: "Activa tu ubicación para filtrar por distancia",
    allowLocation: "Permitir",
  },
  ca: {
    createPlan: "Crear el meu pla", uploadPlan: "+ Pujar pla",
    subtitle: "Descobreix plans a prop teu o crea els teus amb IA.",
    topVoted: "Més votats", random: "Aleatori",
    cats: ["Muntanya","Platja","Ciutat","Pobles","Espectacles","Gastronomia"],
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
    budgetFilter: "Pressupost", transportFilter: "Transport",
    groupFilter: "Grup", applyFilters: "Aplicar filtres",
    clearFilters: "Netejar filtres",
    distOpts: ["10 km","30 km","50 km","100 km","Sense límit"],
    durOpts: ["Matí","Tarda","Dia complet","Cap de setmana"],
    budgetOpts: ["Econòmic","Normal","Sense límit"],
    transportOpts: ["Amb cotxe","Sense cotxe"],
    groupOpts: ["Parella","Amics","Família","Sol"],
    locationNeeded: "Activa la teva ubicació per filtrar per distància",
    allowLocation: "Permetre",
  }
};

// ── Mock plans ────────────────────────────────────────────────────────────────
const MOCK = [
  { id:"m1", emoji:"⛰️", title:"Amanecer en Montserrat + Viñedos Penedès", subtitle:"Montaña sagrada, vistas únicas y vino de la tierra", zone:"Barcelona · 1h", vibe:"naturaleza", budget:"mid", transport:"yes", votes_count:412, duration:"Día completo", img:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80", photos:["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80","https://images.unsplash.com/photo-1474524955719-b9f87c50ce47?w=800&q=80","https://images.unsplash.com/photo-1510797215324-95aa89f43c33?w=800&q=80"], stops:[{time:"08:00",icon:"🚗",title:"Salida hacia Montserrat",desc:"A-2 dirección Martorell. Aparcamiento en la base del teleférico.",tag:"Viaje",tagColor:"muted"},{time:"09:30",icon:"⛰️",title:"Montserrat",desc:"Sube en teleférico. Visita la Moreneta y haz la ruta Sant Joan. Vistas espectaculares.",tag:"Naturaleza",tagColor:"green"},{time:"13:00",icon:"🍷",title:"Bodega Torres",desc:"Visita guiada con cata incluida. Reserva previa. ~25€/persona.",tag:"Gastronomía",tagColor:"orange"},{time:"15:30",icon:"🌿",title:"Viñedos del Penedès",desc:"Paseo entre viñas. Paisaje precioso en primavera y otoño.",tag:"Naturaleza",tagColor:"green"},{time:"18:00",icon:"🏠",title:"Vuelta a casa",desc:"Por la AP-7. Llegarás antes de las 19:30.",tag:"Viaje",tagColor:"muted"}], tips:["Reserva el teleférico online para evitar colas","La Bodega Torres necesita reserva con antelación"] },
  { id:"m2", emoji:"🏰", title:"Besalú Medieval + Volcanes de la Garrotxa", subtitle:"Puente románico del s.XII y paisaje volcánico único", zone:"Girona · 1h 30min", vibe:"cultura", budget:"mid", transport:"yes", votes_count:347, duration:"Día completo", img:"https://images.unsplash.com/photo-1555993539-1732b0258235?w=800&q=80", photos:["https://images.unsplash.com/photo-1555993539-1732b0258235?w=800&q=80","https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"], stops:[{time:"08:30",icon:"🚗",title:"Salida hacia Besalú",desc:"C-17 y N-260. Aparcamiento junto al río Fluvià.",tag:"Viaje",tagColor:"muted"},{time:"10:00",icon:"🏰",title:"Besalú",desc:"Cruza el puente románico del s.XII. Visita el barrio judío y la iglesia de Sant Pere.",tag:"Cultura",tagColor:"accent"},{time:"12:30",icon:"🌋",title:"Volcà del Croscat",desc:"El volcán más joven de la Península. Ruta de 3km muy sencilla.",tag:"Naturaleza",tagColor:"green"},{time:"14:30",icon:"🍽️",title:"Can Jubany",desc:"Restaurante de referencia. Cocina catalana de autor. Reserva imprescindible.",tag:"Restaurante",tagColor:"orange"},{time:"17:00",icon:"🌲",title:"Fageda d'en Jordà",desc:"El hayedo más bonito de Cataluña. 45 min entre hayas centenarias.",tag:"Naturaleza",tagColor:"green"}], tips:["Mejor en otoño para los colores del hayedo","Can Jubany: reserva con semanas de antelación"] },
  { id:"m3", emoji:"🏙️", title:"Barrio Gótico + Santa Caterina + Barceloneta", subtitle:"Lo mejor de Barcelona en un día sin agobios", zone:"Barcelona · Ciudad", vibe:"cultura", budget:"low", transport:"no", votes_count:289, duration:"Día completo", img:"https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&q=80", photos:[], stops:[{time:"10:00",icon:"🚇",title:"Metro Jaume I",desc:"Línea 4 amarilla. Salida directa al Gótico.",tag:"Viaje",tagColor:"muted"},{time:"10:15",icon:"🏛️",title:"Barrio Gótico",desc:"Catedral, Pont del Bisbe, Plaça Reial. 2h sin prisas.",tag:"Cultura",tagColor:"accent"},{time:"12:30",icon:"🛒",title:"Mercat de Santa Caterina",desc:"Sin turistas. Tapa de calamar y vermut. ~10€.",tag:"Gastronomía",tagColor:"orange"},{time:"14:00",icon:"🦞",title:"La Mar Salada",desc:"Arròs negre y mariscos. Terraza con vistas al mar. ~30€.",tag:"Restaurante",tagColor:"orange"},{time:"16:00",icon:"🏖️",title:"Barceloneta",desc:"Paseo marítimo hasta el Port Olímpic.",tag:"Ocio",tagColor:"green"}], tips:["Evita la Barceloneta en agosto","El Mercat de Santa Caterina abre L-S hasta las 15h"] },
  { id:"m4", emoji:"🏖️", title:"Costa Brava: Calella + Begur + Pals medieval", subtitle:"Calas de roca, castillo medieval y gastronomía de mar", zone:"Girona · 1h 45min", vibe:"naturaleza", budget:"mid", transport:"yes", votes_count:231, duration:"Día completo", img:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80", photos:[], stops:[{time:"09:00",icon:"🚗",title:"Salida hacia Calella",desc:"AP-7. Aparcamiento en el pueblo, a pie a las calas.",tag:"Viaje",tagColor:"muted"},{time:"11:00",icon:"🏊",title:"Calas de Calella de Palafrugell",desc:"Aguas cristalinas. Las más bonitas de la Costa Brava.",tag:"Naturaleza",tagColor:"green"},{time:"13:30",icon:"🐟",title:"Sa Riera",desc:"Pescado fresco del día en primera línea de mar.",tag:"Restaurante",tagColor:"orange"},{time:"15:30",icon:"🏰",title:"Begur",desc:"Castillo medieval con vistas al mar.",tag:"Cultura",tagColor:"accent"},{time:"17:00",icon:"🏘️",title:"Pals medieval",desc:"Uno de los pueblos medievales mejor conservados.",tag:"Cultura",tagColor:"accent"}], tips:["Llega antes de las 10h a las calas en verano","Pals es precioso al atardecer"] },
  { id:"m5", emoji:"🌊", title:"Delta del Ebro + Flamencos + Arroz del Delta", subtitle:"Naturaleza salvaje, flamencos rosas y el mejor arroz", zone:"Tarragona · 2h", vibe:"naturaleza", budget:"low", transport:"yes", votes_count:178, duration:"Día completo", img:"https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80", photos:[], stops:[{time:"08:00",icon:"🚗",title:"Salida hacia el Delta",desc:"AP-7. Llegada a Deltebre en 2h.",tag:"Viaje",tagColor:"muted"},{time:"10:00",icon:"🦩",title:"Observatorio de flamencos",desc:"Miles de flamencos rosas. Mejor con prismáticos.",tag:"Naturaleza",tagColor:"green"},{time:"12:00",icon:"🚤",title:"Crucero por los canales",desc:"Recorrido en barca. ~15€/persona.",tag:"Actividad",tagColor:"accent"},{time:"14:00",icon:"🍚",title:"L'Algadir del Delta",desc:"El mejor arroz del Delta. ~25€.",tag:"Restaurante",tagColor:"orange"},{time:"16:00",icon:"🌅",title:"Playa del Trabucador",desc:"Lengua de arena entre el mar y la laguna.",tag:"Naturaleza",tagColor:"green"}], tips:["Lleva ropa para el viento","Mejor época: primavera y otoño"] },
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
  h: { apikey:SUPABASE_KEY, Authorization:`Bearer ${SUPABASE_KEY}`, "Content-Type":"application/json" },
  ah: (t) => ({ apikey:SUPABASE_KEY, Authorization:`Bearer ${t}`, "Content-Type":"application/json" }),

  async getPlans(filter="all", sortRandom=false) {
    let url = `${SUPABASE_URL}/rest/v1/plans?is_approved=eq.true&order=votes_count.desc&limit=30`;
    const vibeMap = { "Montaña":"naturaleza","Muntanya":"naturaleza","Playa":"naturaleza","Platja":"naturaleza","Pueblos":"cultura","Pobles":"cultura","Ciudad":"cultura","Ciutat":"cultura","Gastronomía":"gastronomia","Gastronomia":"gastronomia","Espectáculos":"aventura","Espectacles":"aventura" };
    if (vibeMap[filter]) url += `&vibe=eq.${vibeMap[filter]}`;

    // Get local user-uploaded plans (non-AI)
    const localUploaded = (()=>{ try { return JSON.parse(localStorage.getItem("op_my_plans")||"[]").filter(p=>!p.is_ai_generated); } catch { return []; } })();

    try {
      const r = await fetch(url, {headers:this.h});
      const d = await r.json();
      if (Array.isArray(d) && d.length > 0) {
        // Merge local uploaded plans that aren't already in db results
        const dbIds = new Set(d.map(p=>p.id));
        const extras = localUploaded.filter(p=>!dbIds.has(p.id));
        const merged = [...extras, ...d];
        return sortRandom ? [...merged].sort(()=>Math.random()-0.5) : merged;
      }
    } catch {}

    // Fallback to MOCK + local uploaded
    let result = [...localUploaded, ...MOCK];
    if (vibeMap[filter]) {
      const vibe = vibeMap[filter];
      result = result.filter(p => p.vibe === vibe);
    }
    if (filter === "Playa" || filter === "Platja") result = [...localUploaded.filter(p=>p.vibe==="naturaleza"), ...MOCK.filter(p => p.emoji === "🏖️" || p.title.toLowerCase().includes("costa") || p.title.toLowerCase().includes("delta"))];
    if (filter === "Montaña" || filter === "Muntanya") result = [...localUploaded.filter(p=>p.vibe==="naturaleza"), ...MOCK.filter(p => p.emoji === "⛰️")];
    if (filter === "Pueblos" || filter === "Pobles") result = [...localUploaded.filter(p=>p.vibe==="cultura"), ...MOCK.filter(p => p.emoji === "🏰")];
    if (result.length === 0) result = [...localUploaded, ...MOCK];
    return sortRandom ? [...result].sort(()=>Math.random()-0.5) : result;
  },

  async submitPlan(data) {
    try {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/plans`, {
        method:"POST", headers:{...this.h, Prefer:"return=representation"},
        body: JSON.stringify({...data, is_approved:true, votes_count:0}),
      });
      const d = await r.json();
      return Array.isArray(d) ? d[0] : d;
    } catch { return null; }
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

  saveMyPlanLocal(plan) {
    try {
      const existing = JSON.parse(localStorage.getItem("op_my_plans") || "[]");
      if (!existing.find(p => p.id === plan.id)) {
        existing.unshift({
          id: plan.id||`gen-${Date.now()}`,
          title: plan.title, subtitle: plan.subtitle,
          zone: plan.zone, emoji: plan.emoji, img: plan.img||null,
          votes_count: 0, stops: plan.stops||[], tips: plan.tips||[],
          photos: plan.photos||[], vibe: plan.vibe, budget: plan.budget,
          is_ai_generated: plan.is_ai_generated!==false,
        });
        localStorage.setItem("op_my_plans", JSON.stringify(existing.slice(0,50)));
      }
    } catch {}
  },

  getMyPlansLocal() {
    try { return JSON.parse(localStorage.getItem("op_my_plans") || "[]"); } catch { return []; }
  },

  removeMyPlanLocal(id) {
    try {
      const existing = JSON.parse(localStorage.getItem("op_my_plans") || "[]");
      localStorage.setItem("op_my_plans", JSON.stringify(existing.filter(p => p.id !== id)));
    } catch {}
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
  const savedList = db.getSavedLocal();
  const [saved, setSaved] = useState(!!savedList.find(p=>p.id===plan.id));
  const [votes, setVotes] = useState(plan.votes_count||0);
  const [voted, setVoted] = useState(false);
  const budgetL = {low:"Económico",mid:"Normal",high:"Sin límite"};

  const handleSave = async (e) => {
    e.stopPropagation();
    if (!user) { onRequireAuth(); return; }
    if (saved) { db.removeSavedLocal(plan.id); setSaved(false); }
    else { await db.saveToLocal(plan); setSaved(true); }
  };

  return (
    <div onClick={onClick} style={{background:C.card,borderRadius:18,overflow:"hidden",boxShadow:"0 1px 12px rgba(0,0,0,0.05)",cursor:"pointer",transition:"transform 0.2s,box-shadow 0.2s",marginBottom:14}}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 28px rgba(0,0,0,0.1)";}}
      onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 1px 12px rgba(0,0,0,0.05)";}}>
      <div style={{position:"relative"}}>
        <PhotoCarousel photos={plan.photos} fallback={plan.image_url || plan.img} height={210} emoji={plan.emoji}/>
        <div style={{position:"absolute",top:12,left:12,background:"rgba(255,255,255,0.88)",backdropFilter:"blur(8px)",borderRadius:20,padding:"4px 11px",fontSize:11,fontWeight:600,color:C.black}}>
          📍 {plan.zone}
        </div>
        <button onClick={handleSave} style={{position:"absolute",top:10,right:10,background:saved?"rgba(181,217,106,0.9)":"rgba(255,255,255,0.88)",backdropFilter:"blur(8px)",border:"none",borderRadius:"50%",width:34,height:34,cursor:"pointer",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s"}}>
          {saved?"🔖":"🤍"}
        </button>
        <div style={{position:"absolute",bottom:10,left:12,fontSize:28}}>{plan.emoji}</div>
      </div>
      <div style={{padding:"14px 16px"}}>
        <h3 style={{fontFamily:F,fontSize:16,fontWeight:800,color:C.black,marginBottom:5,lineHeight:1.25,letterSpacing:-0.2}}>{plan.title}</h3>
        <p style={{fontSize:13,color:C.muted,marginBottom:12,lineHeight:1.5}}>{plan.subtitle}</p>
        <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
          {plan.vibe&&<Tag label={plan.vibe} color="green"/>}
          {plan.budget&&<Tag label={budgetL[plan.budget]||plan.budget} color="muted"/>}
          {plan.duration&&<Tag label={plan.duration} color="muted"/>}
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",gap:8}}>
            <button onClick={e=>{e.stopPropagation();setVoted(!voted);setVotes(v=>voted?v-1:v+1);}} style={{background:voted?C.accent:C.bg,border:`1.5px solid ${voted?C.accent:C.border}`,borderRadius:20,padding:"5px 12px",cursor:"pointer",fontSize:12,fontWeight:700,color:voted?C.accentText:C.muted,transition:"all 0.2s"}}>▲ {votes}</button>
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
  const [cat, setCat] = useState(activeFilters.cat||null);
  const [dist, setDist] = useState(activeFilters.dist||null);
  const [dur, setDur] = useState(activeFilters.dur||null);
  const [budget, setBudget] = useState(activeFilters.budget||null);
  const [transport, setTransport] = useState(activeFilters.transport||null);
  const [group, setGroup] = useState(activeFilters.group||null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);

  const requestLocation = () => {
    setLocationError(null);
    if (!navigator.geolocation) { setLocationError("Tu navegador no soporta geolocalización"); return; }
    navigator.geolocation.getCurrentPosition(
      pos => setUserLocation({lat:pos.coords.latitude, lng:pos.coords.longitude}),
      (err) => {
        if (err.code === 1) setLocationError("Permiso denegado. Actívalo en ajustes del navegador.");
        else setLocationError("No se pudo obtener la ubicación. Inténtalo de nuevo.");
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  const hasActive = cat||dist||dur||budget||transport||group;

  const Row = ({label,opts,val,set}) => (
    <div style={{marginBottom:18}}>
      <div style={{fontSize:12,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:0.6,marginBottom:8}}>{label}</div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        {opts.map(o=>(
          <button key={o} onClick={()=>set(val===o?null:o)} style={{background:val===o?C.black:C.bg,color:val===o?C.white:C.muted,border:`1.5px solid ${val===o?C.black:C.border}`,borderRadius:20,padding:"7px 14px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:F,transition:"all 0.15s"}}>{o}</button>
        ))}
      </div>
    </div>
  );

  const touchStartY = useRef(0);

  const handleDragStart = (e) => { touchStartY.current = e.touches[0].clientY; };
  const handleDragEnd = (e) => {
    const diff = e.changedTouches[0].clientY - touchStartY.current;
    if (diff > 60) onClose();
  };

  return (
    <div style={{position:"fixed",inset:0,background:C.overlay,zIndex:300,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={onClose}>
      <div style={{background:C.card,borderRadius:"20px 20px 0 0",width:"100%",maxWidth:480,maxHeight:"85vh",display:"flex",flexDirection:"column"}} onClick={e=>e.stopPropagation()}>
        {/* Drag handle — touch events here to swipe down and close */}
        <div onTouchStart={handleDragStart} onTouchEnd={handleDragEnd}
          style={{padding:"16px 24px 8px", flexShrink:0, cursor:"grab"}}>
          <div style={{width:36,height:4,background:C.border,borderRadius:2,margin:"0 auto"}}/>
        </div>
        {/* Scrollable content — independent of drag handle */}
        <div style={{overflowY:"auto", padding:"0 24px 24px", flex:1}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
          <span style={{fontFamily:F,fontSize:18,fontWeight:800,color:C.black}}>{t.filters}</span>
          <button onClick={()=>{setCat(null);setDist(null);setDur(null);setBudget(null);setTransport(null);setGroup(null);}} style={{background:"transparent",border:"none",fontSize:13,color:hasActive?C.black:C.dim,cursor:"pointer",fontFamily:F,fontWeight:hasActive?700:400}}>{t.clearFilters}</button>
        </div>

        <Row label="Categoría" opts={t.cats} val={cat} set={setCat}/>

        <div style={{marginBottom:18}}>
          <div style={{fontSize:12,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:0.6,marginBottom:8}}>{t.distanceFilter}</div>
          {!userLocation ? (
            <div>
              <div style={{background:C.accent+"20",border:`1px solid ${C.accent}`,borderRadius:12,padding:"12px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:13,color:C.accentText}}>{t.locationNeeded}</span>
                <button onClick={requestLocation} style={{background:C.accent,border:"none",borderRadius:10,padding:"6px 14px",fontSize:12,fontWeight:700,cursor:"pointer",color:C.accentText,fontFamily:F}}>{t.allowLocation}</button>
              </div>
              {locationError && <div style={{fontSize:12,color:"#B91C1C",marginTop:8,padding:"6px 10px",background:"#FEE2E2",borderRadius:8}}>{locationError}</div>}
            </div>
          ) : (
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {t.distOpts.map(o=><button key={o} onClick={()=>setDist(dist===o?null:o)} style={{background:dist===o?C.black:C.bg,color:dist===o?C.white:C.muted,border:`1.5px solid ${dist===o?C.black:C.border}`,borderRadius:20,padding:"7px 14px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:F}}>{o}</button>)}
            </div>
          )}
        </div>

        <Row label={t.durationFilter} opts={t.durOpts} val={dur} set={setDur}/>
        <Row label={t.budgetFilter} opts={t.budgetOpts} val={budget} set={setBudget}/>
        <Row label={t.transportFilter} opts={t.transportOpts} val={transport} set={setTransport}/>
        <Row label={t.groupFilter} opts={t.groupOpts} val={group} set={setGroup}/>

        <Btn onClick={()=>{onApply({cat,dist,dur,budget,transport,group});onClose();}} variant="black" style={{width:"100%",padding:"15px",borderRadius:14,marginTop:4}}>
          {t.applyFilters} {hasActive?`(${[cat,dist,dur,budget,transport,group].filter(Boolean).length})`:""}
        </Btn>
        </div>{/* end scrollable */}
      </div>{/* end sheet */}
    </div>
  );
}

// ── Feed Screen ───────────────────────────────────────────────────────────────
function FeedScreen({t, go, onPlanClick, onUpload, user, onRequireAuth}) {
  const [filter, setFilter] = useState("all");
  const [sortRandom, setSortRandom] = useState(false);
  const [plans, setPlans] = useState(MOCK);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  const hasActiveFilters = Object.values(activeFilters).some(Boolean);

  const load = async (f, rand) => {
    setLoading(true);
    const data = await db.getPlans(f, rand);
    setPlans(data);
    setLoading(false);
  };

  // Load from Supabase on mount — this is what was missing
  useEffect(() => { load("all", false); }, []);

  const handleCat = (f) => {
    const nf = filter===f?"all":f;
    setFilter(nf);
    load(nf, sortRandom);
  };

  const toggleSort = () => {
    const nr = !sortRandom;
    setSortRandom(nr);
    load(filter, nr);
  };

  const applyFilters = (f) => {
    setActiveFilters(f);
    // If category was set in advanced filters, also update the quick filter bar
    if (f.cat) {
      setFilter(f.cat);
      load(f.cat, sortRandom);
    }
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
  const savedList = db.getSavedLocal();
  const [saved, setSaved] = useState(!!savedList.find(p=>p.id===plan.id));
  const [reported, setReported] = useState(false);
  const [reportTxt, setReportTxt] = useState("");
  const [showReport, setShowReport] = useState(false);
  const [planDone, setPlanDone] = useState(false);

  const handleSave = async () => {
    if (!user) { onRequireAuth(); return; }
    if (saved) { db.removeSavedLocal(plan.id); setSaved(false); }
    else { await db.saveToLocal(plan); setSaved(true); }
  };

  const handleDoPlan = () => {
    if (!user) { onRequireAuth(); return; }
    db.saveToLocal(plan);
    setSaved(true);
    setPlanDone(true);
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
          <div style={{fontSize:13,color:C.muted}}>📍 {plan.zone}</div>
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

        {plan.author_id && (
          <div onClick={()=>go("userProfile",{userId:plan.author_id,userName:plan.author_name})} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:14,marginBottom:24,display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}>
            <div style={{width:40,height:40,borderRadius:"50%",background:C.accent,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:700,color:C.accentText,flexShrink:0}}>
              {plan.author_avatar ? <img src={plan.author_avatar} style={{width:40,height:40,borderRadius:"50%",objectFit:"cover"}} alt=""/> : (plan.author_name||"U")[0].toUpperCase()}
            </div>
            <div>
              <div style={{fontSize:13,fontWeight:700,color:C.black}}>Plan de {plan.author_name||"usuario"}</div>
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

// ── Upload Modal ──────────────────────────────────────────────────────────────
function UploadModal({t, onClose, user, onUploaded}) {
  const STEPS = 5;
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [vibes, setVibes] = useState([]);
  const [budget, setBudget] = useState(null);
  const [transport, setTransport] = useState(null);
  const [zone, setZone] = useState("");
  const [stops, setStops] = useState([{time:"",icon:"📍",title:"",desc:""},{time:"",icon:"🍽️",title:"",desc:""},{time:"",icon:"🏠",title:"",desc:""}]);
  const [tip1, setTip1] = useState("");
  const [tip2, setTip2] = useState("");
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  const vibeOpts = [{v:"naturaleza",l:"Naturaleza 🌿"},{v:"cultura",l:"Cultura 🏛️"},{v:"gastronomia",l:"Gastronomía 🍽️"},{v:"tranquilidad",l:"Tranquilidad 😌"},{v:"aventura",l:"Aventura ⚡"}];
  const budgetOpts = [{v:"low",l:"Económico · <30€"},{v:"mid",l:"Normal · 30-80€"},{v:"high",l:"Sin límite · >80€"}];

  const toggleVibe = (v) => setVibes(p=>p.includes(v)?p.filter(x=>x!==v):[...p,v]);
  const updateStop = (i,f,v) => { const s=[...stops]; s[i]={...s[i],[f]:v}; setStops(s); };
  const addStop = () => setStops([...stops,{time:"",icon:"📍",title:"",desc:""}]);
  const removeStop = (i) => stops.length>2&&setStops(stops.filter((_,idx)=>idx!==i));

  const handlePhotos = (e) => {
    const files = Array.from(e.target.files).slice(0,5);
    const previews = files.map(f=>({file:f,url:URL.createObjectURL(f)}));
    setPhotos(previews);
  };

  const handlePublish = async () => {
    setUploading(true);
    // Upload photos
    let photoUrls = [];
    for (const p of photos) {
      const url = await db.uploadPhoto(p.file, user?.token);
      if (url) photoUrls.push(url);
    }
    const planData = {
      title, subtitle, zone,
      vibe: vibes[0]||"naturaleza",
      budget, transport, group_type:"amigos",
      is_ai_generated: false,
      stops: stops.filter(s=>s.title.trim()).map(s=>({...s,tag:"Parada",tagColor:"accent"})),
      tips: [tip1,tip2].filter(Boolean),
      photos: photoUrls,
      image_url: photoUrls[0]||null,
      user_id: user?.id||null,
    };
    const result = await db.submitPlan(planData);
    // Save to myPlans locally regardless of Supabase result
    db.saveMyPlanLocal({...planData, id: result?.id || `my-${Date.now()}`});
    setUploading(false);
    setDone(true);
    if (onUploaded) onUploaded();
  };

  const inp = (val) => ({background:C.bg,border:`1.5px solid ${val?C.accent:C.border}`,borderRadius:12,padding:"12px 14px",fontSize:14,color:C.text,outline:"none",fontFamily:F,width:"100%",transition:"border-color 0.2s",boxSizing:"border-box"});
  const can1=title.trim().length>3;
  const can2=vibes.length>0&&budget&&transport&&zone.trim();
  const can3=stops.filter(s=>s.title.trim()).length>=1;

  const ChipRow = ({label,opts,val,set,multi}) => (
    <div style={{marginBottom:16}}>
      <div style={{fontSize:12,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:0.6,marginBottom:8}}>{label}</div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        {opts.map(o=>{const active=multi?val.includes(o.v):val===o.v;return(
          <button key={o.v} onClick={()=>set(o.v)} style={{background:active?C.black:C.bg,color:active?C.white:C.muted,border:`1.5px solid ${active?C.black:C.border}`,borderRadius:20,padding:"7px 14px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:F,transition:"all 0.15s"}}>{o.l}</button>
        );})}
      </div>
    </div>
  );

  return (
    <div style={{position:"fixed",inset:0,background:C.overlay,zIndex:300,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={onClose}>
      <div style={{background:C.card,borderRadius:"20px 20px 0 0",padding:24,width:"100%",maxWidth:480,maxHeight:"92vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
        <div style={{width:36,height:4,background:C.border,borderRadius:2,margin:"0 auto 20px"}}/>

        {done ? (
          <div style={{textAlign:"center",padding:"20px 0"}}>
            <div style={{fontSize:56,marginBottom:16}}>🎉</div>
            <div style={{fontFamily:F,fontSize:22,fontWeight:800,color:C.black,marginBottom:8}}>{t.thanks}</div>
            <div style={{fontSize:14,color:C.muted,marginBottom:24}}>{t.thanksDesc}</div>
            <Btn onClick={onClose} variant="black">{t.close}</Btn>
          </div>
        ) : (
          <>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <span style={{fontFamily:F,fontSize:18,fontWeight:800,color:C.black}}>{[t.step1,t.step2,t.step3,t.step4,t.step5][step-1]}</span>
              <span style={{fontSize:12,color:C.dim}}>{step}/{STEPS}</span>
            </div>
            <div style={{height:3,background:C.border,borderRadius:2,marginBottom:20}}>
              <div style={{height:"100%",width:`${(step/STEPS)*100}%`,background:C.accent,borderRadius:2,transition:"width 0.3s"}}/>
            </div>

            {step===1&&(
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                <div>
                  <div style={{fontSize:12,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:0.6,marginBottom:8}}>{t.planTitle}</div>
                  <input value={title} onChange={e=>setTitle(e.target.value)} placeholder={t.planTitlePh} style={inp(title)}/>
                </div>
                <div>
                  <div style={{fontSize:12,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:0.6,marginBottom:8}}>{t.planSubtitle}</div>
                  <input value={subtitle} onChange={e=>setSubtitle(e.target.value)} placeholder={t.planSubPh} style={inp(subtitle)}/>
                </div>
                <Btn onClick={()=>can1&&setStep(2)} variant={can1?"black":"ghost"} style={{width:"100%",padding:"14px",borderRadius:14,marginTop:8}}>{t.next}</Btn>
              </div>
            )}

            {step===2&&(
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                <ChipRow label={t.planType} opts={vibeOpts} val={vibes} set={toggleVibe} multi/>
                <ChipRow label={t.budget} opts={budgetOpts} val={budget} set={v=>setBudget(budget===v?null:v)}/>
                <ChipRow label={t.haveCar} opts={[{v:"yes",l:"Con coche 🚗"},{v:"no",l:"Sin coche 🚇"}]} val={transport} set={v=>setTransport(transport===v?null:v)}/>
                <div>
                  <div style={{fontSize:12,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:0.6,marginBottom:8}}>{t.zone}</div>
                  <input value={zone} onChange={e=>setZone(e.target.value)} placeholder={t.zonePh} style={inp(zone)}/>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:8}}>
                  <Btn onClick={()=>setStep(1)} variant="ghost">{t.back}</Btn>
                  <Btn onClick={()=>can2&&setStep(3)} variant={can2?"black":"ghost"}>{t.next}</Btn>
                </div>
              </div>
            )}

            {step===3&&(
              <div>
                <p style={{fontSize:13,color:C.muted,marginBottom:14,lineHeight:1.5}}>Mínimo 1 parada. La primera debería ser la salida y la última la vuelta.</p>
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
                <button onClick={addStop} style={{background:"transparent",border:`1.5px dashed ${C.border}`,borderRadius:12,padding:"12px",width:"100%",fontSize:13,fontWeight:600,color:C.muted,cursor:"pointer",fontFamily:F,marginBottom:12}}>{t.addStop}</button>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  <Btn onClick={()=>setStep(2)} variant="ghost">{t.back}</Btn>
                  <Btn onClick={()=>can3&&setStep(4)} variant={can3?"black":"ghost"}>{t.next}</Btn>
                </div>
              </div>
            )}

            {step===4&&(
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                <p style={{fontSize:13,color:C.muted,lineHeight:1.5}}>Consejos prácticos que no están en Google. Opcionales pero muy valorados.</p>
                <input value={tip1} onChange={e=>setTip1(e.target.value)} placeholder={t.tip1Ph} style={inp(tip1)}/>
                <input value={tip2} onChange={e=>setTip2(e.target.value)} placeholder={t.tip2Ph} style={inp(tip2)}/>

                <div style={{background:C.bg,border:`1.5px dashed ${C.border}`,borderRadius:14,padding:18,textAlign:"center"}}>
                  <div style={{fontSize:28,marginBottom:8}}>📸</div>
                  <div style={{fontSize:14,fontWeight:700,color:C.black,marginBottom:4}}>{t.addPhotos}</div>
                  <div style={{fontSize:12,color:C.muted,marginBottom:12}}>{t.photosDesc}</div>
                  <input ref={fileRef} type="file" accept="image/*" multiple style={{display:"none"}} onChange={handlePhotos}/>
                  <button onClick={()=>fileRef.current.click()} style={{background:C.accent,color:C.accentText,border:"none",borderRadius:10,padding:"8px 20px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:F}}>
                    {photos.length>0?`✓ ${photos.length} foto${photos.length>1?"s":""} seleccionada${photos.length>1?"s":""}`:t.addPhotos}
                  </button>
                  {photos.length>0&&(
                    <div style={{display:"flex",gap:8,marginTop:12,overflowX:"auto"}}>
                      {photos.map((p,i)=><img key={i} src={p.url} style={{width:60,height:60,borderRadius:8,objectFit:"cover",flexShrink:0}} alt=""/>)}
                    </div>
                  )}
                </div>

                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  <Btn onClick={()=>setStep(3)} variant="ghost">{t.back}</Btn>
                  <Btn onClick={()=>setStep(5)} variant="black">{t.next}</Btn>
                </div>
              </div>
            )}

            {step===5&&(
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                <div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:14,padding:16}}>
                  <div style={{fontSize:16,fontWeight:800,color:C.black,marginBottom:4,fontFamily:F}}>{title}</div>
                  {subtitle&&<div style={{fontSize:13,color:C.muted,marginBottom:8}}>{subtitle}</div>}
                  <div style={{fontSize:12,color:C.muted,marginBottom:8}}>📍 {zone}</div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
                    {vibes.map(v=><span key={v} style={{fontSize:11,fontWeight:700,color:C.tagGreen.t,background:C.tagGreen.b,padding:"3px 9px",borderRadius:20,textTransform:"uppercase"}}>{vibeOpts.find(o=>o.v===v)?.l}</span>)}
                    {budget&&<span style={{fontSize:11,fontWeight:700,color:C.tagMuted.t,background:C.tagMuted.b,padding:"3px 9px",borderRadius:20,textTransform:"uppercase"}}>{budgetOpts.find(o=>o.v===budget)?.l}</span>}
                    {transport&&<span style={{fontSize:11,fontWeight:700,color:C.tagAccent.t,background:C.tagAccent.b,padding:"3px 9px",borderRadius:20,textTransform:"uppercase"}}>{transport==="yes"?"Con coche 🚗":"Sin coche 🚇"}</span>}
                  </div>
                  <div style={{fontSize:12,color:C.muted}}>{stops.filter(s=>s.title).length} paradas · {[tip1,tip2].filter(Boolean).length} consejos · {photos.length} fotos</div>
                </div>
                <div style={{background:C.accent+"20",border:`1px solid ${C.accent}`,borderRadius:12,padding:12,fontSize:13,color:C.accentText}}>
                  ✓ Tu plan aparecerá en el feed inmediatamente
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  <Btn onClick={()=>setStep(4)} variant="ghost">{t.back}</Btn>
                  <Btn onClick={handlePublish} variant="accent" style={{opacity:uploading?0.7:1}}>{uploading?"Subiendo...":t.publish+" ✓"}</Btn>
                </div>
              </div>
            )}
          </>
        )}
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
function GeneratedPlan({plan, answers, t, onBack, onRegen, go, error}) {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    if (plan) {
      const planWithId = {...plan, id: plan.id||`gen-${Date.now()}`, is_ai_generated: true};
      db.saveToLocal(planWithId);
      db.saveMyPlanLocal(planWithId);
    }
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
          <Btn onClick={handleSave} variant={saved?"accent":"black"} style={{width:"100%",padding:"15px",fontSize:15,borderRadius:14}}>{saved?"✓ "+t.saved:t.save+" este plan"}</Btn>
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
    setSavedPlans(db.getSavedLocal());
    setMyPlans(db.getMyPlansLocal());
    // Load persisted bio/avatar
    try {
      const profile = JSON.parse(localStorage.getItem("op_profile") || "{}");
      if (profile.bio) setBio(profile.bio);
      if (profile.avatar) setAvatar(profile.avatar);
    } catch {}
  },[]);

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
                  <button onClick={e=>{e.stopPropagation();db.removeMyPlanLocal(p.id);setMyPlans(db.getMyPlansLocal());}}
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
                  <button onClick={e=>{e.stopPropagation();db.removeSavedLocal(p.id);setSavedPlans(db.getSavedLocal());}} style={{background:"transparent",border:"none",color:C.dim,cursor:"pointer",fontSize:18,padding:"4px"}}>×</button>
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
function UserProfileScreen({userId, userName, t, onBack}) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const initial = (userName||"U")[0].toUpperCase();

  useEffect(()=>{
    if (!userId) { setLoading(false); return; }
    fetch(`${SUPABASE_URL}/rest/v1/plans?author_id=eq.${userId}&is_approved=eq.true&order=votes_count.desc`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    }).then(r=>r.json()).then(d=>{ setPlans(Array.isArray(d)?d:[]); setLoading(false); }).catch(()=>setLoading(false));
  },[userId]);

  return (
    <div style={{minHeight:"100vh",background:C.bg,paddingTop:52,paddingBottom:40}}>
      <div style={{padding:"20px 16px"}}>
        <button onClick={onBack} style={{background:"transparent",border:"none",color:C.muted,cursor:"pointer",fontSize:14,fontFamily:F,marginBottom:20}}>← Volver</button>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:24}}>
          <div style={{width:64,height:64,borderRadius:"50%",background:C.accent,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,fontWeight:900,color:C.accentText,fontFamily:F}}>{initial}</div>
          <div>
            <div style={{fontFamily:F,fontSize:18,fontWeight:900,color:C.black}}>{userName||"Usuario"}</div>
            <div style={{fontSize:12,color:C.muted}}>{plans.length} plan{plans.length!==1?"es":""} publicado{plans.length!==1?"s":""}</div>
          </div>
        </div>
        <h2 style={{fontFamily:F,fontSize:16,fontWeight:800,color:C.black,marginBottom:16}}>{t.plansByUser} {userName}</h2>
        {loading ? (
          <div style={{textAlign:"center",padding:40,color:C.muted}}>Cargando...</div>
        ) : plans.length === 0 ? (
          <div style={{textAlign:"center",padding:40,color:C.muted}}>Este usuario aún no ha publicado planes.</div>
        ) : (
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {plans.map(p=>(
              <div key={p.id} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}}>
                {p.img&&<img src={p.img} alt="" style={{width:"100%",height:140,objectFit:"cover"}} onError={e=>e.target.style.display="none"}/>}
                <div style={{padding:14}}>
                  <div style={{fontSize:15,fontWeight:800,color:C.black,fontFamily:F,marginBottom:4}}>{p.title}</div>
                  <div style={{fontSize:12,color:C.muted}}>📍 {p.zone}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState(()=>{
    try { return sessionStorage.getItem("op_screen")||"feed"; } catch { return "feed"; }
  });
  const [screenParams, setScreenParams] = useState(()=>{
    try { return JSON.parse(sessionStorage.getItem("op_screen_params")||"{}"); } catch { return {}; }
  });
  const [lang, setLang] = useState(()=>{ try{return localStorage.getItem("op_lang")||"es";}catch{return"es";} });
  const [timeData, setTimeData] = useState(null);
  const [answers, setAnswers] = useState(null);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [planError, setPlanError] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [feedKey, setFeedKey] = useState(0); // force feed reload
  const t = T[lang];

  // Persist lang
  useEffect(()=>{ try{localStorage.setItem("op_lang",lang);}catch{} },[lang]);

  // Restore session
  useEffect(()=>{ const s=auth.load(); if(s?.token) setUser(s); },[]);

  const go = (s, params={}) => {
    setScreen(s); setScreenParams(params);
    try { sessionStorage.setItem("op_screen", s); sessionStorage.setItem("op_screen_params", JSON.stringify(params)); } catch {}
    if (s !== "profile") window.scrollTo(0,0);
  };
  const requireAuth = () => setShowAuth(true);
  const handleUpload = () => { if(!user){setShowAuth(true);return;} setShowUpload(true); };
  const handleLogout = () => { auth.clear(); setUser(null); };
  const handleUploaded = () => { setFeedKey(k=>k+1); }; // reload feed after upload

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

      {screen==="feed"&&<FeedScreen key={feedKey} t={t} go={go} onPlanClick={p=>{setSelectedPlan(p);go("detail",{from:"feed"});}} onUpload={handleUpload} user={user} onRequireAuth={requireAuth}/>}
      {screen==="detail"&&selectedPlan&&<PlanDetail plan={selectedPlan} t={t} onBack={()=>go(screenParams.from||"feed")} user={user} onRequireAuth={requireAuth} go={go}/>}
      {screen==="userProfile"&&<UserProfileScreen userId={screenParams.userId} userName={screenParams.userName} t={t} onBack={()=>go(screenParams.from||"feed")}/>}
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
      {screen==="generated"&&<GeneratedPlan plan={generatedPlan} answers={answers} t={t} onBack={()=>go("feed")} onRegen={handleRegen} go={go} error={planError}/>}
      {screen==="profile"&&<ProfileScreen t={t} lang={lang} setLang={setLang} onUpload={handleUpload} isLoggedIn={!!user} onLogin={()=>setShowAuth(true)} user={user} onLogout={handleLogout} go={go} onPlanClick={p=>{setSelectedPlan(p);go("detail",{from:"profile"});}}/> }
    </div>
  );
}
