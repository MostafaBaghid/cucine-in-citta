---
description: Esegue lint + test + build; se tutto è verde committa (messaggio conventional da $ARGUMENTS) e pusha sul branch corrente
argument-hint: <messaggio di commit conventional, es. "feat: search bar con debounce">
---

Esegui in sequenza questi comandi, fermandoti al PRIMO che fallisce (exit code diverso da 0):

1. `pnpm lint`
2. `pnpm test`
3. `pnpm build`

Se TUTTI e tre passano:

4. `git add -A`
5. `git commit -m "$ARGUMENTS"` — il messaggio di commit è esattamente: $ARGUMENTS
6. `git push` sul branch corrente (usa `-u origin <branch>` se il branch non ha ancora upstream)

Se anche solo un comando fallisce: NON committare, NON pushare. Mostra l'output dell'errore rilevante e fermati lì, senza tentare fix automatici non richiesti.
