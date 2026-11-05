# SS Dental Care — Production Web Platform

Production repository for **SS Dental Care** (`https://www.ssdentalcare.in/`), Davangere.

## Architecture

- **Web (Frontend):** React + Vite SPA in [`apps/web`](apps/web)
- **API (Backend):** Node.js 22 + Express in [`apps/api`](apps/api)
- **Database:** Supabase PostgreSQL with Row Level Security (RLS) & network retry circuit (`withDbRetry`)
- **Email:** Brevo REST API v3 with transactional templates & durable `notification_outbox` worker
- **Payment:** Razorpay integration (Strict Test Mode)
- **Deployment:** Hostinger Node.js Runtime (Automated GitHub deployments from `main`)
- **Monitoring & Watchdog:** Dual-layer reminder scheduler (15-min in-process timer + 30-min Hostinger cron watchdog hitting `/api/cron/reminders`)

---

## Production Reports & Operational Documentation

The `docs/` directory contains complete audit evidence and operational plans:

1. **[Final Production Acceptance Report](docs/FINAL_PRODUCTION_ACCEPTANCE_REPORT.md)**: Live booking wizard verification, appointment lifecycle (confirm, reschedule, cancel), slot collision safeguards, and Gmail raw header audit (SPF, DKIM, DMARC passing).
2. **[30-Day Production Monitoring Plan](docs/THIRTY_DAY_PRODUCTION_MONITORING_PLAN.md)**: Daily checks, weekly review schedule, DMARC phased enforcement roadmap, outbox queue health, and incident triage playbooks.
3. **[Gmail Email Delivery Audit Report](docs/GMAIL_EMAIL_DELIVERY_AUDIT_REPORT.md)**: Comprehensive inbox placement and cryptographic header verification.
4. **[Production Verification Report](docs/PRODUCTION_VERIFICATION_REPORT.md)**: Verification of backend services, environment isolation, and database reliability.

---

## Verification & Testing

Run the full automated test suite (15 suites, 67 tests):

```bash
node --test apps/api/test/*.test.js
```

---

## Operating Guardrails

1. **Razorpay:** Must remain in **TEST MODE** (`rzp_test_...`) until explicit business authorization, KYC approval, and live low-value test transaction verification.
2. **DentaFlow:** Strictly disabled (`DENTAFLOW_ENABLED=false`).
3. **Data Integrity:** Never commit `.env` or service role secrets. All PostgREST queries must use the `withDbRetry` resilient database wrapper.
