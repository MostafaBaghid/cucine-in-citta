import {
  autocompleteResponseSchema,
  cuisinesResponseSchema,
  type CuisinesResponse,
  type Place,
} from "./schemas";

// Chiamate dirette dal browser: CORS verificato (ACAO: *) sia da Node che da
// browser reale — vedi scripts/check-cors.mjs. Niente Route Handler proxy.
const BASE_URL = "https://api.bestiebite.com";

/**
 * Both fetchers take the AbortSignal handed to the queryFn by TanStack Query,
 * so a stale request is aborted as soon as its queryKey changes. Every
 * response goes through `schema.parse()` — a payload that drifts from the
 * contract surfaces as a query error, never as a malformed render.
 */

export async function fetchCitySuggestions(
  term: string,
  signal?: AbortSignal
): Promise<Place[]> {
  const params = new URLSearchParams({ term, lang: "it", limit: "8" });
  const res = await fetch(`${BASE_URL}/places/v2/autocomplete?${params}`, {
    signal,
  });
  if (!res.ok) {
    throw new Error(`Autocomplete request failed with HTTP ${res.status}`);
  }
  return autocompleteResponseSchema.parse(await res.json());
}

export async function fetchCuisines(
  lat: number,
  lng: number,
  signal?: AbortSignal
): Promise<CuisinesResponse> {
  const params = new URLSearchParams({
    lat: String(lat),
    lng: String(lng),
    type: "cuisine",
  });
  const res = await fetch(
    `${BASE_URL}/places/labels/by-location-and-type?${params}`,
    { signal }
  );
  if (!res.ok) {
    throw new Error(`Cuisines request failed with HTTP ${res.status}`);
  }
  return cuisinesResponseSchema.parse(await res.json());
}
