Una micro-app Next.js standalone — “Cucine in città” — con una sola pagina che esplora le cucine disponibili in una città usando le API pubbliche di BestieBite.

Flow utente

L’utente vede una barra di ricerca
Digita il nome di una città → suggerimenti in tempo reale (autocomplete)
Clicca un suggerimento → la pagina mostra le cucine di quella città come grid di card con immagine + nome
Può tornare indietro alla ricerca per cambiare città
API da usare

Tutte pubbliche, no auth, no API key.

1) Autocomplete città — durante la digitazione (debounced):

bash GET https://api.bestiebite.com/places/v2/autocomplete?term=mila&lang=it&limit=8

Risposta di esempio (campi più rilevanti per la UI):

json [ { "id": 8047, "name": "Milano", "description": "Milano, Lombardia, Italia", "latitude": 45.4612939, "longitude": 9.172356290785304, "country_code": "IT", "structured_formatting": { "main_text": "Milano", "secondary_text": "Lombardia, Italia" } } ]

Note pratiche: - Con term di 0 o 1 caratteri, l’API ritorna [] con HTTP 200 (non errore). Gestiscilo come no-results se attivi la ricerca solo da 2+ char. - I caratteri unicode nel nome (es. Milanówek) sono UTF-8.

2) Cucine in una location — dopo click su un suggerimento:

bash GET https://api.bestiebite.com/places/labels/by-location-and-type?lat=45.46&lng=9.17&type=cuisine

Risposta di esempio:

json { "length": 34, "data": [ { "id": 52, "name": "Cinese", "name_it": "Cinese", "name_eng": "Chinese", "color": "#5B50A1", "image_emoji": "https://firebasestorage.googleapis.com/.../cucina_cinese.png?...", "type": "cuisine", "eng_label": "chinese" } ] }

Note pratiche: - image_emoji è una URL pubblica di una PNG. Usa next/image con remotePatterns configurato per firebasestorage.googleapis.com. - L’API tende a ritornare almeno alcune cucine fallback anche per coordinate strane. Lo stato “empty cuisines” è raro in pratica.

Stati che la UI deve gestire

Idle — campo vuoto, niente in pagina
Searching — l’utente sta digitando; spinner o skeleton
Suggestions — lista risultati autocomplete (debounce ≥250ms consigliato)
No results — nessuna città trovata per il termine
Loading cuisines — dopo click, prima che arrivino le cucine
Cuisines shown — grid con le cucine
Empty cuisines — la città non ha cucine censite
Error — con bottone retry (su entrambe le chiamate)
Requisiti tecnici minimi

Next.js 15 con App Router + TypeScript (strict)
TanStack Query per data fetching (debounce + cancellazione richiesta obsoleta)
Zod per validare le risposte API a runtime (no as Type ciechi)
Tailwind CSS + almeno 2 componenti shadcn/ui (es. Input, Card)
Decisione consapevole tra Server Component / Client Component / Server Action — argomenta nel Loom
Almeno 1 test su una parte pura: schema Zod, hook, util
Deploy live funzionante: Vercel, Cloud Run, Fly. Mandami l’URL pubblico.
Build pulita: pnpm build deve passare senza errori TypeScript/ESLint
Mockup di riferimento

Trovi in allegato 3 mockup (idle / suggerimenti / griglia cucine). Aderisci il più possibile a: - Layout dei tre stati - Gerarchia visiva (search bar in cima, lista o griglia sotto, header con titolo + sottotitolo nella vista cucine) - Palette brand (dark theme): - Background: #0a0a0a - Foreground: #ffffff - Primary/accent: #ff5c5c - Dark gray (surface): #0e0e0e · Medium gray (border): #252525 · Light gray: #3e4142 · Muted text: #a7a7a7 - Tipografia (sans-serif moderna, gerarchia tra titolo / sottotitolo / corpo / label piccola) - Spaziatura e radius (rounded morbidi tipo rounded-xl/rounded-2xl, padding generoso)

Non aderenza pixel-perfect: leggi il mockup e rispettane l’intent.

Cosa NON richiediamo

Login, persistenza, navigazione multi-route (single page va benissimo)
Mappa (lat/lng possono restare nei dati senza visualizzazione)
Internazionalizzazione (it va bene)
Backend custom (usa le API pubbliche dal client o da una Route Handler — scegli tu)
Test E2E o coverage estesi
Animazioni complesse
CI/CD setup
Setup di CMS o database