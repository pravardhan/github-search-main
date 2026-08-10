# GitHub Repo Search — Interview Exercise

**Stack:** TypeScript · React · react-router-dom v6  
**Time:** 45 minutes

## Getting Started

```bash
npm install
npm run dev
```

## Your Task

Build a two-screen GitHub Repo Search SPA using the fake API provided in `src/fakeApi.ts`.

### Screen 1 — Search (`/`)

- Text input that searches on each keystroke (debounce is a nice-to-have).
- Display a list of matching repos: **name**, **description**, **star count**.
- Each result links to Screen 2.
- Show a loading indicator while fetching. Show "No results" when the list is empty.

### Screen 2 — Detail (`/repo/:owner/:name`)

- Show full repo details: full name, description, stars, language, and a link to GitHub.
- Include a "Back to search" link.

### Requirements

- **TypeScript** — no `any`.
- **react-router-dom v6** for all routing (`<Routes>`, `<Route>`, `useParams`).
- Extract at least **one reusable component or custom hook**.
- Handle **loading** and **error** states visually.

## What We're Looking For

- Clean TypeScript — well-typed props, API responses, and state.
- Sensible component breakdown.
- Correct use of react-router v6 APIs.
- UX details: loading states, empty states, error handling.

## Available API

```ts
// src/fakeApi.ts
searchRepos(query: string): Promise<Repo[]>
getRepo(fullName: string): Promise<Repo | null>
```

No network calls are made — the data is in-memory with simulated latency.
