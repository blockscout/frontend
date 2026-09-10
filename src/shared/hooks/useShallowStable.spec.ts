// @vitest-environment jsdom

import { describe, it, expect } from 'vitest';
import { renderHook } from 'vitest/lib';

import { useShallowStable } from './useShallowStable';

describe('useShallowStable', () => {
  it('keeps the first object while every property is identical', () => {
    const data = { items: [ 1 ] };
    const { result, rerender } = renderHook((value: object) => useShallowStable(value), { initialProps: { data, count: 1 } });
    const first = result.current;

    rerender({ data, count: 1 });

    expect(result.current).toBe(first);
  });

  it('returns the new object when a property value changes', () => {
    const { result, rerender } = renderHook((value: object) => useShallowStable(value), { initialProps: { count: 1 } });
    const first = result.current;

    rerender({ count: 2 });

    expect(result.current).not.toBe(first);
    expect(result.current).toEqual({ count: 2 });
  });

  it('returns the new object when the set of keys changes', () => {
    const { result, rerender } = renderHook((value: object) => useShallowStable(value), { initialProps: { count: 1 } as object });
    const first = result.current;

    rerender({ count: 1, extra: true });

    expect(result.current).not.toBe(first);
  });

  it('treats NaN as equal to itself', () => {
    const { result, rerender } = renderHook((value: object) => useShallowStable(value), { initialProps: { value: NaN } });
    const first = result.current;

    rerender({ value: NaN });

    expect(result.current).toBe(first);
  });
});
