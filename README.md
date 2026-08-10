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

- On initial load, display the first page of repositories (up to **5 per page**) before any search query is entered.
- Text input that searches on each keystroke (debounce is a nice-to-have).
  - Typing resets to page 1 and replaces the displayed list with matching results.
  - Clearing the input returns to the default paginated view.
- Each page of results shows: **name**, **description**, **star count**.
- Each result links to Screen 2.
- Show a **"Showing X of Y repositories"** count above the list.
- Show a **"Load more"** button below the list when further pages exist; clicking it appends the next page to the current list (infinite-scroll style).
- Show a loading indicator on initial fetch and a spinner inside the "Load more" button while loading additional pages.
- Show "No results" when a search query returns an empty list.

### Screen 2 — Detail (`/repo/:owner/:name`)

- Show full repo details: full name, description, stars, language, and a link to GitHub.
- Include a "Back to search" link.

### Requirements

- **TypeScript** — no `any`. Use the exported `Repo`, `PaginatedResult<T>`, and `PAGE_SIZE` from `src/fakeApi.ts`.
- **react-router-dom v6** for all routing (`<Routes>`, `<Route>`, `useParams`).
- Extract at least **one reusable component or custom hook** (e.g. `useDebounce`).
- Handle **loading**, **load-more**, and **error** states visually.
- Prevent stale responses: cancel or ignore in-flight requests when the query changes mid-flight.

## What We're Looking For

- Clean TypeScript — well-typed props, API responses, and state.
- Sensible component breakdown.
- Correct use of react-router v6 APIs.
- UX details: initial paginated list, loading states, load-more flow, empty states, error handling.
- Pagination logic that appends pages without duplicating or re-ordering results.

## Available API

```ts
// src/fakeApi.ts

export interface Repo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  html_url: string;
}

export interface PaginatedResult<T> {
  items: T[];       // repos on this page
  page: number;     // current page number (1-based)
  totalCount: number; // total matches across all pages
  hasNextPage: boolean;
}

export const PAGE_SIZE = 5; // items per page

searchRepos(query: string, page?: number): Promise<PaginatedResult<Repo>>
getRepo(fullName: string): Promise<Repo | null>
```

No network calls are made — the data is a 15-item in-memory dataset with simulated latency.
