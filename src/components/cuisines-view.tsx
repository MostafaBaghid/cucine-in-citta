"use client";

import { ArrowLeft } from "lucide-react";
import Image from "next/image";

import { Card } from "@/components/ui/card";
import { useCuisines } from "@/hooks/use-cuisines";
import type { Cuisine, Place } from "@/lib/schemas";

type CuisinesViewProps = {
  place: Place;
  onBack: () => void;
};

/**
 * Post-selection view: back link, city heading, "N cucine disponibili"
 * counter and the 4-column cuisine grid. Covers the loading / shown / empty /
 * error states of the UI checklist.
 */
export function CuisinesView({ place, onBack }: CuisinesViewProps) {
  const { data, isPending, isError, isFetching, refetch } = useCuisines({
    lat: place.latitude,
    lng: place.longitude,
  });

  const cuisines = data?.data ?? [];

  return (
    <section className="mx-auto w-full max-w-5xl px-6 pt-10 pb-24">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm font-medium text-primary transition-opacity hover:opacity-80"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Cucine in città
      </button>

      <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
        {place.structured_formatting.main_text}
      </h1>
      <p className="mt-2 text-base text-muted-foreground sm:text-lg">
        {place.structured_formatting.secondary_text}
      </p>

      {isPending ? (
        <CuisinesSkeleton />
      ) : isError ? (
        <div className="mt-10 flex flex-col items-start gap-4 rounded-xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">
            Non siamo riusciti a caricare le cucine di{" "}
            {place.structured_formatting.main_text}.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {isFetching ? "Riprovo…" : "Riprova"}
          </button>
        </div>
      ) : cuisines.length === 0 ? (
        <p className="mt-10 max-w-md text-sm text-muted-foreground">
          Nessuna cucina censita per questa città, per ora. Torna indietro e
          prova con un&apos;altra destinazione.
        </p>
      ) : (
        <>
          <p className="mt-5 text-xs font-medium tracking-widest text-primary uppercase">
            {cuisines.length === 1
              ? "1 cucina disponibile"
              : `${cuisines.length} cucine disponibili`}
          </p>
          <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {cuisines.map((cuisine) => (
              <li key={cuisine.id}>
                <CuisineCard cuisine={cuisine} />
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

function CuisineCard({ cuisine }: { cuisine: Cuisine }) {
  return (
    <Card className="h-full items-center justify-center gap-3 rounded-xl px-4 py-7 ring-border transition-colors hover:ring-primary">
      <Image
        src={cuisine.image_emoji}
        // Decorative: the cuisine name is right below as text.
        alt=""
        width={48}
        height={48}
        className="size-12"
      />
      <span className="text-center text-sm font-medium">{cuisine.name}</span>
    </Card>
  );
}

function CuisinesSkeleton() {
  return (
    <div className="mt-10" aria-hidden="true">
      <div className="h-4 w-44 animate-pulse rounded-md bg-card" />
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <div
            key={index}
            className="h-28 animate-pulse rounded-xl bg-card ring-1 ring-border"
          />
        ))}
      </div>
    </div>
  );
}
