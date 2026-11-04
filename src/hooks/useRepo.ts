import { useEffect, useState } from "react"
import { getRepo } from "../fakeApi"
import type { Repo } from "../fakeApi"

interface RepoState {
  fullName: string
  repo: Repo | null
  hasError: boolean
}

const useRepo = (fullName: string) => {
  const [state, setState] = useState<RepoState | null>(null)

  useEffect(() => {
    const ac = new AbortController()

    const fetchRepo = async () => {
      try {
        const repo = await getRepo(fullName)
        if (!ac.signal.aborted) setState({ fullName, repo, hasError: false })
      } catch {
        if (!ac.signal.aborted) setState({ fullName, repo: null, hasError: true })
      }
    }

    fetchRepo()

    return () => ac.abort()
  }, [fullName])

  const current = state?.fullName === fullName ? state : null

  return {
    repo: current?.repo ?? null,
    hasError: current?.hasError ?? false,
    isLoading: current === null,
  }
}

export default useRepo
