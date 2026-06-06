"use client";

import { useState } from "react";

import { CitySearch } from "@/components/city-search";
import { ItalyMap } from "@/components/italy-map";

/**
 * Client island: every interactive piece (search input, suggestions, cuisine
 * grid) lives below this component, while page shell and header stay server
 * components. TanStack Query hooks plug in here.
 */
export function CityExplorer() {
  const [term, setTerm] = useState("");

  return (
    <section className="flex w-full flex-col items-center px-6 pt-14 pb-24 sm:pt-20">
      <h1 className="text-center text-4xl font-bold tracking-tight sm:text-5xl">
        Cucine in città
      </h1>
      <p className="mt-3 text-center text-base text-muted-foreground sm:text-lg">
        Scopri cosa si mangia ovunque nel mondo, in pochi click
      </p>

      <div className="mt-10 w-full max-w-md">
        <CitySearch
          term={term}
          onTermChange={setTerm}
          onSelect={(place) => {
            // FASE 5: qui si passa alla vista cucine con place.latitude/longitude.
            setTerm(place.name);
          }}
        />
      </div>

      {/* Stato idle: mappa Italia + hint (restano visibili anche durante la ricerca, come nel mockup) */}
      <ItalyMap className="mt-16 w-44 text-secondary sm:w-52" />
      <p className="mt-12 text-center text-sm text-muted-foreground">
        inizia a cercare una città per scoprire le cucine disponibili
      </p>
    </section>
  );
}
