# VIDDO

VIDDO is an AI video automation SaaS starter project.

Current version includes:

- Global SaaS landing page
- Supabase email/password signup
- Supabase login/logout
- Protected dashboard starter screen
- Pricing section
- Tailwind CSS design system

## 1. Install

```bash
npm install
```

## 2. Create Supabase project

1. Go to Supabase
2. Create a new project
3. Open Project Settings
4. Open API
5. Copy these values:
   - Project URL
   - anon public key

## 3. Create environment file

Copy `.env.local.example` and rename it to `.env.local`.

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

## 4. Run locally

```bash
npm run dev
```

Open:

```bash
http://localhost:3000
```

## 5. Pages

- `/` landing page
- `/signup` signup page
- `/login` login page
- `/dashboard` dashboard page

## 6. Upload to GitHub

```bash
git init
git add .
git commit -m "Initial VIDDO Supabase auth version"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/viddo-site.git
git push -u origin main
```

## 7. Next development step

Recommended next step:

Create the `/create-video` page.

This page will include:

- Video idea input
- Style selection
- Length selection
- Voice selection
- Generate button

After that, connect AI script generation.
