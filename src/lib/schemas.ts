import { z } from "zod";

/**
 * Zod schemas for the BestieBite public API.
 *
 * Only the fields the UI consumes are declared; Zod strips unknown keys by
 * default, so extra fields in the responses (slug, path, geometry, name_es,
 * ...) are tolerated without breaking the parse. All declared fields are
 * required: probed against the live API (scripts/check-cors.mjs era) they are
 * always present and correctly typed, including unicode names and
 * state-level results.
 *
 * These inferred types are the ONLY source of truth — no hand-written
 * interfaces, no blind `as` casts anywhere.
 */

export const placeSchema = z.object({
  id: z.number(),
  name: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  country_code: z.string(),
  structured_formatting: z.object({
    main_text: z.string(),
    secondary_text: z.string(),
  }),
});

/** `term` of 0-1 chars returns `[]` with HTTP 200 — an empty array is valid. */
export const autocompleteResponseSchema = z.array(placeSchema);

export const cuisineSchema = z.object({
  id: z.number(),
  name: z.string(),
  name_it: z.string(),
  name_eng: z.string(),
  color: z.string(),
  image_emoji: z.url(),
  type: z.string(),
  eng_label: z.string(),
});

/** Empty state is real: remote coordinates return `{ length: 0, data: [] }`. */
export const cuisinesResponseSchema = z.object({
  length: z.number(),
  data: z.array(cuisineSchema),
});

export type Place = z.infer<typeof placeSchema>;
export type Cuisine = z.infer<typeof cuisineSchema>;
export type CuisinesResponse = z.infer<typeof cuisinesResponseSchema>;
