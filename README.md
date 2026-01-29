# Pastebin Lite

A small Pastebin-like application built with Next.js and MongoDB.

## Features
- Create text pastes
- Optional expiry (TTL)
- Optional view limits
- Shareable URLs

## Tech Stack
- Next.js (App Router)
- Node.js
- MongoDB Atlas
- React

## Persistence Layer
MongoDB Atlas is used to ensure data persists across serverless requests and supports atomic updates.

## Run Locally
```bash
npm install
npm run dev
