import { Route, Routes } from "react-router-dom"
import { HOME_PATH, REPO_ROUTE } from "./paths"
import RepoDetailPage from "./RepoDetailPage"
import SearchPage from "./SearchPage"

const Router = () => (
  <Routes>
    <Route path={HOME_PATH} element={<SearchPage />} />
    <Route path={REPO_ROUTE} element={<RepoDetailPage />} />
  </Routes>
)

export default Router
