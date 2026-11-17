// @vitest-environment jsdom

import useIsMobile from 'src/shared/hooks/useIsMobile';

import { describe, expect, it } from 'vitest';
import { renderHook, wrapper } from 'vitest/lib';

import { mockViewport } from './mockViewport';

describe('test viewport', () => {
  it('is the desktop breakpoint by default', () => {
    expect(window.matchMedia('(min-width: 1000px)').matches).toBe(true);
    expect(window.matchMedia('(min-width: 1440px)').matches).toBe(false);
    expect(renderHook(() => useIsMobile(), { wrapper }).result.current).toBe(false);
  });

  it('switches to a mobile breakpoint on request', () => {
    mockViewport('sm');

    expect(window.matchMedia('(min-width: 415px)').matches).toBe(true);
    expect(window.matchMedia('(min-width: 1000px)').matches).toBe(false);
    expect(renderHook(() => useIsMobile(), { wrapper }).result.current).toBe(true);
  });

  it('returns to the desktop breakpoint after a test that switched it', () => {
    expect(renderHook(() => useIsMobile(), { wrapper }).result.current).toBe(false);
  });

  it('resolves the widest breakpoint a wide viewport reaches', () => {
    mockViewport('xl');

    expect(window.matchMedia('(min-width: 90rem)').matches).toBe(true);
    expect(window.matchMedia('(min-width: 120rem)').matches).toBe(false);
  });

  it('honours upper bounds and combined ranges', () => {
    expect(window.matchMedia('only screen and (max-width: 1000px)').matches).toBe(true);
    expect(window.matchMedia('(max-width: 999px)').matches).toBe(false);
    expect(window.matchMedia('(min-width: 415px) and (max-width: 1439px)').matches).toBe(true);
  });

  it('matches no query that is not about the viewport width', () => {
    expect(window.matchMedia('(prefers-color-scheme: dark)').matches).toBe(false);
  });

  it('reports the base breakpoint as narrower than the smallest named one', () => {
    mockViewport('base');

    expect(window.matchMedia('(min-width: 415px)').matches).toBe(false);
  });
});
