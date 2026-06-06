"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchCuisines } from "@/lib/api";

/**
 * Cuisines for the selected place. `location` is null until the user picks a
 * suggestion; both coordinates live in the queryKey, so switching city always
 * fetches (or reads from cache) the right data and aborts the stale request.
 */
export function useCuisines(location: { lat: number; lng: number } | null) {
  return useQuery({
    queryKey: ["cuisines", location?.lat, location?.lng],
    queryFn: ({ signal }) => {
      // Unreachable when disabled below — narrows `location` without casts.
      if (!location) {
        throw new Error("useCuisines: queryFn ran without a location");
      }
      return fetchCuisines(location.lat, location.lng, signal);
    },
    enabled: location !== null,
  });
}
