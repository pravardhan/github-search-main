import { Link, useParams } from "react-router-dom"
import Spinner from "../components/Spinner"
import useRepo from "../hooks/useRepo"
import type { Repo } from "../fakeApi"
import { HOME_PATH } from "./paths"

const RepoDetails = ({ repo }: { repo: Repo }) => (
  <>
    <h1>{repo.full_name}</h1>
    <p>{repo.description ?? "-"}</p>
    <dl>
      <dt>Stars</dt>
      <dd>★ {repo.stargazers_count.toLocaleString()}</dd>
      <dt>Language</dt>
      <dd>{repo.language ?? "Unknown"}</dd>
    </dl>
    <a href={repo.html_url} target="_blank" rel="noreferrer">View on GitHub</a>
  </>
)

const RepoDetailPage = () => {
  const { owner, name } = useParams<{ owner: string; name: string }>()
  const { repo, hasError, isLoading } = useRepo(`${owner}/${name}`)

  return (
    <>
      <p><Link to={HOME_PATH}>← Back to search</Link></p>
      {isLoading && <p role="status"><Spinner /> Loading repository…</p>}
      {hasError && <p role="alert">Something went wrong while loading this repository.</p>}
      {!isLoading && !hasError && !repo && <p>Repository not found</p>}
      {repo && <RepoDetails repo={repo} />}
    </>
  )
}

export default RepoDetailPage
