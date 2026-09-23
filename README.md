# ResuMate -- AI Resume Builder

> Build a clean, professional resume in minutes, with AI help rewriting your summary and experience.

🔗 **Live Demo:** https://resume-creaters.vercel.app/
💻 **Source Code:** https://github.com/Areeba-Khaliq/ResuMate

---

##  The Problem

Writing a resume is slow and stressful. Most people:
- Don't know how to describe their work in terms of results
- Struggle to write a strong professional summary
- Waste time fixing formatting in Word or Google Docs
- Get filtered out by ATS (Applicant Tracking Systems) because their wording is weak

##  Our Solution

**ResuMate** walks users through building a resume step by step. It shows a **live preview** as they type, has **AI Enhance** buttons that turn plain text into achievement-focused wording, and exports a **PDF** in one click.

---

## Features

| Feature | Description |
|---|---|
|  **Step-by-step builder** | 7 steps (Personal Info → Experience → Education → Skills → Projects → Template → Preview), with a progress bar and clickable step navigation |
|  **AI Enhance: Summary** | Rewrites your professional summary and suggests improvements |
|  **AI Enhance: Experience** | Turns job duties into results-focused bullet points with action verbs and numbers |
|  **Live preview** | A side panel shows your resume update as you type |
|  **Modern template** | A clean, professional layout |
|  **PDF export** | Preview the PDF in a new tab or download it, with automatic multi-page support |
|  **Auto-save** | Your progress is saved in the browser, so a refresh doesn't lose your work |
|  **Responsive UI** | Works on desktop and mobile |

---

##  How the AI Works

The AI layer (`lib/grok-api.ts`) is designed around the **xAI Grok API** (`https://api.x.ai/v1`):

1. **`enhanceSummary()`**: builds a prompt from the user's name, roles and current summary, and asks for a 2–3 sentence summary focused on value.
2. **`enhanceExperience()`**: sends the job title, company and duties, and asks for results-focused, ATS-friendly bullet points.
3. **`suggestSkills()`**: suggests technical skills, soft skills, industry skills and tools based on the user's experience.

Each response has the enhanced text, a list of suggestions and a confidence score.

> ⚠️ **Demo mode:** In the hackathon build, AI responses are **simulated** so the app works without an API key. The prompts and response format are ready. Connecting the real API only requires replacing `simulateGrokCall()` with a fetch call to Grok.

---

##  Tech Stack

- **Framework:** Next.js 13 (App Router, static export)
- **Language:** TypeScript
- **UI:** React 18, Tailwind CSS, shadcn/ui (Radix UI), Lucide icons
- **Forms:** React Hook Form + Zod
- **PDF:** jsPDF + html2canvas
- **AI:** xAI Grok API (integration layer)
- **Deployment:** Vercel

---

##  How to Use

1. **Personal Info:** Enter your contact details and a short summary, then click **AI Enhance**.
2. **Experience:** Add your jobs and click ** AI Enhance** to improve each description.
3. **Next steps:** Skip ahead through the steps that aren't finished yet.
4. **Preview:** Check your resume, then click **Preview PDF** or **Download PDF**.
---

## 👥 Team

- **Areeba Khaliq**
- **Muhammad Qasim**

---

## 🏆 Hackathon

Built for a **[lablab.ai](https://lablab.ai)** hackathon.

---

## 📜 License

MIT License. Feel free to use and build on it.
