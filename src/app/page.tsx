import { CityExplorer } from "@/components/city-explorer";
import { SiteHeader } from "@/components/site-header";

// Server Component: renders the static shell only. All interactivity (search,
// suggestions, cuisine grid) is delegated to the <CityExplorer> client island —
// reads/autocomplete are a bad fit for Server Actions, and the data is
// per-keystroke dynamic, so client-side TanStack Query owns the fetching.
export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <CityExplorer />
      </main>
    </>
  );
}
