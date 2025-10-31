# Travila 2.0

Monorepo **pnpm** con:
- **apps/server** – Fastify + TypeScript (OpenAI, MongoDB)
- **apps/travila** – Expo (Web/iOS/Android) + expo-router

## Requisiti
- Node.js 20+
- pnpm 10+
- MongoDB in locale o Atlas
- OpenAI API key

## Setup rapido

```bash
pnpm i
# copia gli env di esempio
copy .env.example .env                 # Windows (root)
copy apps\server\.env.example apps\server\.env
# mac/linux: cp .env.example .env && cp apps/server/.env.example apps/server/.env
