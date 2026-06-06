import { afterEach, describe, expect, it, vi } from "vitest";

import { fetchCitySuggestions, fetchCuisines } from "./api";

const place = {
  id: 8047,
  name: "Milano",
  latitude: 45.4612939,
  longitude: 9.172356,
  country_code: "IT",
  structured_formatting: {
    main_text: "Milano",
    secondary_text: "Lombardia, Italia",
  },
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status });
}

function mockFetch(response: Response) {
  const spy = vi.fn().mockResolvedValue(response);
  vi.stubGlobal("fetch", spy);
  return spy;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("fetchCitySuggestions", () => {
  it("encodes term/lang/limit in the URL and forwards the abort signal", async () => {
    const spy = mockFetch(jsonResponse([place]));
    const controller = new AbortController();

    const result = await fetchCitySuggestions("new york", controller.signal);

    const [url, init] = spy.mock.calls[0];
    expect(url).toBe(
      "https://api.bestiebite.com/places/v2/autocomplete?term=new+york&lang=it&limit=8"
    );
    expect(init).toEqual({ signal: controller.signal });
    expect(result[0].name).toBe("Milano");
  });

  it("throws on a non-2xx response", async () => {
    mockFetch(jsonResponse([], 500));

    await expect(fetchCitySuggestions("mila")).rejects.toThrow("HTTP 500");
  });

  it("rejects a payload that violates the schema", async () => {
    mockFetch(jsonResponse([{ ...place, latitude: "45.46" }]));

    await expect(fetchCitySuggestions("mila")).rejects.toThrow();
  });
});

describe("fetchCuisines", () => {
  it("encodes lat/lng/type in the URL and returns the parsed envelope", async () => {
    const spy = mockFetch(jsonResponse({ length: 0, data: [] }));

    const result = await fetchCuisines(45.46, 9.17);

    const [url] = spy.mock.calls[0];
    expect(url).toBe(
      "https://api.bestiebite.com/places/labels/by-location-and-type?lat=45.46&lng=9.17&type=cuisine"
    );
    expect(result).toEqual({ length: 0, data: [] });
  });

  it("throws on a non-2xx response", async () => {
    mockFetch(jsonResponse({ length: 0, data: [] }, 502));

    await expect(fetchCuisines(45.46, 9.17)).rejects.toThrow("HTTP 502");
  });

  it("rejects a payload that violates the schema", async () => {
    mockFetch(jsonResponse({ data: [] }));

    await expect(fetchCuisines(45.46, 9.17)).rejects.toThrow();
  });
});
