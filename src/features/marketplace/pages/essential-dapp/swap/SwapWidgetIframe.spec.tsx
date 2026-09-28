// SPDX-License-Identifier: LicenseRef-Blockscout
// @vitest-environment jsdom

import React from 'react';

import { SECOND } from 'src/toolkit/utils/consts';

import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from 'vitest/lib';

import SwapWidgetIframe from './SwapWidgetIframe';

const WIDGET_ORIGIN = 'https://widget.li.fi';
const CONFIG = { integrator: 'blockscout' };

function sendMessage(iframe: HTMLIFrameElement, data: Record<string, unknown>, origin = WIDGET_ORIGIN, source: Window | null = iframe.contentWindow): void {
  act(() => {
    window.dispatchEvent(new MessageEvent('message', { origin, source, data: { source: 'widget-light', ...data } }));
  });
}

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('Swap iframe loading', () => {
  it('keeps the unstyled iframe hidden until its configured page renders', () => {
    const { container } = render(<React.StrictMode><SwapWidgetIframe config={ CONFIG }/></React.StrictMode>);
    const iframe = container.querySelector('iframe')!;
    expect(window.getComputedStyle(iframe).visibility).toBe('hidden');
    expect(iframe.parentElement?.getAttribute('aria-busy')).toBe('true');

    fireEvent.load(iframe);
    sendMessage(iframe, { type: 'READY' });
    expect(window.getComputedStyle(iframe).visibility).toBe('hidden');

    const ready = { type: 'WIDGET_EVENT', event: 'pageEntered', data: '/' };
    sendMessage(iframe, ready, 'https://untrusted.test');
    sendMessage(iframe, ready, WIDGET_ORIGIN, window);
    expect(window.getComputedStyle(iframe).visibility).toBe('hidden');

    sendMessage(iframe, ready);
    expect(window.getComputedStyle(iframe).visibility).toBe('visible');
    expect(iframe.parentElement?.getAttribute('aria-busy')).toBe('false');
  });

  it('keeps an active iframe when its config changes and waits again after leaving the page', () => {
    const { container, rerender, unmount } = render(<SwapWidgetIframe config={ CONFIG }/>);
    const iframe = container.querySelector('iframe')!;
    sendMessage(iframe, { type: 'READY' });
    sendMessage(iframe, { type: 'WIDGET_EVENT', event: 'pageEntered', data: '/' });

    rerender(<SwapWidgetIframe config={{ ...CONFIG, appearance: 'light' }}/>);
    expect(container.querySelector('iframe')).toBe(iframe);
    expect(window.getComputedStyle(iframe).visibility).toBe('visible');
    unmount();

    const nextRender = render(<SwapWidgetIframe config={ CONFIG }/>);
    const nextIframe = nextRender.container.querySelector('iframe')!;
    expect(window.getComputedStyle(nextIframe).visibility).toBe('hidden');
    sendMessage(nextIframe, { type: 'READY' });
    sendMessage(nextIframe, { type: 'WIDGET_EVENT', event: 'pageEntered', data: '/' });
    expect(window.getComputedStyle(nextIframe).visibility).toBe('visible');
  });

  it('offers a fresh attempt when the widget never becomes ready', () => {
    vi.useFakeTimers();
    const { container } = render(<SwapWidgetIframe config={ CONFIG }/>);
    const iframe = container.querySelector('iframe')!;
    const widget = iframe.parentElement!;
    sendMessage(iframe, { type: 'READY' });
    act(() => vi.advanceTimersByTime(30 * SECOND));

    expect(screen.getByRole('alert').textContent).toContain('Unable to load the swap widget');
    expect(container.querySelector('iframe')).toBeNull();
    expect(widget.getAttribute('aria-busy')).toBe('false');
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));

    const nextIframe = container.querySelector('iframe')!;
    expect(nextIframe).not.toBe(iframe);
    expect(window.getComputedStyle(nextIframe).visibility).toBe('hidden');
    expect(screen.queryByRole('alert')).toBeNull();
    sendMessage(iframe, { type: 'WIDGET_EVENT', event: 'pageEntered', data: '/' });
    expect(window.getComputedStyle(nextIframe).visibility).toBe('hidden');
    sendMessage(nextIframe, { type: 'READY' });
    sendMessage(nextIframe, { type: 'WIDGET_EVENT', event: 'pageEntered', data: '/' });
    act(() => vi.advanceTimersByTime(30 * SECOND));
    expect(window.getComputedStyle(nextIframe).visibility).toBe('visible');
    expect(screen.queryByRole('alert')).toBeNull();
  });
});
