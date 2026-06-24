# AI Productivity Assistant - Project State (Current Progress)

## Project Goal

Build an AI-powered productivity assistant that:

1. Connects with Gmail
2. Reads emails automatically
3. Extracts tasks using Gemini AI
4. Prioritizes tasks
5. Creates Google Calendar events
6. Generates preparation plans
7. Suggests learning resources
8. Shows everything in a dashboard
9. Allows editing tasks and syncs changes back to Google Calendar

---

# Current Status

## Completed Features

### Authentication

✅ Google OAuth Login

Scopes:

* profile
* email
* Gmail Readonly
* Google Calendar

Refresh token is successfully stored.

---

### Gmail Integration

✅ Gmail connected

Current flow:

Google Login
↓
Gmail Access Granted
↓
Latest Emails Fetch
↓
Email Content Extract

Files:

backend/utils/gmail.js

Functions:

* getGmailClient()
* getLatestEmails()
* getEmailContent()

---

### Gemini AI Integration

✅ Working

Model:

gemini-3.5-flash

File:

backend/controllers/emailcontroller.js

Current Gemini responsibilities:

* Task Extraction
* Priority Detection
* Category Detection
* Estimated Hours
* Topics Extraction
* Preparation Plan Generation
* Resource Suggestions

Expected Gemini JSON:

{
"title": "",
"deadline": "",
"priority": "",
"category": "",
"estimatedHours": 0,

"topics": [],

"preparationPlan": [
{
"task": "",
"daysBefore": 0
}
],

"resourceSuggestions": [
{
"title": "",
"platform": "",
"reason": ""
}
]
}

---

### MongoDB

✅ Working

Collections:

Users
Tasks

---

## User Model

backend/models/User.js

Fields:

* name
* email
* googleId
* accessToken
* refreshToken

---

## Task Model

backend/models/Task.js

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

### Duplicate Protection

✅ Planned / Partially Added

Logic:

Before creating a task:

Task.findOne({
sourceEmailId: msg.id
})

If task exists:

continue;

Purpose:

Avoid duplicate task creation when scan runs multiple times.

---

### Google Calendar Integration

✅ Working

File:

backend/utils/calendar.js

Current Features:

* createCalendarClient()
* createTaskEvent()

When task is created:

Mongo Save
↓
Google Calendar Event Created
↓
calendarEventId Stored

Current Calendar Event Contains:

* Title
* Priority
* Deadline
* Reminder

---

### Email Scan Flow

Current flow:

User Login
↓
Scan Emails API
↓
Read Emails
↓
Gemini Analysis
↓
Task Creation
↓
Calendar Event Creation
↓
Mongo Save

File:

backend/controllers/emailcontroller.js

Main Controller:

scanEmails()

---

# Backend Structure

backend/

config/
├── db.js
├── passport.js

controllers/
├── emailcontroller.js

middleware/
├── auth.js

models/
├── User.js
├── Task.js

routes/
├── authrouter.js
├── emailrouter.js
├── testrouter.js

utils/
├── gmail.js
├── calendar.js

server.js

.env

---

# Frontend Structure

frontend/src/

components/
├── Navbar.jsx
├── TaskCard.jsx

pages/
├── Login.jsx
├── Dashboard.jsx
├── Tasks.jsx
├── Calendar.jsx

services/
├── api.js

App.js

index.js

---

# Frontend Features Completed

Login Page

Button:

Login with Google

Redirect:

http://localhost:5000/auth/google

---

Dashboard

Current Features:

* Fetch tasks
* Display tasks
* Sync Emails Button

Uses:

getTasks()
scanEmails()

---

Tasks Page

Current Features:

* List tasks
* Mark Done

Uses:

updateTask()

---

Calendar Page

Current Features:

Google Calendar iframe embed

---

API Layer

frontend/src/services/api.js

Current Functions:

* getTasks()
* updateTask()
* deleteTask()
* scanEmails()

Backend URL:

http://localhost:5000/api

---

# Features Still Pending

## High Priority

### Calendar Update Sync

Need:

updateTaskEvent()

Flow:

Edit Task
↓
Mongo Update
↓
Google Calendar Update

---

### Preparation Calendar Events

Current:

Only Main Event

Need:

Interview
↓
Generate Preparation Tasks

Example:

Interview: 15 July

Preparation:

8 July → DSA Revision

10 July → System Design

13 July → Mock Interview

Auto-create these events in Google Calendar.

---

### Dashboard Analytics

Need:

GET /api/dashboard

Response:

{
"totalTasks": 20,
"highPriority": 4,
"todayTasks": 3,
"upcoming": []
}

---

### Task Edit Modal

Need:

Frontend popup

Edit:

* title
* priority
* deadline
* category

Save

↓

Update backend

↓

Update Google Calendar

---

### Better UI

Current:

Basic inline CSS

Need:

Tailwind CSS

SaaS-style dashboard

Cards:

* Total Tasks
* High Priority
* Upcoming Deadlines
* Today's Tasks

---

### Resource Actions

Current:

Only resourceSuggestions stored.

Need:

Buttons:

* Watch Video
* Open Course
* Open Docs

---

### AI Daily Planner

Future Feature

User opens dashboard.

AI says:

"Today focus on:

1. DSA Revision
2. Resume Review

You have an interview in 5 days."

---

### AI Chat Assistant

Future Feature

Question:

"What should I do today?"

AI reads tasks and calendar.

Returns action plan.

---

# Important Environment Variables

GOOGLE_CLIENT_ID=

GOOGLE_CLIENT_SECRET=

GOOGLE_API_KEY=

MONGO_URI=

SESSION_SECRET=

---

# Current Working Flow

Google Login
↓
Gmail Read
↓
Gemini Extract
↓
Task Save
↓
Calendar Event Create
↓
Dashboard Show

Everything above is working.


