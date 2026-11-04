import { useEffect, useState } from "react"
import { searchRepos } from "../fakeApi"
import type { Repo } from "../fakeApi"
import useDebounce from "./useDebounce"

interface LoadedPages {
  query: string
  page: number
  items: Repo[]
  totalCount: number
  hasNextPage: boolean
}

interface FailedPage {
  query: string
  page: number
}

const useSearch = () => {
  const [query, setQuery] = useState("")
  const debouncedQuery = useDebounce(query)

  const [page, setPage] = useState(1)
  const [attempt, setAttempt] = useState(0)
  const [loaded, setLoaded] = useState<LoadedPages | null>(null)
  const [failed, setFailed] = useState<FailedPage | null>(null)

  const [lastQuery, setLastQuery] = useState(debouncedQuery)
  if (lastQuery !== debouncedQuery) {
    setLastQuery(debouncedQuery)
    setPage(1)
  }

  useEffect(() => {
    const ac = new AbortController()

    const fetchPage = async () => {
      try {
        const result = await searchRepos(debouncedQuery, page)
        if (ac.signal.aborted) return

        setLoaded((previous) => ({
          query: debouncedQuery,
          page,
          items: page === 1 || !previous ? result.items : [...previous.items, ...result.items],
          totalCount: result.totalCount,
          hasNextPage: result.hasNextPage,
        }))
      } catch {
        if (!ac.signal.aborted) setFailed({ query: debouncedQuery, page })
      }
    }

    fetchPage()

    return () => ac.abort()
  }, [debouncedQuery, page, attempt])

  const isCurrent = loaded?.query === debouncedQuery && loaded.page <= page
  const isPageLoaded = isCurrent && loaded.page === page
  const hasError = failed?.query === debouncedQuery && failed.page === page && !isPageLoaded
  const isSettled = isPageLoaded || hasError

  const isDebouncing = query !== debouncedQuery
  const isLoading = isDebouncing || (page === 1 && !isSettled)
  const isLoadingMore = !isDebouncing && page > 1 && !isSettled

  const loadMore = () => {
    if (isSettled && !hasError) setPage(page + 1)
  }

  const retry = () => {
    setFailed(null)
    setAttempt(attempt + 1)
  }

  return {
    query,
    setQuery,
    items: isCurrent && !isDebouncing ? loaded.items : [],
    totalCount: isCurrent ? loaded.totalCount : 0,
    hasNextPage: isCurrent && loaded.hasNextPage,
    isLoading,
    isLoadingMore,
    hasError: hasError && !isDebouncing,
    loadMore,
    retry,
  }
}

export default useSearch
