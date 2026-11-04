import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import useDebounce from "../hooks/useDebounce"

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("keeps the old value until the delay has passed", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: "a" },
    })

    rerender({ value: "b" })
    act(() => vi.advanceTimersByTime(299))
    expect(result.current).toBe("a")

    act(() => vi.advanceTimersByTime(1))
    expect(result.current).toBe("b")
  })

  it("restarts the delay on every change", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: "a" },
    })

    rerender({ value: "b" })
    act(() => vi.advanceTimersByTime(200))
    rerender({ value: "c" })
    act(() => vi.advanceTimersByTime(200))
    expect(result.current).toBe("a")

    act(() => vi.advanceTimersByTime(100))
    expect(result.current).toBe("c")
  })
})
