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
  items: T[];
  page: number;
  totalCount: number;
  hasNextPage: boolean;
}

export const PAGE_SIZE = 5;

const DATA: Repo[] = [
  { id:  1, name: "react",          full_name: "facebook/react",           description: "The library for web and native user interfaces.",          stargazers_count: 220000, language: "JavaScript",  html_url: "https://github.com/facebook/react" },
  { id:  2, name: "typescript",     full_name: "microsoft/typescript",      description: "TypeScript is a superset of JavaScript.",                  stargazers_count:  98000, language: "TypeScript",  html_url: "https://github.com/microsoft/typescript" },
  { id:  3, name: "vite",           full_name: "vitejs/vite",               description: "Next generation frontend tooling.",                        stargazers_count:  65000, language: "TypeScript",  html_url: "https://github.com/vitejs/vite" },
  { id:  4, name: "redux",          full_name: "reduxjs/redux",             description: "Predictable state container.",                             stargazers_count:  60000, language: "TypeScript",  html_url: "https://github.com/reduxjs/redux" },
  { id:  5, name: "zustand",        full_name: "pmndrs/zustand",            description: "Bear necessities for state management.",                   stargazers_count:  42000, language: "TypeScript",  html_url: "https://github.com/pmndrs/zustand" },
  { id:  6, name: "next.js",        full_name: "vercel/next.js",            description: "The React framework for the web.",                         stargazers_count: 125000, language: "JavaScript",  html_url: "https://github.com/vercel/next.js" },
  { id:  7, name: "svelte",         full_name: "sveltejs/svelte",           description: "Cybernetically enhanced web apps.",                        stargazers_count:  78000, language: "JavaScript",  html_url: "https://github.com/sveltejs/svelte" },
  { id:  8, name: "tailwindcss",    full_name: "tailwindlabs/tailwindcss",  description: "A utility-first CSS framework for rapid UI development.",  stargazers_count:  82000, language: "JavaScript",  html_url: "https://github.com/tailwindlabs/tailwindcss" },
  { id:  9, name: "axios",          full_name: "axios/axios",               description: "Promise based HTTP client for the browser and Node.js.",   stargazers_count:  55000, language: "JavaScript",  html_url: "https://github.com/axios/axios" },
  { id: 10, name: "eslint",         full_name: "eslint/eslint",             description: "Find and fix problems in your JavaScript code.",           stargazers_count:  25000, language: "JavaScript",  html_url: "https://github.com/eslint/eslint" },
  { id: 11, name: "prettier",       full_name: "prettier/prettier",         description: "Opinionated code formatter.",                              stargazers_count:  49000, language: "JavaScript",  html_url: "https://github.com/prettier/prettier" },
  { id: 12, name: "jest",           full_name: "jestjs/jest",               description: "Delightful JavaScript testing.",                           stargazers_count:  44000, language: "JavaScript",  html_url: "https://github.com/jestjs/jest" },
  { id: 13, name: "vitest",         full_name: "vitest-dev/vitest",         description: "A blazing fast unit test framework powered by Vite.",      stargazers_count:  13000, language: "TypeScript",  html_url: "https://github.com/vitest-dev/vitest" },
  { id: 14, name: "react-query",    full_name: "tanstack/query",            description: "Powerful asynchronous state management for TypeScript.",   stargazers_count:  40000, language: "TypeScript",  html_url: "https://github.com/tanstack/query" },
  { id: 15, name: "storybook",      full_name: "storybookjs/storybook",     description: "UI component explorer for frontend developers.",           stargazers_count:  83000, language: "TypeScript",  html_url: "https://github.com/storybookjs/storybook" },
];

export async function searchRepos(
  query: string,
  page: number = 1,
): Promise<PaginatedResult<Repo>> {
  await new Promise(r => setTimeout(r, 400));

  const q = query.trim().toLowerCase();
  const matched = q
    ? DATA.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q),
      )
    : [...DATA];

  const start = (page - 1) * PAGE_SIZE;
  const items = matched.slice(start, start + PAGE_SIZE);

  return {
    items,
    page,
    totalCount: matched.length,
    hasNextPage: start + PAGE_SIZE < matched.length,
  };
}

export async function getRepo(fullName: string): Promise<Repo | null> {
  await new Promise(r => setTimeout(r, 300));
  return DATA.find(r => r.full_name === fullName) ?? null;
}
