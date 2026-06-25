# AI Productivity Assistant

## Goal

AI-powered productivity assistant that:

* Connects with Gmail
* Reads inbox emails
* Extracts actionable tasks using Gemini AI
* Falls back to OpenAI if Gemini fails
* Creates Google Calendar events
* Generates preparation plans
* Suggests learning resources
* Stores tasks in MongoDB
* Allows editing tasks and syncing updates back to Google Calendar

---

# Tech Stack

Backend:

* Node.js
* Express
* MongoDB
* Passport Google OAuth
* Gmail API
* Google Calendar API
* Gemini AI
* OpenAI (fallback)

Frontend:

* React
* React Router
* Axios

---

# Authentication

Route:

GET /auth/google

Scopes:

* profile
* email
* gmail.readonly
* calendar

Login Flow:

User Login
↓
Google OAuth
↓
Mongo User Create / Update
↓
Session Stored
↓
Redirect Dashboard

---

# Gmail Flow

File:

utils/gmail.js

Current Behavior:

* Reads only Primary Inbox
* Ignores Social tab
* Ignores Promotions tab
* Fetches latest 5 emails

Query:

category:primary newer_than:30d

---

# AI Processing

Primary AI:

Gemini

Fallback AI:

OpenAI

Flow:

Gemini
↓
Success → Continue

OR

Gemini Error
↓
OpenAI
↓
Continue

Extracts:

* Title
* Deadline
* Priority
* Category
* Estimated Hours
* Topics
* Preparation Plan
* Resource Suggestions

---

# Mongo Collections

## User

Fields:

* name
* email
* googleId
* accessToken
* refreshToken

## Task

Fields:

* title
* deadline
* priority
* category
* estimatedHours
* topics
* preparationPlan
* resourceSuggestions
* status
* calendarEventId
* sourceEmailId
* userId

---

# Duplicate Protection

Email Processing:

sourceEmailId

Already processed emails are skipped.

User Protection:

googleId unique

email unique

---

# Calendar Integration

File:

utils/calendar.js

Event contains:

* Title
* Priority
* Category
* Estimated Hours
* Topics
* Preparation Plan
* Resource Suggestions
* Status

Reminders:

* 24 Hours Before
* 1 Hour Before
* Email Reminder

---

# Task Editing

Frontend:

Edit Task Modal

Backend:

PUT /api/tasks/:id

Flow:

Edit Task
↓
Mongo Update
↓
Google Calendar Update

---

# Backend Structure

backend/

config/

* db.js
* passport.js

controllers/

* emailController.js

middleware/

* auth.js

models/

* User.js
* Task.js

routes/

* authRoutes.js
* emailRoutes.js
* taskrouter.js

utils/

* gmail.js
* calendar.js

server.js

---

# Frontend Structure

src/

pages/

* Login.jsx
* Dashboard.jsx

components/

* Progress.jsx
* TaskCard.jsx
* EditTaskModal.jsx

services/

* api.js

App.jsx

---

# Current Workflow

Login
↓
Dashboard
↓
Auto Scan
↓
Primary Inbox (Top 5)
↓
Gemini
↓
OpenAI Fallback
↓
Task Creation
↓
Calendar Event Creation
↓
Mongo Save
↓
Dashboard Display
↓
Task Edit
↓
Calendar Sync





