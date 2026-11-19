// @vitest-environment jsdom
// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import { SettingsContext } from 'src/shell/top-bar/settings/context';

import { nbsp } from 'src/toolkit/utils/htmlEntities';

import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from 'vitest/lib';

import Time from './Time';

const TIMESTAMP = '2026-11-04T22:51:55.000000Z';
const LOCAL_TIME_ZONE = 'Asia/Dubai';

type Settings = NonNullable<React.ContextType<typeof SettingsContext>>;

const buildSettings = (isLocalTime: boolean): Settings => ({
  addressFormat: 'base16',
  toggleAddressFormat: () => {},
  timeFormat: 'absolute',
  toggleTimeFormat: () => {},
  isLocalTime,
  toggleIsLocalTime: () => {},
  colorTheme: undefined,
  setColorTheme: () => {},
});

const renderTime = (format: string | undefined, isLocalTime: boolean): string | null => {
  render(
    <SettingsContext.Provider value={ buildSettings(isLocalTime) }>
      <Time timestamp={ TIMESTAMP } format={ format } data-testid="time"/>
    </SettingsContext.Provider>,
  );

  return screen.getByTestId('time').textContent;
};

describe('Time', () => {
  afterEach(cleanup);

  describe('with the UTC setting', () => {
    it.each([
      [ 'date_only', 'Nov 04 2026' ],
      [ 'time_only', '22:51:55' ],
      [ 'utc_offset', `(+00:00${ nbsp }UTC)` ],
      [ 'lll_s', 'Nov 4, 2026 22:51:55' ],
      [ undefined, 'Nov 4, 2026 22:51' ],
      [ 'DD MMM, HH:mm:ss', '04 Nov, 22:51:55' ],
    ])('formats %s', (format, expected) => {
      vi.stubEnv('TZ', LOCAL_TIME_ZONE);

      expect(renderTime(format, false)).toBe(expected);
    });
  });

  describe('with the local-time setting', () => {
    it.each([
      [ 'date_only', 'Nov 05 2026' ],
      [ 'time_only', '02:51:55' ],
      [ 'utc_offset', `(+04:00${ nbsp }UTC)` ],
      [ 'lll_s', 'Nov 5, 2026 2:51:55' ],
      [ undefined, 'Nov 5, 2026 2:51' ],
      [ 'DD MMM, HH:mm:ss', '05 Nov, 02:51:55' ],
    ])('formats %s', (format, expected) => {
      vi.stubEnv('TZ', LOCAL_TIME_ZONE);

      expect(renderTime(format, true)).toBe(expected);
    });
  });
});
