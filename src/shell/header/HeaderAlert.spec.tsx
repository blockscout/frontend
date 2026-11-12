// @vitest-environment jsdom

import mixpanel from 'mixpanel-browser';
import React from 'react';

import type { MockInstance } from 'vitest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

const LINK = 'https://example.com/campaign?utm_source=blockscout#details';
const HTML = [
  '<p>Example campaign ',
  `<a href="${ LINK }" target="_blank"><span>Learn more</span></a>`,
  '<a href="/apps" target="_blank">Open apps</a>',
  '<a>More info</a>',
  '</p>',
].join('');

type Target = 'link' | 'span' | 'relativeLink' | 'text' | 'anchor';

let track: MockInstance<typeof mixpanel.track>;

beforeEach(() => {
  vi.spyOn(mixpanel, 'init').mockImplementation(() => undefined);
  track = vi.spyOn(mixpanel, 'track').mockImplementation(() => undefined);
  vi.spyOn(mixpanel, 'register').mockImplementation(() => undefined);
  vi.spyOn(mixpanel, 'identify').mockImplementation(() => undefined);
  // the real `init` is what creates the `people` slot
  Object.defineProperty(mixpanel, 'people', { configurable: true, value: { set: vi.fn(), set_once: vi.fn() } });
});

afterEach(() => {
  Reflect.deleteProperty(mixpanel, 'people');
});

interface Click {
  readonly target: Target;
  readonly type: 'click' | 'auxclick';
  readonly button: number;
  readonly isInsideOuterLink: boolean;
}

const clickInBanner = async({ target, type, button, isInsideOuterLink }: Click): Promise<MouseEvent> => {
  const event = new MouseEvent(type, { bubbles: true, cancelable: true, button });

  await withEnvs([
    [ 'NEXT_PUBLIC_MAINTENANCE_ALERT_MESSAGE', HTML ],
    [ 'NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN', 'test-token' ],
    [ 'NEXT_PUBLIC_HIDE_INDEXING_ALERT_BLOCKS', 'true' ],
  ], async() => {
    const { render, screen, fireEvent } = await import('vitest/lib');
    const { 'default': HeaderAlert } = await import('./HeaderAlert');
    const analytics = await import('src/shared/analytics');

    const Harness = () => {
      const isInitialized = analytics.useInit();
      return (
        <>
          <span>{ isInitialized ? 'analytics ready' : 'analytics pending' }</span>
          { isInsideOuterLink ? <a href="https://example.com/outer"><HeaderAlert/></a> : <HeaderAlert/> }
        </>
      );
    };

    const view = render(<Harness/>);
    try {
      await screen.findByText('analytics ready');
      track.mockClear();

      const elements: Record<Target, HTMLElement> = {
        link: screen.getByRole('link', { name: 'Learn more' }),
        span: screen.getByText('Learn more'),
        relativeLink: screen.getByRole('link', { name: 'Open apps' }),
        text: screen.getByText('Example campaign'),
        anchor: screen.getByText('More info'),
      };
      fireEvent(elements[target], event);
    } finally {
      view.unmount();
    }
  });

  return event;
};

describe('header banner link tracking', () => {
  it.each([
    { target: 'link', type: 'click', button: 0, loggedLink: LINK },
    { target: 'span', type: 'click', button: 0, loggedLink: LINK },
    { target: 'span', type: 'auxclick', button: 1, loggedLink: LINK },
    { target: 'relativeLink', type: 'click', button: 0, loggedLink: 'http://localhost:3000/apps' },
  ] as const)('tracks $type with button $button on $target as $loggedLink', async({ loggedLink, ...click }) => {
    const event = await clickInBanner({ ...click, isInsideOuterLink: false });

    expect(event.defaultPrevented).toBe(false);
    expect(track).toHaveBeenCalledTimes(1);
    expect(track.mock.calls[0].slice(0, 2)).toEqual([ 'Promo banner', { Source: 'Header', Link: loggedLink } ]);
  });

  it.each([
    { target: 'span', type: 'auxclick', button: 2 },
    { target: 'text', type: 'click', button: 0 },
    { target: 'anchor', type: 'click', button: 0 },
  ] as const)('ignores $type with button $button on $target', async(click) => {
    const event = await clickInBanner({ ...click, isInsideOuterLink: false });

    expect(event.defaultPrevented).toBe(false);
    expect(track).not.toHaveBeenCalled();
  });

  it('ignores a click on banner text when the link is outside the banner', async() => {
    const event = await clickInBanner({ target: 'text', type: 'click', button: 0, isInsideOuterLink: true });

    expect(event.defaultPrevented).toBe(false);
    expect(track).not.toHaveBeenCalled();
  });
});

describe('header banner markup', () => {
  it('renders the banner text and links without frames, inline styles or event handlers', async() => {
    await withEnvs([
      [ 'NEXT_PUBLIC_MAINTENANCE_ALERT_MESSAGE', [
        '<div style="position:fixed;inset:0">Wallet verification required ',
        '<a href="https://example.com" onclick="steal()">Connect</a>',
        '<iframe srcdoc="<script src=/assets/configs/network_logo.js></script>"></iframe></div>',
      ].join('') ],
      [ 'NEXT_PUBLIC_HIDE_INDEXING_ALERT_BLOCKS', 'true' ],
    ], async() => {
      const { render, screen } = await import('vitest/lib');
      const { 'default': HeaderAlert } = await import('./HeaderAlert');

      const view = render(<HeaderAlert/>);
      try {
        const link = screen.getByRole('link', { name: 'Connect' });
        const text = screen.getByText('Wallet verification required');

        expect(link.getAttribute('href')).toBe('https://example.com');
        expect(link.hasAttribute('onclick')).toBe(false);
        expect(text.hasAttribute('style')).toBe(false);
        expect(view.container.querySelector('iframe')).toBeNull();
      } finally {
        view.unmount();
      }
    });
  });
});
