import Results from "../components/Results"
import Search from "../components/Search"
import useSearch from "../hooks/useSearch"

const SearchPage = () => {
  const search = useSearch()

  return (
    <>
      <h1>GitHub Repo Search</h1>
      <Search value={search.query} onChange={search.setQuery} />
      <Results
        items={search.items}
        totalCount={search.totalCount}
        hasNextPage={search.hasNextPage}
        isLoading={search.isLoading}
        isLoadingMore={search.isLoadingMore}
        hasError={search.hasError}
        onLoadMore={search.loadMore}
        onRetry={search.retry}
      />
    </>
  )
}

export default SearchPage
