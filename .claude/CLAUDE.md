# CLAUDE.md — Cucine in città

Micro-app Next.js standalone, single-page, che esplora le cucine di una città via API pubbliche BestieBite. Take-home: budget 2-3h, niente over-engineering. Ogni decisione architetturale va argomentata nel Loom — non scegliere in silenzio.

## Stack obbligatorio (non negoziabile)

- **Next.js 15 + App Router**, **TypeScript strict** (`strict: true`, niente eccezioni)
- **TanStack Query v5** per il data fetching (debounce + cancellazione richiesta obsoleta)
- **Zod** per validare a runtime OGNI risposta API. **Vietato `as Type` cieco.** Si parsa con `schema.parse()` / `safeParse()` e si lavora sul tipo inferito (`z.infer`).
- **Tailwind CSS** + almeno 2 componenti **shadcn/ui** (minimo `Input` e `Card`)
- **Almeno 1 test** su logica pura: schema Zod, hook, o util. Niente E2E.
- `pnpm build` deve passare **pulito**: zero errori TypeScript, zero errori ESLint.

## Decisione architetturale (da argomentare nel Loom)

Questa app è intrinsecamente interattiva (autocomplete live + fetch on-click), quindi è client-heavy. Posizione di partenza consigliata:
- **Server Component** per lo shell statico (layout, header, titolo/sottotitolo).
- **Client Component** per tutta l'interazione (search bar, suggerimenti, grid cucine) — è qui che vive TanStack Query.
- **Server Action**: cattivo fit per letture/autocomplete. Non usarle solo per "metterci" una server action.

**PRIMA COSA DA VERIFICARE — CORS.** Le API vanno chiamate dal browser. Se `api.bestiebite.com` NON manda gli header CORS, il fetch client-side fallisce e serve **obbligatoriamente** una Route Handler (`app/api/.../route.ts`) come proxy. Verifica con una vera chiamata dal browser all'inizio: questo decide l'architettura e va spiegato nel Loom. Non assumere — testa.

## Contratto API (esatto)

### 1) Autocomplete città (durante digitazione, debounced)
```
GET https://api.bestiebite.com/places/v2/autocomplete?term={t}&lang=it&limit=8
```
- Campi rilevanti per la UI: `id`, `name`, `latitude`, `longitude`, `country_code`, `structured_formatting.main_text`, `structured_formatting.secondary_text`.
- `term` di 0-1 caratteri → l'API ritorna `[]` con **HTTP 200** (non è un errore). Attiva la ricerca solo da **≥2 caratteri**; sotto soglia tratta come idle/no-results, non come errore.
- I nomi possono contenere unicode UTF-8 (es. `Milanówek`). Non sanitizzare via.

### 2) Cucine per location (dopo click su suggerimento)
```
GET https://api.bestiebite.com/places/labels/by-location-and-type?lat={lat}&lng={lng}&type=cuisine
```
- Risposta: `{ length: number, data: Cuisine[] }`.
- `Cuisine`: `id`, `name`, `name_it`, `name_eng`, `color` (hex), `image_emoji` (URL PNG pubblica), `type`, `eng_label`.
- `image_emoji` è hostata su `firebasestorage.googleapis.com` → usa `next/image` con `remotePatterns` configurato per quel dominio in `next.config`. Senza la config l'immagine non carica.
- Lo stato "empty cuisines" è raro (l'API tende a tornare fallback), ma va gestito comunque.

## Stati UI da gestire (checklist — tutti e 8)

1. **Idle** — campo vuoto, niente in pagina (mappa Italia + hint).
2. **Searching** — l'utente digita; spinner/skeleton.
3. **Suggestions** — lista risultati autocomplete (debounce ≥250ms).
4. **No results** — nessuna città per il termine.
5. **Loading cuisines** — dopo click, prima dell'arrivo dei dati.
6. **Cuisines shown** — grid di card.
7. **Empty cuisines** — città senza cucine censite.
8. **Error + retry** — bottone retry su **entrambe** le chiamate.

## Design (rispetta l'intent del mockup, non pixel-perfect)

Dark theme. Search bar in cima centrata; nella vista cucine: back link + titolo città + sottotitolo (regione/paese) + contatore "N cucine disponibili" + grid 4 colonne di card.

Palette:
- Background `#0a0a0a` · Foreground `#ffffff` · Primary/accent `#ff5c5c`
- Surface `#0e0e0e` · Border `#252525` · Light gray `#3e4142` · Muted text `#a7a7a7`

Tipografia: sans-serif moderna, gerarchia titolo / sottotitolo / corpo / label piccola. Radius morbidi (`rounded-xl`/`rounded-2xl`), padding generoso. Definisci i colori come CSS variables / token Tailwind, non hardcodati ovunque.

## Anti-pattern da NON fare (errori già visti, evitali a monte)

- **React Error #31 (objects as children).** Le risposte contengono oggetti annidati (`structured_formatting`, `Cuisine`). Renderizza sempre campi stringa, mai l'oggetto. Es: `{place.structured_formatting.main_text}`, mai `{place.structured_formatting}`.
- **Niente mutazioni di array** (`.splice()`, push su state) — usa copie immutabili.
- **Niente parametri persi tra chiamate** — la queryKey deve contenere tutti gli input (term / lat / lng).
- **Strict Mode double-call**: gestito da TanStack Query, non aggirarlo con flag manuali o ref.

## Cancellazione & debounce (il dettaglio che conta)

- Debounce dell'input ≥250ms prima di far partire la query.
- La `queryFn` riceve `signal` da TanStack Query → passalo a `fetch(url, { signal })` così le richieste obsolete vengono abortite quando il term cambia.
- `enabled: term.length >= 2` per non sparare chiamate inutili.

## Fuori scope (NON farlo)

Login, persistenza, multi-route, mappa interattiva, i18n, backend custom (la Route Handler proxy è ammessa solo se serve per CORS), test E2E, animazioni complesse, CI/CD, CMS/DB.

## Comandi

```bash
pnpm dev          # sviluppo
pnpm build        # DEVE passare pulito prima di consegnare
pnpm test         # almeno 1 test su logica pura
```

## Deliverable

URL pubblico live (Vercel/Cloud Run/Fly). Build pulita. Loom con: decisione RSC/Client/Server Action argomentata, esito verifica CORS, come gestisci debounce/cancellazione/validazione Zod. Se sfori le 2-3h, dichiaralo.
