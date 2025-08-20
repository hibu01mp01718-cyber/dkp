# DKP Tracker

A modern, responsive DKP (Dragon Kill Points) tracker web app with Discord login, multi-guild support, and admin panel.

## Features
- Discord login (NextAuth.js)
- DKP, event, item, and bid tracking
- Admin panel for managing users, guilds, classes, characters, and events
- Event PIN system for secure DKP claiming
- Responsive, dark-themed UI (Tailwind CSS)
- MongoDB Atlas backend

## Getting Started

1. **Clone the repo:**
   ```
   git clone <your-repo-url>
   cd DKP
   ```
2. **Install dependencies:**
   ```
   npm install
   ```
3. **Configure environment variables:**
   - Copy `.env.example` to `.env.local` and fill in your MongoDB URI, Discord client ID/secret, etc.
4. **Run locally:**
   ```
   npm run dev
   ```
5. **Build for production:**
   ```
   npm run build
   npm start
   ```

## Deployment
- Recommended: [Vercel](https://vercel.com) (import your repo, set env vars)
- Or deploy to your own server

## Project Structure
- `/components` — React UI components
- `/pages` — Next.js pages and API routes
- `/lib` — Database and model helpers
- `/styles` — Tailwind/global CSS

## License
MIT
