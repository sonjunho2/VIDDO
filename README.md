# VIDDO Site

VIDDO is an AI video automation SaaS landing page built with Next.js and Tailwind CSS.

## 1. Install

```bash
npm install
```

## 2. Run locally

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## 3. Build test

```bash
npm run build
```

## 4. Upload to GitHub

1. Create a new GitHub repository named `viddo-site`.
2. Upload all files in this folder.
3. Or use Git commands:

```bash
git init
git add .
git commit -m "Initial VIDDO landing page"
git branch -M main
git remote add origin https://github.com/YOUR_ID/viddo-site.git
git push -u origin main
```

## 5. Project structure

```text
app/page.tsx              Main landing page
app/layout.tsx            Site metadata and layout
app/globals.css           Global Tailwind CSS
components/ui/button.tsx  Reusable button component
components/ui/card.tsx    Reusable card component
lib/utils.ts              CSS utility helper
```

## Next edit plan

Next step: add the Create Video page.

Suggested path:

```text
app/create/page.tsx
```
