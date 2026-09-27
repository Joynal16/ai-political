# AI Political Poster Maker

A full-stack MVP for generating print-ready Bangla poster layouts from curated templates, user form data, uploaded photos, and Gemini-assisted layout/decorative suggestions.

## Stack

- Frontend: Next.js + TypeScript
- Backend: Express + TypeScript
- Database: MongoDB + Mongoose
- AI: Google Gemini (`@google/genai`) for layout/decorative suggestions
- Rendering: Puppeteer → PNG/PDF
- Storage: Cloudinary or local development storage
- Auth: JWT

## MVP flow

1. Register/login.
2. Choose a seeded poster template.
3. Enter name, designation, party/organization, district, occasion and Bangla headline.
4. Upload 1–3 photos.
5. Ask Gemini for layout/decorative guidance.
6. Server renders the exact Bangla text using HTML/CSS + Puppeteer.
7. Preview, regenerate, download PNG/PDF and revisit poster history.

## Project structure

```text
ai-political-poster-maker/
├── frontend/       # Next.js app
├── backend/        # Express API
├── docker-compose.yml
└── README.md
```

## Local setup

### 1. MongoDB

```bash
docker compose up -d mongo
```

### 2. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run seed
npm run dev
```

### 3. Frontend

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment variables

See `backend/.env.example` and `frontend/.env.local.example`.

Gemini is optional for local UI testing. If `GEMINI_API_KEY` is missing, the backend uses a deterministic layout fallback.

Cloudinary is also optional for development. Without it, uploads are saved to `backend/uploads` and served by Express.

## Seeded templates

The seed script creates three editable MVP templates:

- Victory Day
- Tribute / Condolence
- Campaign / Publicity

The templates use neutral visual primitives (national-color accents, decorative borders, photo slots and typography) rather than embedding generated political messaging.

## Security notes

- JWT-protected poster/history routes.
- Admin-only template moderation endpoints.
- Basic rate limiting on generation.
- Text moderation hook before rendering.
- Never expose the Gemini API key in the browser.
- Uploaded assets should be validated and scanned before production deployment.

## Production deployment

Deploy the frontend to Vercel, backend to a Node-compatible service, MongoDB to MongoDB Atlas, and configure Cloudinary. For production, replace local upload storage with Cloudinary and use HTTPS-only cookies or a hardened token strategy.
