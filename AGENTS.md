# SS Dental Clinic AI Operating Rules

## Project Overview
SS Dental Clinic appointment and patient records platform:
- API: Node.js, Express, PostgREST / Supabase with network retry circuit.
- Web: React / Next.js appointment booking wizard.

## Development Rules
1. Never commit `.env` or service role keys.
2. Preserve `withDbRetry` resilient database wrapper on all PostgREST queries.
3. Verify tests via `node apps/api/test/*.test.js` before deploying.
