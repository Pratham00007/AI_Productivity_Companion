<div align="center">

<br/>

```
███████╗  █████╗   █████╗  ███████╗
██╔════╝ ██╔══██╗ ██╔══██╗ ██╔════╝
███████╗ ███████║ ███████║ ███████╗
╚════██║ ██╔══██║ ██╔══██║ ╚════██║
███████║ ██║  ██║ ██║  ██║ ███████║
╚══════╝ ╚═╝  ╚═╝ ╚═╝  ╚═╝ ╚══════╝
```

# ⚡ AI Productivity Companion

**Turn your inbox into an intelligent action plan — powered by Gemini AI**

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Google AI](https://img.shields.io/badge/Gemini-AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini)
[![License](https://img.shields.io/badge/License-MIT-6366F1?style=for-the-badge)](LICENSE)

<br/>

> *Stop manually managing tasks from your inbox.*  
> *Let AI read, analyze, and schedule everything — automatically.*

<br/>

</div>

---

## ✨ What It Does

```
📩 Gmail → 🤖 Gemini AI → 📝 Tasks → 📅 Calendar → 🗂 MongoDB
```

Your inbox arrives. Gemini reads it. Tasks are created, calendar events are booked, preparation plans are generated — all without you lifting a finger.

---

## 🗺 Feature Highlights

| Feature | Description |
|---|---|
| 📩 **Gmail Integration** | OAuth-connected inbox scanning — reads your top 5 unread emails |
| 🤖 **Gemini AI Engine** | Extracts actionable tasks, deadlines, and topics from raw email text |
| 🔁 **OpenAI Fallback** | Automatically falls back to GPT if Gemini is unavailable |
| 📅 **Calendar Sync** | Creates Google Calendar events with smart scheduling |
| 📚 **Learning Resources** | Suggests relevant resources for each task automatically |
| 🗂 **Task Management** | Edit titles, deadlines, priorities, categories, and hours |
| 🔄 **Live Re-scan** | Re-scan your inbox anytime from the dashboard |
| 📊 **Stats Dashboard** | Priority breakdown, sync status, and task counters at a glance |

---

## 🔄 Full System Flow

```
┌─────────┐
│  Login  │  Google OAuth 2.0
└────┬────┘
     │
     ▼
┌─────────────┐
│  Dashboard  │  Loads existing tasks immediately
└──────┬──────┘
       │
       ▼
┌──────────────────┐
│  Auto Background │
│  Scan Triggered  │
└──────┬───────────┘
       │
       ▼
┌─────────────────────┐
│  Gmail API          │  Top 5 primary inbox emails
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐        ┌───────────────────┐
│  Gemini AI          │──fail──▶  OpenAI Fallback  │
│  (Primary)          │        │  (GPT-4o / GPT-4) │
└──────┬──────────────┘        └──────┬────────────┘
       │                              │
       └──────────────┬───────────────┘
                      ▼
           ┌────────────────────┐
           │  Task Extraction   │
           │  • Title           │
           │  • Deadline        │
           │  • Priority        │
           │  • Category        │
           │  • Estimated Hours │
           │  • Topics          │
           │  • Resources       │
           └──────┬─────────────┘
                  │
          ┌───────┴───────┐
          ▼               ▼
┌─────────────────┐  ┌───────────────────┐
│  Google Calendar│  │  MongoDB          │
│  Event Created  │  │  Task Persisted   │
└─────────────────┘  └───────────────────┘
          │
          ▼
┌─────────────────────┐
│  Dashboard Updates  │  Tasks appear with sync status
└──────┬──────────────┘
       │
       ▼
┌──────────────────────┐
│  User Edits Task     │  Change title, priority, deadline, etc.
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Calendar Re-synced  │  Updates propagate back to Google Calendar
└──────────────────────┘
```

---

## 🏗 Tech Stack

### Backend
```
Node.js + Express        — REST API server
MongoDB + Mongoose       — Task persistence
Passport.js              — Google OAuth 2.0 authentication
Gmail API                — Inbox scanning
Google Calendar API      — Event creation & sync
Gemini AI (Primary)      — Email-to-task extraction
OpenAI (Fallback)        — GPT fallback when Gemini unavailable
```

### Frontend
```
React 18                 — UI framework
React Router             — Client-side routing
Axios                    — HTTP client
Space Grotesk + Inter    — Typography
Custom CSS animations    — Smooth transitions & micro-interactions
```

---

## ⚡ Quick Start

### Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)
- Google Cloud project with Gmail API + Calendar API + OAuth enabled
- Gemini API key (Google AI Studio)
- OpenAI API key (fallback)

### 1 — Clone the repo

```bash
git clone https://github.com/Pratham00007/AI_Productivity_Companion.git
cd AI_Productivity_Companion
```

### 2 — Configure environment

Create a `.env` file in the `/server` directory:

```env
# Server
PORT=5000
CLIENT_URL=http://localhost:5000
SESSION_SECRET=your_super_secret_session_key

# MongoDB
MONGO_URI=mongodb+srv://your-cluster.mongodb.net/aicompanion

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback

# AI
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key
```

### 3 — Install dependencies

```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 4 — Run the app

```bash
# Terminal 1 — Backend
cd server && node server.js

# Terminal 2 — Frontend
cd frontend && npm start
```

Visit **http://localhost:5000** → click **Continue with Google** → watch the magic.



## 🎨 UI Overview

```
┌──────────────────────────────────────────────┐
│  ⚡ AI Productivity Companion  👤 John Doe  │  ← Sticky nav
├──────────────────────────────────────────────┤
│  12 Tasks  │  3 High │  9 Synced │ 3 Pending │  ← Stats strip
├──────────────────────────────────────────────┤
│  🔄 Scanning Gmail for new emails…           │  ← Live scan bar
├──────────────────────────────────────────────┤
│  Tasks (12)     [ All ][ High ][ Med ][ Low ]│
│                                              │
│  ║ Prepare Q3 presentation         HIGH ▲    │
│  │ 🗂 Work  ⏱ 3h  📅 Jun 28         [Edit]  │
│                                              │
│  ║ Review project proposal         MEDIUM    │
│  │ 🗂 PM    ⏱ 1.5h  📅 Jul 1        [Edit]  │
└──────────────────────────────────────────────┘
```

---

## 🛡 Security

- Google OAuth 2.0 — no passwords stored
- Session-based auth with secure httpOnly cookies
- API keys stored server-side only, never exposed to the client
- Per-user task isolation in MongoDB

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push and open a Pull Request

---

## 📄 License

MIT — see [LICENSE](LICENSE) for details.

---

<div align="center">

**Built with ⚡ by combining Gmail, Gemini, and a little bit of automation magic.**

*Stop triaging your inbox manually. Let AI do it.*

</div>