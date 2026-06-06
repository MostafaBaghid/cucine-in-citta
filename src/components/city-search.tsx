"use client";

import { ChevronRight, LoaderCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { SearchBar } from "@/components/search-bar";
import { MIN_SEARCH_LENGTH, useCitySearch } from "@/hooks/use-city-search";
import type { Place } from "@/lib/schemas";

type CitySearchProps = {
  term: string;
  onTermChange: (term: string) => void;
  onSelect: (place: Place) => void;
};

/**
 * Search combobox: input + suggestion dropdown. Panel states follow the UI
 * checklist — idle (term under threshold, no panel), searching (debounce
 * window or request in flight), suggestions, no results, error.
 */
export function CitySearch({ term, onTermChange, onSelect }: CitySearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data, isError, isDebouncing, isFetching, refetch } = useCitySearch(
    term,
    { enabled: isOpen }
  );
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const suggestions = data ?? [];
  const hasMinLength = term.trim().length >= MIN_SEARCH_LENGTH;

  // Derive the panel state from the term first (not from cached `data`, which
  // can outlive a cleared input) and gate the spinner on the threshold.
  const panel = !isOpen || !hasMinLength
    ? "closed"
    : isDebouncing || isFetching
      ? "searching"
      : isError
        ? "error"
        : suggestions.length === 0
          ? "no-results"
          : "suggestions";

  // New list -> the keyboard cursor restarts from the top.
  useEffect(() => {
    setActiveIndex(-1);
  }, [data]);

  function selectPlace(place: Place) {
    setIsOpen(false);
    onSelect(place);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setIsOpen(false);
      return;
    }
    if (panel !== "suggestions") return;

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => {
        if (event.key === "ArrowUp") {
          return current <= 0 ? suggestions.length - 1 : current - 1;
        }
        return current >= suggestions.length - 1 ? 0 : current + 1;
      });
    } else if (event.key === "Enter") {
      // Guard against -1 and against a stale index right after `data` changes.
      if (activeIndex < 0) return;
      const place = suggestions.at(activeIndex);
      if (!place) return;
      event.preventDefault();
      selectPlace(place);
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      onFocus={() => setIsOpen(true)}
      onBlur={(event) => {
        // Close only when focus leaves the whole combobox (input + panel).
        if (!containerRef.current?.contains(event.relatedTarget)) {
          setIsOpen(false);
        }
      }}
    >
      <SearchBar
        value={term}
        onValueChange={(value) => {
          onTermChange(value);
          setIsOpen(true);
        }}
        onKeyDown={handleKeyDown}
        role="combobox"
        aria-expanded={panel !== "closed"}
        aria-controls="city-listbox"
        aria-activedescendant={
          activeIndex >= 0 ? `city-option-${activeIndex}` : undefined
        }
      />

      {panel !== "closed" && (
        <div className="absolute top-full right-0 left-0 z-10 mt-2 overflow-hidden rounded-xl border border-border bg-popover shadow-lg">
          {panel === "searching" && (
            <div className="flex items-center gap-3 px-4 py-3.5 text-sm text-muted-foreground">
              <LoaderCircle
                className="size-4 animate-spin text-primary"
                aria-hidden="true"
              />
              Ricerca in corso…
            </div>
          )}

          {panel === "error" && (
            <div className="flex items-center justify-between gap-3 px-4 py-3.5 text-sm">
              <span className="text-muted-foreground">
                Qualcosa è andato storto durante la ricerca.
              </span>
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => refetch()}
                className="shrink-0 font-medium text-primary hover:underline"
              >
                Riprova
              </button>
            </div>
          )}

          {panel === "no-results" && (
            <p className="px-4 py-3.5 text-sm text-muted-foreground">
              Nessuna città trovata per &ldquo;{term.trim()}&rdquo;
            </p>
          )}

          {panel === "suggestions" && (
            <ul id="city-listbox" role="listbox" aria-label="Città suggerite">
              {suggestions.map((place, index) => (
                <li
                  key={place.id}
                  id={`city-option-${index}`}
                  role="option"
                  aria-selected={index === activeIndex}
                >
                  <button
                    type="button"
                    // mousedown fires before the input's blur: without this
                    // the panel would close before the click lands.
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => selectPlace(place)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`group flex w-full items-center justify-between gap-3 border-b border-border px-4 py-3 text-left last:border-b-0 ${
                      index === activeIndex ? "bg-primary/10" : ""
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">
                        {place.structured_formatting.main_text}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {place.structured_formatting.secondary_text}
                      </span>
                    </span>
                    <ChevronRight
                      className={`size-4 shrink-0 text-primary transition-opacity ${
                        index === activeIndex ? "opacity-100" : "opacity-0"
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
