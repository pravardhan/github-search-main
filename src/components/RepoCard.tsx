import { Link } from "react-router-dom"
import type { Repo } from "../fakeApi"
import { repoPath } from "../routes/paths"

interface RepoCardProps {
  repo: Repo
}

const RepoCard = ({ repo }: RepoCardProps) => (
  <li className="repo-card">
    <Link to={repoPath(repo.full_name)}>
      <strong>{repo.name}</strong>
    </Link>
    <p className="repo-card-description">{repo.description ?? "-"}</p>
    <small>★ {repo.stargazers_count.toLocaleString()}</small>
  </li>
)

export default RepoCard
