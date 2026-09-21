// @vitest-environment jsdom

import React from 'react';

import { describe, expect, it, vi } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

const sdk = vi.hoisted(() => ({
  init: vi.fn(),
  track: vi.fn(),
  register: vi.fn(),
  identify: vi.fn(),
  people: { set: vi.fn(), set_once: vi.fn() },
}));
vi.mock('mixpanel-browser', () => ({ 'default': sdk }));

const LINK = 'https://example.com/campaign?utm_source=blockscout#details';
const HTML = [
  '<p>Example campaign ',
  `<a href="${ LINK }" target="_blank"><span>Learn more</span></a>`,
  '<a href="/apps" target="_blank">Open apps</a>',
  '<a>More info</a>',
  '</p>',
].join('');

type Target = 'link' | 'span' | 'relativeLink' | 'text' | 'anchor';

interface Click {
  readonly target: Target;
  readonly type: 'click' | 'auxclick';
  readonly button: number;
}

const clickInBanner = async({ target, type, button }: Click): Promise<MouseEvent> => {
  const event = new MouseEvent(type, { bubbles: true, cancelable: true, button });

  await withEnvs([
    [ 'NEXT_PUBLIC_MAINTENANCE_ALERT_MESSAGE', HTML ],
    [ 'NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN', 'test-token' ],
    [ 'NEXT_PUBLIC_HIDE_INDEXING_ALERT_BLOCKS', 'true' ],
  ], async() => {
    const { render, screen, fireEvent } = await import('vitest/lib');
    const { 'default': HeaderAlert } = await import('./HeaderAlert');
    const mixpanel = await import('src/services/mixpanel');

    const Harness = () => {
      const isInitialized = mixpanel.useInit();
      return (
        <>
          <span>{ isInitialized ? 'mixpanel ready' : 'mixpanel pending' }</span>
          <HeaderAlert/>
        </>
      );
    };

    const view = render(<Harness/>);
    try {
      await screen.findByText('mixpanel ready');
      sdk.track.mockClear();

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
    const event = await clickInBanner(click);

    expect(event.defaultPrevented).toBe(false);
    expect(sdk.track).toHaveBeenCalledTimes(1);
    expect(sdk.track.mock.calls[0].slice(0, 2)).toEqual([ 'Promo banner', { Source: 'Header', Link: loggedLink } ]);
  });

  it.each([
    { target: 'span', type: 'auxclick', button: 2 },
    { target: 'text', type: 'click', button: 0 },
    { target: 'anchor', type: 'click', button: 0 },
  ] as const)('ignores $type with button $button on $target', async(click) => {
    const event = await clickInBanner(click);

    expect(event.defaultPrevented).toBe(false);
    expect(sdk.track).not.toHaveBeenCalled();
  });
});
