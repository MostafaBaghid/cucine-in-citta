import { describe, expect, it } from "vitest";

import {
  autocompleteResponseSchema,
  cuisinesResponseSchema,
} from "./schemas";

// Fixtures mirror real API payloads (captured live via scripts/check-cors.mjs),
// including extra fields the UI does not consume.
const milanowek = {
  id: 23906,
  slug: "milanowek",
  path: "pl/masovia/milanowek",
  name: "Milanówek",
  description: "Milanówek, Masovia, Polonia",
  level: 5,
  country_code: "PL",
  latitude: 52.1232913,
  longitude: 20.66415,
  structured_formatting: {
    main_text: "Milanówek",
    secondary_text: "Masovia, Polonia",
  },
};

const chinese = {
  id: 52,
  name: "Cinese",
  name_it: "Cinese",
  name_eng: "Chinese",
  name_es: "China",
  color: "#5B50A1",
  image_emoji:
    "https://storage.googleapis.com/bestie-bite.appspot.com/categories/emoji/twemoji_1f962.png",
  type: "cuisine",
  eng_label: "chinese",
};

describe("autocompleteResponseSchema", () => {
  it("parses a real payload, preserving unicode and stripping extra fields", () => {
    const result = autocompleteResponseSchema.parse([milanowek]);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Milanówek");
    expect(result[0].structured_formatting.secondary_text).toBe(
      "Masovia, Polonia"
    );
    expect(result[0]).not.toHaveProperty("slug");
  });

  it("accepts the empty array the API returns for terms of 0-1 chars", () => {
    expect(autocompleteResponseSchema.parse([])).toEqual([]);
  });

  it("rejects items with missing or mistyped fields", () => {
    const noMainText = {
      ...milanowek,
      structured_formatting: { secondary_text: "Masovia, Polonia" },
    };
    const stringLatitude = { ...milanowek, latitude: "52.12" };

    expect(autocompleteResponseSchema.safeParse([noMainText]).success).toBe(
      false
    );
    expect(
      autocompleteResponseSchema.safeParse([stringLatitude]).success
    ).toBe(false);
    expect(autocompleteResponseSchema.safeParse({ data: [] }).success).toBe(
      false
    );
  });
});

describe("cuisinesResponseSchema", () => {
  it("parses a real payload and strips extra fields", () => {
    const result = cuisinesResponseSchema.parse({
      length: 1,
      data: [chinese],
    });

    expect(result.length).toBe(1);
    expect(result.data[0].name_it).toBe("Cinese");
    expect(result.data[0]).not.toHaveProperty("name_es");
  });

  it("accepts the empty state returned for remote coordinates", () => {
    const result = cuisinesResponseSchema.parse({ length: 0, data: [] });

    expect(result.data).toEqual([]);
  });

  it("rejects payloads with a malformed image_emoji or missing data", () => {
    const badUrl = { ...chinese, image_emoji: "not-a-url" };

    expect(
      cuisinesResponseSchema.safeParse({ length: 1, data: [badUrl] }).success
    ).toBe(false);
    expect(cuisinesResponseSchema.safeParse({ length: 1 }).success).toBe(
      false
    );
    expect(cuisinesResponseSchema.safeParse([chinese]).success).toBe(false);
  });
});
