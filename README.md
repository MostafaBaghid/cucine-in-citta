# Cucine in città

Web app Next.js — scaffold iniziale, nessuna feature ancora implementata.
I mockup di riferimento sono nella cartella locale `mockup/`.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router, Turbopack) · React 19 · TypeScript
- [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) — tema dark di default con token brand
- [TanStack Query](https://tanstack.com/query) · [Zod](https://zod.dev)
- [Vitest](https://vitest.dev)

## Requisiti

- Node 22 (vedi `.nvmrc`)
- pnpm

## Comandi

```bash
pnpm install   # installa le dipendenze
pnpm dev       # dev server su http://localhost:3000
pnpm build     # build di produzione
pnpm lint      # eslint
pnpm test      # vitest (run singolo)
```

## Note

- Le immagini remote sono consentite solo da `firebasestorage.googleapis.com` (`next.config.ts`).
- I branch di lavoro partono da `develop`; `main` è il branch di rilascio.
