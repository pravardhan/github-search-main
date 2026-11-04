export const HOME_PATH = import.meta.env.BASE_URL

export const REPO_ROUTE = `${HOME_PATH}repo/:owner/:name`

export const repoPath = (fullName: string) => `${HOME_PATH}repo/${fullName}`
