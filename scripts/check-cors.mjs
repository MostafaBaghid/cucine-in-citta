// Throwaway script — FASE 0: verifica CORS sulle API BestieBite.
//
// Domanda da rispondere: le due API sono chiamabili direttamente dal browser
// (fetch client-side da http://localhost:3000 / dominio Vercel), o serve una
// Route Handler proxy in app/api?
//
// Metodo: le nostre chiamate sono GET "semplici" (nessun header custom), quindi
// il browser NON fa preflight: il verdetto dipende SOLO dalla presenza di
// `Access-Control-Allow-Origin` sulla risposta GET. Mandiamo comunque anche un
// OPTIONS preflight a scopo informativo.
//
// Uso: node scripts/check-cors.mjs
//
// ESITO (verificato 2026-06-06):
//   Entrambi gli endpoint rispondono con `Access-Control-Allow-Origin: *`
//   sia alla GET che al preflight OPTIONS (204, methods: GET,PUT,POST,...).
//   Confermato anche da un BROWSER REALE (CORS enforcement attivo) con
//   scripts/check-cors.html via Edge headless: HTTP 200 + body letti su
//   entrambi gli endpoint, nessun blocco CORS.
//
// DECISIONE: fetch diretto dal browser nelle queryFn di TanStack Query.
//   Una Route Handler proxy aggiungerebbe solo un hop (latenza su ogni
//   battuta dell'autocomplete), un punto di rottura in più e codice da
//   mantenere, senza alcun beneficio: niente API key da nascondere, niente
//   CORS da aggirare. Il client-side fetch preserva anche l'AbortSignal di
//   TanStack Query end-to-end per la cancellazione delle richieste obsolete.
//
// NOTA per remotePatterns (next.config): il brief indica le immagini su
//   firebasestorage.googleapis.com, ma la risposta reale serve image_emoji da
//   storage.googleapis.com (bucket bestie-bite.appspot.com). Configurare
//   ENTRAMBI i domini per coprire eventuali asset misti.

const ORIGIN = "http://localhost:3000";

const ENDPOINTS = [
  {
    label: "autocomplete",
    url: "https://api.bestiebite.com/places/v2/autocomplete?term=mila&lang=it&limit=8",
  },
  {
    label: "cuisines",
    url: "https://api.bestiebite.com/places/labels/by-location-and-type?lat=45.46&lng=9.17&type=cuisine",
  },
];

const CORS_HEADERS = [
  "access-control-allow-origin",
  "access-control-allow-methods",
  "access-control-allow-headers",
  "access-control-expose-headers",
  "vary",
];

function printHeaders(res) {
  for (const h of CORS_HEADERS) {
    const v = res.headers.get(h);
    console.log(`    ${h}: ${v ?? "(assente)"}`);
  }
}

let allCorsOk = true;

for (const { label, url } of ENDPOINTS) {
  console.log(`\n=== ${label} ===\n${url}`);

  // 1) GET con Origin browser-like — il caso reale
  const get = await fetch(url, { headers: { Origin: ORIGIN } });
  console.log(`  GET -> HTTP ${get.status}`);
  printHeaders(get);

  const acao = get.headers.get("access-control-allow-origin");
  const corsOk = get.ok && (acao === "*" || acao === ORIGIN);
  if (!corsOk) allCorsOk = false;
  console.log(
    `  CORS GET: ${corsOk ? "OK" : "BLOCCATO (status non-2xx o ACAO mancante/diverso)"}`
  );

  // Sample del body: conferma il contratto API per gli schemi Zod (FASE 1)
  const raw = await get.text();
  try {
    console.log(`  body sample: ${JSON.stringify(JSON.parse(raw)).slice(0, 400)}...`);
  } catch {
    console.log(`  body NON-JSON: ${raw.slice(0, 200)}`);
  }

  // 2) OPTIONS preflight — informativo (non necessario per GET semplici)
  const opt = await fetch(url, {
    method: "OPTIONS",
    headers: {
      Origin: ORIGIN,
      "Access-Control-Request-Method": "GET",
    },
  });
  console.log(`  OPTIONS preflight -> HTTP ${opt.status}`);
  printHeaders(opt);
}

console.log(
  `\nVERDETTO: ${
    allCorsOk
      ? "CORS abilitato su entrambi gli endpoint -> fetch diretto dal client, NIENTE proxy."
      : "CORS assente/incompleto -> serve Route Handler proxy in app/api."
  }`
);
