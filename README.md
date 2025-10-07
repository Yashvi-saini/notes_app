# 📝 AI Notes App

A modern, AI-powered notes app built with **React**, using:

-  **Supabase** for user authentication  
-  **Google Gemini API** for smart note actions: Summarize, Rewrite, Explain, and Generate Title  
-  Local state-based note saving for quick note-taking  

---

##  Features

-  **User Authentication** via Supabase (sign in, sign out)
-  **Create & Save Notes** with title, content, and timestamp
-  **AI Actions** powered by Gemini:
  - ✅ Summarize long notes into concise text
  - ✅ Rewrite notes clearly and professionally
  - ✅ Explain complex content in simpler terms
  - ✅ Generate a smart title for your note
- 🔍 **Search Notes** by title
- 🗑️ **Delete Notes** individually
- 🎨 Clean, responsive UI with Tailwind CSS

---

##  Tech Stack

- **Frontend:** React + Vite  
- **Styling:** Tailwind CSS  
- **Auth:** Supabase Auth  
- **AI Integration:** Google Gemini API (`gemini-2.0-flash` model)

---
## 🔗 Supabase Setup

1. Go to [https://supabase.com/](https://supabase.com/) and create a new project.
2. Go to **Project Settings → API** and copy:
   - Project URL → `VITE_SUPABASE_URL`
   - anon/public API key → `VITE_SUPABASE_ANON_KEY`
3. In **Authentication → Settings → Email**, enable "Email and Password" sign-in.

> You don’t need a database table for notes unless you want to persist them.

---

## Project Structure

```
src/
├── components/
│   └── Notes.jsx         # Main Notes UI
├── utils/
│   ├── gemini.js         # Handles Gemini API prompts & responses
│   └── supabaseClient.js # Supabase setup
├── App.jsx
└── main.jsx
```

---

##  AI Prompt Types

| Action     | Prompt Sent to Gemini                                      |
|------------|-------------------------------------------------------------|
| Summarize  | Summarize this text in plain text (no formatting)...        |
| Rewrite    | Rewrite this note clearly and professionally...             |
| Explain    | Explain this note in simpler terms...                       |
| Title      | Generate a short, clear title in plain text only...         |

> Responses are automatically cleaned to remove any markdown formatting.

---

##  AI Cleaning Logic

All responses from Gemini are cleaned using a generic formatter that removes:
- Markdown bullets (`*`, `-`)
- Bold/italic (`**text**`, `*text*`)
- Special symbols like `` ` ``, `#`, `>`

So you're always working with **clean, plain text**.

---

##  To Do / Future Improvements

- [ ] Store notes in Supabase for real-time sync
- [ ] Add note editing
- [ ] Export notes to PDF or Markdown
- [ ] Add mobile enhancements and responsiveness
- [ ] Add tags or categories for notes

---

