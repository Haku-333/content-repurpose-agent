# Reprop.io - Content Repurposing Agent

## Project Overview
This project is a full-stack SaaS application called **Reprop.io**. Its purpose is to take a single piece of long-form content (like a blog post, YouTube script, or text file) and use AI to automatically repurpose it into native, highly-engaging formats for 5 different platforms:
1. LinkedIn Post
2. X (Twitter) Thread
3. Instagram Caption
4. TikTok Script
5. Newsletter

## Technology Stack
- **Frontend**: React, Vite, Tailwind CSS v4, React Router
- **Backend**: FastAPI (Python), Uvicorn
- **Database & Authentication**: Supabase (PostgreSQL + GoTrue Auth)
- **AI Integration**: Google GenAI SDK (Gemini 2.5 Flash)

---

## Complete Feature History (What We Built)

### 1. UI & Design System
- Implemented a sleek, minimalist dark mode interface inspired by Vercel and Linear (`#0A0A0A` background, sharp `4px` radiuses).
- Created a fully responsive **Dashboard** containing a `HeroSection`, `ContentInput` (with character counting), and a dynamic `PlatformSelector`.
- Created an **OutputSection** with tabs for each platform, allowing users to switch between the generated assets effortlessly.

### 2. Frontend Features
- **File Upload**: Built a native HTML5 `FileReader` integration so users can directly upload `.txt`, `.md`, or `.csv` files into the input box instead of copy-pasting.
- **Copy & Export**: Added buttons to copy the generated content to the clipboard or download it instantly as a `.txt` file using Blob URLs.
- **State Management**: Lifted state up to the `Project.jsx` level so the input box, platform selectors, and output components can share data seamlessly.

### 3. Backend AI Engine
- Created a FastAPI endpoint (`POST /generate`) that receives the user's content and target platforms.
- Integrated the **Google Gemini API** (`gemini-2.5-flash`) using a strict prompt to return a structured JSON response containing the repurposed content for all 5 platforms.
- Built robust JSON parsing logic to strip out markdown code fences (```json) that the AI occasionally returns.

### 4. Supabase Integration (Database & Auth)
- **Authentication**: Replaced a temporary local-storage mock auth with real **Supabase Auth**. Updated the `AuthContext` to manage secure user sessions via JWTs.
- **Secure API Requests**: Configured the frontend API layer to automatically attach the user's JWT to the `Authorization: Bearer <token>` header of every backend request.
- **Database Storage**: Installed the Supabase Python SDK on the backend. When content is generated, the backend intercepts the JWT, validates the user's identity, and securely saves the `original_content`, `platforms`, and `generated_data` into a PostgreSQL `projects` table.

### 5. Dynamic Project History (Sidebar)
- Created a `GET /projects` endpoint on the backend that fetches all past projects belonging exclusively to the logged-in user.
- Updated the **Sidebar** to fetch this history on load. It intelligently grabs the first 30 characters of the original content to act as a dynamic "Project Title".
- Implemented a `GET /projects/{id}` endpoint and wired it to the `/project/[id]` route on the frontend. When a user clicks a past project in their sidebar, the app dynamically loads their exact text and generated assets instantly, without needing to re-prompt the AI.

---

## Database Schema Reference

For future reference, here is the SQL schema powering the Supabase database:

```sql
create table projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  original_content text not null,
  platforms text not null,
  generated_data jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS) ensures users can only see their own projects
alter table projects enable row level security;

create policy "Users can view their own projects."
  on projects for select using ( auth.uid() = user_id );

create policy "Users can insert their own projects."
  on projects for insert with check ( auth.uid() = user_id );
```

## Running the App

If you are opening this project on a new machine or after a restart:

**1. Start the Backend:**
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload
```

**2. Start the Frontend:**
```bash
cd frontend
npm run dev
```
