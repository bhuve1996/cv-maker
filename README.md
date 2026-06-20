# CV Maker

A modern, frontend-first CV/Resume builder built with Next.js, TypeScript, and Tailwind CSS.

## Features

- Upload existing resumes (PDF or DOCX)
- Heuristic text extraction and section parsing
- Editable accordion forms for all resume sections
- Live A4 resume preview
- Download PDF or print directly
- No authentication, database, or backend required

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/                  # Next.js App Router pages
components/
  upload/             # File upload UI
  forms/              # Editable resume sections
  preview/            # Live preview template
  layout/             # Header & footer
lib/
  pdf-parser/         # PDF text extraction (pdfjs)
  docx-parser/        # DOCX text extraction (mammoth)
  resume-parser/      # Heuristic section identification
hooks/                # Zustand store & parser hook
types/                # Resume data model
```

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form + Zod (validation schemas)
- Zustand (client state)
- pdfjs-dist, mammoth, html2canvas, jspdf

## Future Enhancements

The architecture supports plugging in:

- AI extraction (Gemini/OpenAI)
- Multiple templates
- User accounts & cloud save
- ATS optimization & resume scoring

## Scripts

- `npm run dev` — Start development server
- `npm run build` — Production build
- `npm run start` — Start production server
- `npm run lint` — Run ESLint
