// @vitest-environment jsdom

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, cleanup } from 'vitest/lib';

import { SEARCH_DEBOUNCE, useDebouncedFilterChange } from './useDebouncedFilterChange';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('useDebouncedFilterChange', () => {
  it('pushes only the last value once the debounce delay has passed', () => {
    const onFilterChange = vi.fn();
    const { result } = renderHook(() => useDebouncedFilterChange(onFilterChange));

    act(() => {
      result.current('a');
      result.current('ab');
      result.current('abc');
    });

    expect(onFilterChange).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(SEARCH_DEBOUNCE);
    });

    expect(onFilterChange).toHaveBeenCalledTimes(1);
    expect(onFilterChange).toHaveBeenCalledWith('abc');
  });

  it('drops a pending push when the component unmounts', () => {
    const onFilterChange = vi.fn();
    const { result, unmount } = renderHook(() => useDebouncedFilterChange(onFilterChange));

    act(() => {
      result.current('abc');
    });
    unmount();

    act(() => {
      vi.advanceTimersByTime(SEARCH_DEBOUNCE);
    });

    expect(onFilterChange).not.toHaveBeenCalled();
  });

  it('keeps one identity across renders and fires the latest handler', () => {
    const first = vi.fn();
    const second = vi.fn();
    const { result, rerender } = renderHook(({ handler }) => useDebouncedFilterChange(handler), { initialProps: { handler: first } });
    const initial = result.current;

    act(() => {
      result.current('abc');
    });
    rerender({ handler: second });

    expect(result.current).toBe(initial);

    act(() => {
      vi.advanceTimersByTime(SEARCH_DEBOUNCE);
    });

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledWith('abc');
  });
});
