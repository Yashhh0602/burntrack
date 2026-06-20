# ⚡ BurnTrack — Workout Calorie Calculator

A sleek, dark-themed workout calorie calculator built with **Next.js**, **Tailwind CSS**, and the **Anthropic Claude API**. Select an exercise, enter your stats, and get instant calorie estimates with AI-powered coaching tips.

![Dark Theme](https://img.shields.io/badge/theme-dark-0F0F0F?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwindcss)
![Claude AI](https://img.shields.io/badge/Claude_AI-powered-C8FF00?style=flat-square)

---

## What It Does

BurnTrack calculates calories burned during a workout based on the **MET (Metabolic Equivalent of Task)** system. It supports 8 exercises, shows a fun food equivalent for the calories burned, and fetches a personalized coaching tip from Claude AI.

### Features

- **8 exercises** — Running, Cycling, Swimming, HIIT, Yoga, Walking, Weightlifting, Boxing
- **MET-based calorie calculation** with animated count-up reveal
- **Fun food equivalents** — e.g. "That's roughly ~2.3 samosas"
- **AI coaching tips** — short, contextual advice fetched server-side from Claude
- **Fully responsive** dark UI with electric lime (`#C8FF00`) accent
- **Fonts** — Space Grotesk (headers) + Inter (body) via Google Fonts

---

## The MET Formula

Calories are estimated using the standard MET equation:

```
Calories = MET × Weight (kg) × Duration (hours)
```

| Exercise      | MET Value |
|---------------|-----------|
| Running       | 9.8       |
| Cycling       | 7.5       |
| Swimming      | 8.0       |
| HIIT          | 8.0       |
| Yoga          | 3.0       |
| Walking       | 3.5       |
| Weightlifting | 5.0       |
| Boxing        | 9.0       |

**Example:** 30 minutes of Running at 70 kg → `9.8 × 70 × (30/60)` = **343 kcal**

---

## Tech Stack

- **Next.js 16** — App Router with server-side API routes
- **Tailwind CSS v4** — CSS-based theme configuration
- **@anthropic-ai/sdk** — Claude API for AI coaching tips
- **API key stays server-side** — exposed only via `process.env.ANTHROPIC_API_KEY` in the `/api/tip` route

---

## Run Locally

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- npm (comes with Node.js)
- An [Anthropic API key](https://console.anthropic.com/) (optional — the app falls back to built-in tips without one)

### Setup

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd burntrack

# 2. Install dependencies
npm install

# 3. Add your API key (optional)
cp .env.local.example .env.local
# Edit .env.local and add:
#   ANTHROPIC_API_KEY=sk-ant-...

# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the app.

---

## Deploy on Vercel

The easiest way to deploy BurnTrack is with [Vercel](https://vercel.com):

### Steps

1. Push your code to a GitHub / GitLab / Bitbucket repository.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. In the project settings, add the environment variable:

   | Name                 | Value              |
   |----------------------|--------------------|
   | `ANTHROPIC_API_KEY`  | `sk-ant-...`       |

4. Click **Deploy**.

> **Note:** The `ANTHROPIC_API_KEY` is only used in the server-side API route (`/api/tip`) and is never exposed to the browser. If you don't set it, the app will still work using intelligent fallback tips for each exercise.

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/burntrack&env=ANTHROPIC_API_KEY&envDescription=Anthropic%20API%20key%20for%20AI%20coaching%20tips%20(optional))

---

## Project Structure

```
burntrack/
├── app/
│   ├── api/
│   │   └── tip/
│   │       └── route.js        # Claude API route (server-side)
│   ├── globals.css             # Tailwind v4 theme + custom styles
│   ├── layout.jsx              # Root layout with SEO metadata
│   └── page.jsx                # Main calculator UI
├── .env.local                  # ANTHROPIC_API_KEY (git-ignored)
├── package.json
├── postcss.config.mjs
└── next.config.mjs
```

---

## Author

**Yashvardhan Khanduja**
📧 [vardhan.yash265@gmail.com](mailto:vardhan.yash265@gmail.com)

Built for [Digital Heroes](https://digitalheroesco.com) ⭐
