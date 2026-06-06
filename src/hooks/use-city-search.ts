"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchCitySuggestions } from "@/lib/api";
import { useDebouncedValue } from "./use-debounced-value";

export const SEARCH_DEBOUNCE_MS = 300;
export const MIN_SEARCH_LENGTH = 2;

/**
 * Live city autocomplete. The raw input is trimmed and debounced; the query
 * only runs from MIN_SEARCH_LENGTH chars (the API answers `[]` with HTTP 200
 * below that — idle, not an error). The debounced term sits in the queryKey,
 * so each keystroke that survives the debounce aborts the previous in-flight
 * request via the queryFn's AbortSignal.
 */
export function useCitySearch(
  term: string,
  { enabled: isActive = true }: { enabled?: boolean } = {}
) {
  const normalizedTerm = term.trim();
  const debouncedTerm = useDebouncedValue(normalizedTerm, SEARCH_DEBOUNCE_MS);

  // Both terms must pass the threshold: `normalizedTerm` stops the query the
  // instant the user clears the input, without waiting out the debounce.
  // `isActive` lets the combobox suspend fetching while closed (e.g. right
  // after a selection fills the input) instead of firing a call nobody sees.
  const enabled =
    isActive &&
    normalizedTerm.length >= MIN_SEARCH_LENGTH &&
    debouncedTerm.length >= MIN_SEARCH_LENGTH;

  const query = useQuery({
    queryKey: ["city-autocomplete", debouncedTerm],
    queryFn: ({ signal }) => fetchCitySuggestions(debouncedTerm, signal),
    enabled,
  });

  return {
    ...query,
    /** True while the latest keystrokes are still inside the debounce window. */
    isDebouncing: normalizedTerm !== debouncedTerm,
  };
}
