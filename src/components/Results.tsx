import type { Repo } from "../fakeApi"
import RepoCard from "./RepoCard"
import Spinner from "./Spinner"

interface ResultsProps {
  items: Repo[]
  totalCount: number
  hasNextPage: boolean
  isLoading: boolean
  isLoadingMore: boolean
  hasError: boolean
  onLoadMore: () => void
  onRetry: () => void
}

const Results = ({
  items,
  totalCount,
  hasNextPage,
  isLoading,
  isLoadingMore,
  hasError,
  onLoadMore,
  onRetry,
}: ResultsProps) => {
  if (isLoading) {
    return <p role="status"><Spinner /> Loading repositories…</p>
  }

  const errorMessage = (
    <p role="alert">
      Something went wrong while loading repositories.{" "}
      <button type="button" onClick={onRetry}>Try again</button>
    </p>
  )

  if (items.length === 0) {
    return hasError ? errorMessage : <p>No results</p>
  }

  return (
    <>
      <p>Showing {items.length} of {totalCount} repositories</p>
      <ul className="repo-list">
        {items.map((repo) => <RepoCard key={repo.id} repo={repo} />)}
      </ul>
      {hasError && errorMessage}
      {hasNextPage && !hasError && (
        <button type="button" onClick={onLoadMore} disabled={isLoadingMore}>
          {isLoadingMore ? <><Spinner /> Loading…</> : "Load more"}
        </button>
      )}
    </>
  )
}

export default Results
