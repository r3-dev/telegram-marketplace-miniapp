# R3 MVP stack

This is a fullstack template for blazingly fast MVP development. It is focused on Developer and DevOps experience.

## Tech Stack

**Client:** Astro, Typescript, TailwindCSS

**Server:** Golang, Pocketbase

**Database:** SQLite in WAL mode (Pocketbase implemented)

## Installation

Install dependencies with pnpm

```bash
pnpm install --frozen-lockfile
```

## Run webhook proxy server

```sh
pnpm ngrok
```

## Run Locally

Run backend, frontend and reverse proxy with one command.

```bash
pnpm dev
```

We use reverse proxy only in dev mode to exclude cors errors on the client.
Backend port: 8090
Frontend port: 4321
Reverse proxy port: 3000

## Telegram settings

Use telegram test server for the developing purpose:
- @intgmarketbot for customers
- @intgstorebot for sellers