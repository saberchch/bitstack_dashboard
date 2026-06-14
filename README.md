# Bitstacks Dashboard

A full-stack web dashboard for the **Bitstacks** blockchain education and professional ecosystem. The app brings together mentoring, freelancing, academic resources, institute programs, and BTS token management in a single React interface.

## What It Does

Bitstacks Dashboard is a prototype platform for learners, mentors, freelancers, and researchers in Web3 and adjacent fields. Users can explore the ecosystem from a central hub, book sessions, manage missions, browse resources, and track BTS credits.

### Core Modules

| Module | Route | Description |
| :--- | :--- | :--- |
| **Dashboard** | `/` | Overview with stats, learning progress, upcoming events, recommended mentors, and recent activity. |
| **d-Platform** | `/d-platform` | Knowledge exchange hub for public and private mentoring sessions. |
| **Expert Mentors** | `/expert-mentors` | Browse and filter verified mentors; view profiles and book sessions. |
| **Public Sessions** | `/public-sessions` | Discover group sessions with filtering, pagination, and enrollment. |
| **d-Institute** | `/d-institute` | Educational programs in Web3, AI, and product management with enrollment tracking. |
| **d-Lancer** | `/d-lancer` | Freelance mission marketplace with milestone-based escrow workflows. |
| **d-Library** | `/d-library` | Academic resource library for whitepapers, courses, templates, and datasets (premium or open access). |
| **BTS Credit** | `/bts-credit` | BTS token wallet, transaction history, and credit management. |
| **Calendar** | `/calendar` | Session and event scheduling. |
| **Messages** | `/messages` | Direct messaging between users. |
| **Notifications** | `/notifications` | Activity and system notifications. |
| **Profile / Settings** | `/profile`, `/settings` | User profile and app preferences. |

### Data & Persistence

This is a **frontend-first prototype**. Most state (missions, enrollments, reviews, sessions, messages, notifications, and profile data) is stored in the browser via `localStorage`. Flask serves the built React app in production; there is no separate REST API backend yet.

For details on publishing resources to d-Library, see [SUBMISSION_GUIDE.md](./SUBMISSION_GUIDE.md).

## Tech Stack

- **Frontend:** React 19, Vite 8, React Router 7, Tailwind CSS 4
- **Backend:** Flask 3 (static file server + SPA routing)
- **Storage:** Browser `localStorage` (demo data)

## Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.10+

## Quick Start (Development)

Run the frontend with hot reload for the fastest development experience.

### 1. Install frontend dependencies

```bash
cd frontend
npm install
```

### 2. Start the Vite dev server

```bash
npm run dev
```

Open the URL shown in the terminal (default: [http://localhost:5173](http://localhost:5173)).

## Production Build & Run

For a production-like setup, build the React app and serve it with Flask.

### 1. Build the frontend

```bash
cd frontend
npm install
npm run build
```

This outputs static assets to `frontend/dist/`.

### 2. Set up Python environment

From the project root:

```bash
python3 -m venv venv
source venv/bin/activate        # Linux / macOS
# venv\Scripts\activate         # Windows

pip install -r requirements.txt
```

### 3. Start the Flask server

```bash
python app.py
```

Open [http://localhost:5001](http://localhost:5001). Flask serves the React SPA and handles client-side routing via a catch-all route.

## Available Scripts

Run these from the `frontend/` directory:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start Vite dev server with hot reload |
| `npm run build` | Build optimized production assets to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Project Structure

```
bitstack_dashboard/
├── app.py                  # Flask server (serves frontend/dist)
├── requirements.txt        # Python dependencies
├── SUBMISSION_GUIDE.md     # d-Library publishing guide
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route-level page components
│   │   ├── utils/          # localStorage helpers and business logic
│   │   └── data/           # Seed/mock data
│   ├── dist/               # Production build output (generated)
│   └── package.json
└── README.md
```

## Troubleshooting

- **Blank page after Flask start:** Run `npm run build` in `frontend/` first. Flask expects `frontend/dist/index.html` to exist.
- **Port already in use:** Vite defaults to port `5173`; Flask runs on port `5001` (see `app.py`). Stop the conflicting process or change the port in the respective config.
- **Stale UI in dev:** Hard-refresh the browser or restart `npm run dev`.
- **Windows `:Zone.Identifier` files:** These are harmless metadata files from Windows downloads. They are gitignored (`*:Zone.Identifier`) and can be removed with:

  ```bash
  find . -name '*:Zone.Identifier' -delete
  ```
