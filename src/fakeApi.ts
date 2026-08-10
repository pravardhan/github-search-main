export interface Repo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  html_url: string;
}

const DATA: Repo[] = [
  { id: 1, name: "react", full_name: "facebook/react", description: "The library for web and native user interfaces.", stargazers_count: 220000, language: "JavaScript", html_url: "https://github.com/facebook/react" },
  { id: 2, name: "typescript", full_name: "microsoft/typescript", description: "TypeScript is a superset of JavaScript.", stargazers_count: 98000, language: "TypeScript", html_url: "https://github.com/microsoft/typescript" },
  { id: 3, name: "vite", full_name: "vitejs/vite", description: "Next generation frontend tooling.", stargazers_count: 65000, language: "TypeScript", html_url: "https://github.com/vitejs/vite" },
  { id: 4, name: "redux", full_name: "reduxjs/redux", description: "Predictable state container.", stargazers_count: 60000, language: "TypeScript", html_url: "https://github.com/reduxjs/redux" },
  { id: 5, name: "zustand", full_name: "pmndrs/zustand", description: "Bear necessities for state management.", stargazers_count: 42000, language: "TypeScript", html_url: "https://github.com/pmndrs/zustand" },
];

export async function searchRepos(query: string): Promise<Repo[]> {
  await new Promise(r => setTimeout(r, 400));
  if (!query.trim()) return [];
  return DATA.filter(r =>
    r.name.toLowerCase().includes(query.toLowerCase()) ||
    r.description?.toLowerCase().includes(query.toLowerCase())
  );
}

export async function getRepo(fullName: string): Promise<Repo | null> {
  await new Promise(r => setTimeout(r, 300));
  return DATA.find(r => r.full_name === fullName) ?? null;
}
