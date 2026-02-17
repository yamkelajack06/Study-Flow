# Study Flow

**Live App:** https://study-flow-beta.vercel.app/

Study Flow is a web application designed to help students organise their weekly study sessions and tasks. Built as a Single-Page Application (SPA) using React, the app provides a clean, responsive, and powerful tool for academic planning.

---

## Project Purpose

The primary goal of this application is to give students a clear overview of their weekly schedule, allowing them to effectively manage their study time. The app focuses on providing core functionality for creating and managing a study timetable, built around a simple principle: you should spend your time studying, not wrestling with your planner.

---

## Current Features

The application includes all core functionality for managing a study timetable, along with authentication and cloud sync.

### Timetable Views
- **Weekly View** — a responsive grid showing Monday to Sunday with hourly slots from 6 AM to 11 PM. Entries render as colour-coded blocks within their time slot.
- **Daily View** — a focused single-day breakdown showing all entries for the selected date with free-time slots clearly indicated.
- **Monthly View** — a calendar-style overview showing entry indicators per day, with a click-through to full entry details.
- **Date Navigation** — previous/next controls and a "Today" button work across all three views.

### Entry Management
- **One-time Entries** — schedule exams, deadlines, or any single-date event on a specific day.
- **Recurring Entries** — add weekly, biweekly, or monthly commitments such as lectures, labs, or personal study blocks.
- **Edit Entries** — modify any existing entry's subject, time, day, category, colour, or notes through a modal form.
- **Delete Entries** — remove individual entries with a confirmation prompt to prevent accidental deletions.
- **Conflict Detection** — the app prevents overlapping entries on the same day and time slot automatically, both through the UI and the AI assistant.
- **Colour-coded Categories** — entries can be assigned to built-in categories (Lecture, Study, Assignment, Exam, Lab, Other) or custom categories, each with a fully customisable colour using a preset palette or a custom colour picker.

### AI Assistant
A conversational chat interface powered by the Google Gemini API that lets you manage your timetable using plain English.

- **Natural language commands** — "Add Physics every Monday at 10am" or "Clear my Friday afternoons"
- **Bulk operations** — describe your full week in one message and the AI adds all entries at once
- **Conflict awareness** — validates every entry against your existing schedule before adding
- **Clarifying questions** — asks for missing details rather than guessing
- **Scheduling advice** — suggests available time slots and helps plan study sessions around your existing commitments
- **Schedule queries** — ask what you have on a given day or week and get a natural language summary
- **Rate limited** — 50 requests per hour, 150 per day to keep the service stable

Currently supports adding (single and multiple), deleting (single and multiple), and reading entries. Editing via the AI is not yet supported — use the edit button on any entry instead.

### Authentication & Data Persistence
- **Continue without login** — full functionality available with no account. All data is stored locally using the browser's `localStorage` API.
- **Google Sign-In** — one-click authentication. On first sign-in, any locally stored entries are automatically migrated to the cloud.
- **Cloud sync via Firestore** — once signed in, entries are stored in Firestore and available across all your devices.
- **Logout** — sign out at any time from the header. Data remains in the cloud and reloads on next sign-in.
- **Strategy pattern** — the persistence layer automatically switches between localStorage and Firestore depending on auth state, with no manual intervention required.

### Export
- **PDF export** — generate a print-optimised weekly timetable as a PDF. Choose a custom start and end time to trim the export to your active hours only.
- **Print dialog** — the browser's native print dialog is available as a fallback.

---

## Technology Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Routing | React Router v6 |
| Styling | Vanilla CSS + CSS Modules |
| Authentication | Firebase Authentication (Google Sign-In) |
| Database | Cloud Firestore |
| Local persistence | `localStorage` API |
| AI Integration | Google Gemini 2.5 Flash Lite (`@google/genai` SDK) |
| PDF Export | html2canvas + jsPDF |
| Markdown rendering | react-markdown + rehype-highlight |
| Icons | Lucide React |

---

## Getting Started

### Prerequisites
- Node.js 18+
- A Firebase project with Firestore and Google Authentication enabled
- A Google Gemini API key

### Installation

```bash
git clone https://github.com/your-username/study-flow.git
cd study-flow
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key

VITE_FIRE_BASE_AUTH_API_KEY=your_firebase_api_key
VITE_FIRE_BASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIRE_BASE_AUTH_PROJECT_ID=your_project_id
VITE_FIRE_BASE_AUTH_STORAGE_BUCKET=your_project.appspot.com
VITE_FIRE_BASE_AUTH_MESSAGING_SENDER_ID=your_sender_id
VITE_FIRE_BASE_AUTH_APP_ID=your_app_id
VITE_FIRE_BASE_AUTH_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Run Locally

```bash
npm run dev
```

---

## Deploying to Vercel

1. Push your code to GitHub and import the repo at [vercel.com](https://vercel.com)
2. Go to **Settings → Environment Variables** and add every `VITE_` key from your `.env` — Vercel does **not** read your `.env` file automatically
3. Set each variable's environment to **Production, Preview, and Development**
4. Redeploy — latest deployment → three dots → **Redeploy**

> Vite requires the `VITE_` prefix on all environment variables. Without it, `import.meta.env.VITE_*` returns `undefined` in production and both Firebase and Gemini will fail silently.

### Firebase Security Rules

Under **Firestore Database → Rules**, set:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/entries/{entryId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## Future Development

The next phase of development will focus on:

- **Notifications** — browser push notifications to remind you of upcoming sessions
- **Dark mode** — a system-aware and manually toggleable dark theme
- **Analytics** — visualise time spent per subject and study patterns over time
- **AI entry editing** — allow the AI assistant to modify existing entries, not just add and delete
- **Mobile app** — a React Native version for on-the-go schedule management

---

*Built for students, by a student.*
