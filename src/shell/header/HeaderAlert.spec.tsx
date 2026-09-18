// @vitest-environment jsdom

import React from 'react';

import { describe, expect, it, vi } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

const sdk = vi.hoisted(() => ({ init: vi.fn(), track: vi.fn() }));
vi.mock('mixpanel-browser', () => ({ 'default': sdk }));

const LINK = 'https://example.com/campaign?utm_source=blockscout#details';
const HTML = `<p>Example campaign <a href="${ LINK }" target="_blank"><span>Learn more</span></a><a>More info</a></p>`;

describe('header banner link tracking', () => {
  it.each([
    { target: 'link', type: 'click', button: 0, expected: 1 },
    { target: 'span', type: 'click', button: 0, expected: 1 },
    { target: 'span', type: 'auxclick', button: 1, expected: 1 },
    { target: 'span', type: 'auxclick', button: 2, expected: 0 },
    { target: 'text', type: 'click', button: 0, expected: 0 },
    { target: 'anchor', type: 'click', button: 0, expected: 0 },
  ])('tracks $target / $type / button $button', async({ target, type, button, expected }) => {
    await withEnvs([
      [ 'NEXT_PUBLIC_MAINTENANCE_ALERT_MESSAGE', HTML ],
      [ 'NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN', 'test-token' ],
      [ 'NEXT_PUBLIC_HIDE_INDEXING_ALERT_BLOCKS', 'true' ],
    ], async() => {
      const { render, screen, fireEvent } = await import('vitest/lib');
      const { 'default': HeaderAlert } = await import('./HeaderAlert');
      const queue = await import('src/services/mixpanel/queue');
      await queue.init('test-token', {}, () => {});
      sdk.track.mockClear();

      const view = render(<HeaderAlert/>);
      try {
        const elements = {
          link: screen.getByRole('link', { name: 'Learn more' }),
          span: screen.getByText('Learn more'),
          text: screen.getByText('Example campaign'),
          anchor: screen.getByText('More info'),
        };
        const event = new MouseEvent(type, { bubbles: true, cancelable: true, button });
        fireEvent(elements[target as keyof typeof elements], event);

        expect(event.defaultPrevented).toBe(false);
        expect(sdk.track).toHaveBeenCalledTimes(expected);
        if (expected) {
          expect(sdk.track.mock.calls[0].slice(0, 2)).toEqual([ 'Promo banner', { Source: 'Header', Link: LINK } ]);
        }
      } finally {
        view.unmount();
      }
    });
  });
});
