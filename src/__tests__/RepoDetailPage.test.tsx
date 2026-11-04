import { render, screen } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import { describe, expect, it, vi } from "vitest"
import { getRepo } from "../fakeApi"
import type { Repo } from "../fakeApi"
import { REPO_ROUTE } from "../routes/paths"
import RepoDetailPage from "../routes/RepoDetailPage"

vi.mock("../fakeApi")

const getRepoMock = vi.mocked(getRepo)

const repo: Repo = {
  id: 1,
  name: "react",
  full_name: "facebook/react",
  description: "The library for web and native user interfaces.",
  stargazers_count: 220000,
  language: "JavaScript",
  html_url: "https://github.com/facebook/react",
}

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={["/repo/facebook/react"]}>
      <Routes>
        <Route path={REPO_ROUTE} element={<RepoDetailPage />} />
      </Routes>
    </MemoryRouter>,
  )

describe("RepoDetailPage", () => {
  it("shows all repo details", async () => {
    getRepoMock.mockResolvedValue(repo)
    renderPage()

    expect(screen.getByRole("status")).toHaveTextContent("Loading repository")

    expect(await screen.findByRole("heading", { name: "facebook/react" })).toBeInTheDocument()
    expect(getRepoMock).toHaveBeenCalledWith("facebook/react")
    expect(screen.getByText(repo.description as string)).toBeInTheDocument()
    expect(screen.getByText(`★ ${(220000).toLocaleString()}`)).toBeInTheDocument()
    expect(screen.getByText("JavaScript")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "View on GitHub" })).toHaveAttribute("href", repo.html_url)
    expect(screen.getByRole("link", { name: "← Back to search" })).toHaveAttribute("href", "/")
  })

  it("shows - and Unknown for missing values", async () => {
    getRepoMock.mockResolvedValue({ ...repo, description: null, language: null })
    renderPage()

    expect(await screen.findByText("-")).toBeInTheDocument()
    expect(screen.getByText("Unknown")).toBeInTheDocument()
  })

  it("shows not found for an unknown repo", async () => {
    getRepoMock.mockResolvedValue(null)
    renderPage()

    expect(await screen.findByText("Repository not found")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "← Back to search" })).toBeInTheDocument()
  })

  it("shows an error when loading fails", async () => {
    getRepoMock.mockRejectedValue(new Error("boom"))
    renderPage()

    expect(await screen.findByRole("alert")).toHaveTextContent("Something went wrong")
    expect(screen.queryByText("Repository not found")).not.toBeInTheDocument()
  })
})
