# NextGen Academy

Frontend for **NextGen Academy**, an online learning platform: course catalog, course pages, student dashboard, lessons, assessments and demo certificates.

> **Frontend preview.** There is no backend. Accounts, enrollments, progress and certificates are demo data stored in the browser (`localStorage`). No real authentication or payments.

## Stack

React 19, TypeScript, Vite, Tailwind CSS v4, React Router

## Getting started

    npm install
    npm run dev        # http://localhost:5173
    npm run typecheck  # TypeScript check
    npm run build      # production build in dist/
    npm run preview    # serve the production build

## Routes

| Path | Page |
| --- | --- |
| `/` | Home |
| `/courses` (`?category=`) | Course catalog |
| `/courses/:id` | Course detail |
| `/login`, `/register`, `/forgot-password`, `/reset-password` | Auth (demo) |
| `/checkout/:id` | Demo enrollment for paid courses |
| `/dashboard` | Student dashboard (sign-in required) |
| `/learn/:id`, `/quiz/:id` | Lessons and assessment (enrollment required) |
| `/certificates`, `/certificates/:id`, `/verify` | Certificates |
| `/about`, `/contact`, `/programs`, `/resources/:slug` | Static pages |

## Project structure

    src/
      App.tsx              Route table
      main.tsx             Entry: Router + LearnerProvider
      components/
        ui/                Icon, Picture, SectionTitle, StatusMessage
        layout/            Header, Footer, Layout, route guards
        course/            CourseCard, CourseFilters
        auth/              AuthShell, TextField
      pages/               One file per screen (dashboard/ and static/ sub-folders)
      context/             LearnerContext: demo session, enrollment, progress
      data/                courses, quiz questions, navigation
      hooks/               useLocalStorage
      lib/                 filtering, storage, shared Tailwind classes
      types/               Shared TypeScript types

## Connecting a real backend later

All learner state lives in `src/context/LearnerContext.tsx` and course data in `src/data/courses.ts`. Replace those with API calls and the pages need little change.

## Deploying

This is a single-page app using client-side routing. Configure your host to serve `index.html` for unknown paths (a rewrite to `/index.html`).