# ADK Washing App

A full-stack community web app for the Allee der Kosmonauten student
dormitory, built end-to-end (frontend, backend, infrastructure) as a side
project to pitch a live washing-machine booking system to dorm leadership.

## Live demo

[https://3-66-105-218.sslip.io](https://3-66-105-218.sslip.io)

Running on a temporary `sslip.io` address for pre-approval testing; a real
domain will replace it before later.

## Overview

The site's primary goal is to inform residents and visitors about the
dormitory (about, contacts, photo gallery); its centerpiece feature is a
real-time laundry-room booking system that replaces manual/paper-based
machine tracking. It's built as an installable, offline-capable Progressive
Web App, served bilingually (English/German), and designed to run on
minimal, low-cost infrastructure appropriate for a pre-approval MVP.

## What it does

- **Live washer/dryer status** — 5 washers and 3 dryers, each showing
  "available" or a live countdown, auto-refreshed across every viewer via
  polling.
- **QR-code check-in** — scanning a machine's QR code opens a timer dialog;
  starting a cycle records who started it and for how long.
- **Offline-first booking** — a booking made with no connectivity is queued
  in IndexedDB and synced automatically once back online (Background Sync
  API on Chromium, with a foreground-retry fallback on iOS Safari, which
  has no Background Sync support).
- **Push notifications** — subscribes per-booking to a "your load is done"
  alert, delivered via the Web Push API.
- **Installable PWA** — a manifest and a hand-written service worker
  (stale-while-revalidate for API data, cache-first for static assets),
  with an install nudge specifically for iOS, where push delivery requires
  an installed app.
- **Bilingual (EN/DE)** — locale-prefixed routing (`/en/...`, `/de/...`)
  backed by a lightweight, dependency-free i18n layer.
- **No SEO/indexing** — intentionally excluded from search engines
  (`robots.txt`, `noindex` meta) while the project awaits official
  dormitory approval.

## Tech stack

**Frontend** — Next.js (App Router) on React 19 + TypeScript, statically
exported (`output: "export"`) and served without a Node runtime; CSS
Modules for styling; `react-modal`, `react-countdown`,
`@yudiel/react-qr-scanner`.

**PWA layer** — a custom service worker (no Workbox), Web Push +
VAPID, IndexedDB for the offline write queue, and the Background Sync API
with a manual foreground-sync fallback for browsers that lack it.

**Backend** — Node.js + Express + TypeScript, a REST API, and a polling
job that matches finished laundry cycles to pending push subscriptions.

**Database** — PostgreSQL via Prisma ORM, with migrations and a seed
script for demo data.

**Tooling** — ESLint, TypeScript, Jest.

**Infrastructure** — Docker Compose (frontend, backend, Postgres, Caddy),
Caddy for automatic HTTPS via Let's Encrypt, a single AWS Lightsail
instance, and GitHub Actions CI/CD publishing to GitHub Container Registry.
