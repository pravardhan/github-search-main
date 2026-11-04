import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { searchRepos } from "../fakeApi"
import type { PaginatedResult, Repo } from "../fakeApi"
import SearchPage from "../routes/SearchPage"

vi.mock("../fakeApi")

const searchMock = vi.mocked(searchRepos)

const makeRepo = (id: number, name: string, description: string | null = `${name} description`): Repo => ({
  id,
  name,
  full_name: `owner/${name}`,
  description,
  stargazers_count: 1000 + id,
  language: "TypeScript",
  html_url: `https://github.com/owner/${name}`,
})

const makePage = (items: Repo[], overrides: Partial<PaginatedResult<Repo>> = {}): PaginatedResult<Repo> => ({
  items,
  page: 1,
  totalCount: items.length,
  hasNextPage: false,
  ...overrides,
})

const deferred = () => {
  let resolve!: (value: PaginatedResult<Repo>) => void
  const promise = new Promise<PaginatedResult<Repo>>((res) => {
    resolve = res
  })
  return { promise, resolve }
}

const renderPage = () =>
  render(
    <MemoryRouter>
      <SearchPage />
    </MemoryRouter>,
  )

const names = () => screen.queryAllByRole("link").map((link) => link.textContent)

describe("SearchPage", () => {
  beforeEach(() => {
    searchMock.mockResolvedValue(makePage([]))
  })

  it("shows the first page with name, description, stars and link", async () => {
    searchMock.mockResolvedValue(makePage([makeRepo(1, "react")], { totalCount: 15, hasNextPage: true }))
    renderPage()

    expect(screen.getByRole("status")).toHaveTextContent("Loading repositories")

    const link = await screen.findByRole("link", { name: "react" })
    expect(link).toHaveAttribute("href", "/repo/owner/react")
    expect(screen.getByText("react description")).toBeInTheDocument()
    expect(screen.getByText(`★ ${(1001).toLocaleString()}`)).toBeInTheDocument()
    expect(screen.getByText("Showing 1 of 15 repositories")).toBeInTheDocument()
    expect(searchMock).toHaveBeenCalledWith("", 1)
  })

  it("shows - when a repo has no description", async () => {
    searchMock.mockResolvedValue(makePage([makeRepo(1, "react", null)]))
    renderPage()

    expect(await screen.findByText("-")).toBeInTheDocument()
  })

  it("appends the next page in order without duplicates", async () => {
    const user = userEvent.setup()
    searchMock.mockImplementation(async (_query, page = 1) =>
      page === 1
        ? makePage([makeRepo(1, "a"), makeRepo(2, "b")], { totalCount: 3, hasNextPage: true })
        : makePage([makeRepo(3, "c")], { page: 2, totalCount: 3 }),
    )
    renderPage()

    await user.click(await screen.findByRole("button", { name: "Load more" }))

    expect(await screen.findByRole("link", { name: "c" })).toBeInTheDocument()
    expect(names()).toEqual(["a", "b", "c"])
    expect(screen.getByText("Showing 3 of 3 repositories")).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "Load more" })).not.toBeInTheDocument()
  })

  it("disables the button and shows a spinner while loading more", async () => {
    const user = userEvent.setup()
    const nextPage = deferred()
    searchMock.mockImplementation((_query, page = 1) =>
      page === 1
        ? Promise.resolve(makePage([makeRepo(1, "a")], { totalCount: 2, hasNextPage: true }))
        : nextPage.promise,
    )
    renderPage()

    await user.click(await screen.findByRole("button", { name: "Load more" }))

    const button = screen.getByRole("button", { name: "Loading…" })
    expect(button).toBeDisabled()
    expect(button.querySelector(".spinner")).toBeInTheDocument()
    expect(names()).toEqual(["a"])

    nextPage.resolve(makePage([makeRepo(2, "b")], { page: 2, totalCount: 2 }))
    expect(await screen.findByRole("link", { name: "b" })).toBeInTheDocument()
  })

  it("debounces typing into a single search", async () => {
    const user = userEvent.setup()
    renderPage()
    await screen.findByText("No results")
    searchMock.mockClear()

    await user.type(screen.getByRole("searchbox"), "react")

    await waitFor(() => expect(searchMock).toHaveBeenCalledWith("react", 1))
    expect(searchMock).toHaveBeenCalledTimes(1)
  })

  it("goes back to page 1 and replaces the list on a new search", async () => {
    const user = userEvent.setup()
    searchMock.mockImplementation(async (query, page = 1) => {
      if (query === "x") return makePage([makeRepo(9, "x")])
      return page === 1
        ? makePage([makeRepo(1, "a")], { totalCount: 2, hasNextPage: true })
        : makePage([makeRepo(2, "b")], { page: 2, totalCount: 2 })
    })
    renderPage()

    await user.click(await screen.findByRole("button", { name: "Load more" }))
    await screen.findByRole("link", { name: "b" })

    await user.type(screen.getByRole("searchbox"), "x")

    await screen.findByRole("link", { name: "x" })
    expect(names()).toEqual(["x"])
    expect(searchMock).toHaveBeenCalledWith("x", 1)
  })

  it("shows No results, then the default list when cleared", async () => {
    const user = userEvent.setup()
    searchMock.mockImplementation(async (query) =>
      query === "zzz" ? makePage([]) : makePage([makeRepo(1, "a")]),
    )
    renderPage()
    await screen.findByRole("link", { name: "a" })

    const input = screen.getByRole("searchbox")
    await user.type(input, "zzz")
    expect(await screen.findByText("No results")).toBeInTheDocument()

    await user.clear(input)
    expect(await screen.findByRole("link", { name: "a" })).toBeInTheDocument()
  })

  it("ignores a slow response for an old query", async () => {
    const user = userEvent.setup()
    const slow = deferred()
    searchMock.mockImplementation((query) => {
      if (query === "slow") return slow.promise
      if (query === "fast") return Promise.resolve(makePage([makeRepo(2, "fast")]))
      return Promise.resolve(makePage([makeRepo(1, "default")]))
    })
    renderPage()
    await screen.findByRole("link", { name: "default" })

    const input = screen.getByRole("searchbox")
    await user.type(input, "slow")
    await waitFor(() => expect(searchMock).toHaveBeenCalledWith("slow", 1))

    await user.clear(input)
    await user.type(input, "fast")
    await screen.findByRole("link", { name: "fast" })

    slow.resolve(makePage([makeRepo(3, "stale")]))
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(names()).toEqual(["fast"])
  })

  it("shows an error and retries the first page", async () => {
    const user = userEvent.setup()
    searchMock.mockRejectedValueOnce(new Error("boom"))
    searchMock.mockResolvedValue(makePage([makeRepo(1, "a")]))
    renderPage()

    expect(await screen.findByRole("alert")).toHaveTextContent("Something went wrong")

    await user.click(screen.getByRole("button", { name: "Try again" }))

    expect(await screen.findByRole("link", { name: "a" })).toBeInTheDocument()
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
  })

  it("keeps the list when load more fails and retries that page", async () => {
    const user = userEvent.setup()
    let failNextPage = true
    searchMock.mockImplementation(async (_query, page = 1) => {
      if (page === 1) return makePage([makeRepo(1, "a")], { totalCount: 2, hasNextPage: true })
      if (failNextPage) {
        failNextPage = false
        throw new Error("boom")
      }
      return makePage([makeRepo(2, "b")], { page: 2, totalCount: 2 })
    })
    renderPage()

    await user.click(await screen.findByRole("button", { name: "Load more" }))

    expect(await screen.findByRole("alert")).toBeInTheDocument()
    expect(names()).toEqual(["a"])

    await user.click(screen.getByRole("button", { name: "Try again" }))

    await screen.findByRole("link", { name: "b" })
    expect(names()).toEqual(["a", "b"])
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
  })
})
