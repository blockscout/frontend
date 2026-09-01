// @vitest-environment jsdom

import type React from 'react';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook, act } from 'vitest/lib';

import { useLazyActivation } from './useLazyActivation';

const pointer = (pointerType: 'mouse' | 'touch') => ({ pointerType } as React.PointerEvent);

// the clickless-gesture fallback delay used inside the hook
const CLICKLESS_GESTURE_FALLBACK = 500;

describe('useLazyActivation', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts inactive', () => {
    const { result } = renderHook(() => useLazyActivation());
    expect(result.current.activation).toBeNull();
  });

  it('mouse enter mounts right after the current task', () => {
    const { result } = renderHook(() => useLazyActivation());

    act(() => {
      result.current.handlers.onPointerEnter(pointer('mouse'));
    });
    // nothing mounts synchronously
    expect(result.current.activation).toBeNull();

    act(() => {
      vi.advanceTimersByTime(0);
    });
    expect(result.current.activation).toEqual({ type: 'pointer', clicked: false });
  });

  it('keyboard focus mounts right after the current task', () => {
    const { result } = renderHook(() => useLazyActivation());

    act(() => {
      result.current.handlers.onFocus();
      vi.advanceTimersByTime(0);
    });
    expect(result.current.activation).toEqual({ type: 'focus', clicked: false });
  });

  it('touch tap mounts on the click, not on pointerup', () => {
    const { result } = renderHook(() => useLazyActivation());

    act(() => {
      result.current.handlers.onPointerEnter(pointer('touch'));
      result.current.handlers.onPointerDown(pointer('touch'));
      result.current.handlers.onPointerUp();
    });

    // the finger has lifted but the click has not arrived yet — must not mount early
    act(() => {
      vi.advanceTimersByTime(CLICKLESS_GESTURE_FALLBACK - 1);
    });
    expect(result.current.activation).toBeNull();

    act(() => {
      result.current.handlers.onClick();
      vi.advanceTimersByTime(0);
    });
    expect(result.current.activation).toEqual({ type: 'pointer', clicked: true });
  });

  it('long-press without a click falls back to mounting after the fallback delay', () => {
    const { result } = renderHook(() => useLazyActivation());

    act(() => {
      result.current.handlers.onPointerEnter(pointer('touch'));
      result.current.handlers.onPointerDown(pointer('touch'));
      result.current.handlers.onPointerUp();
    });

    act(() => {
      vi.advanceTimersByTime(CLICKLESS_GESTURE_FALLBACK - 1);
    });
    expect(result.current.activation).toBeNull();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current.activation).toEqual({ type: 'pointer', clicked: false });
  });

  it('a pointerdown defers a scheduled hover mount until the gesture completes', () => {
    const { result } = renderHook(() => useLazyActivation());

    // hover schedules a mount ...
    act(() => {
      result.current.handlers.onPointerEnter(pointer('mouse'));
    });
    // ... but a press arrives before it fires and cancels it
    act(() => {
      result.current.handlers.onPointerDown(pointer('mouse'));
      vi.advanceTimersByTime(0);
    });
    expect(result.current.activation).toBeNull();

    // the mount happens once the gesture ends with a click
    act(() => {
      result.current.handlers.onClick();
      vi.advanceTimersByTime(0);
    });
    expect(result.current.activation).toEqual({ type: 'pointer', clicked: true });
  });

  it('mounts only once — later gestures do not change the activation', () => {
    const { result } = renderHook(() => useLazyActivation());

    act(() => {
      result.current.handlers.onPointerEnter(pointer('mouse'));
      vi.advanceTimersByTime(0);
    });
    expect(result.current.activation).toEqual({ type: 'pointer', clicked: false });

    act(() => {
      result.current.handlers.onClick();
      vi.advanceTimersByTime(0);
    });
    // still the original pointer activation, not overwritten with clicked: true
    expect(result.current.activation).toEqual({ type: 'pointer', clicked: false });
  });
});
