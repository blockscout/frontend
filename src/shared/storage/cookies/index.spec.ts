// @vitest-environment jsdom
import Cookies from 'js-cookie';

import { afterEach, describe, expect, it } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

const TRACKED_COOKIES = [ 'app_profile', 'uuid', 'txs_sort' ];

describe('cookies', () => {
  afterEach(() => {
    TRACKED_COOKIES.forEach((name) => Cookies.remove(name));
  });

  it('loads when it is the first module imported, before the app config', async() => {
    await withEnvs(undefined, async() => {
      const cookies = await import('./index');

      expect(cookies.NAMES.APP_PROFILE).toBe('app_profile');
    });
  });

  it('reports private mode to the app config when it is imported before the config', async() => {
    Cookies.set('app_profile', 'private');

    await withEnvs(undefined, async() => {
      await import('./index');
      const { 'default': config } = await import('src/config');

      expect(config.app.isPrivateMode).toBe(true);
    });
  });

  it('writes a cookie outside private mode', async() => {
    await withEnvs(undefined, async() => {
      const cookies = await import('./index');

      cookies.set(cookies.NAMES.UUID, 'some-uuid');

      expect(cookies.get(cookies.NAMES.UUID)).toBe('some-uuid');
    });
  });

  it('does not write a tracking cookie in private mode, and still writes the others', async() => {
    Cookies.set('app_profile', 'private');

    await withEnvs(undefined, async() => {
      const cookies = await import('./index');

      cookies.set(cookies.NAMES.UUID, 'some-uuid');
      cookies.set(cookies.NAMES.TXS_SORT, 'value-desc');

      expect(cookies.get(cookies.NAMES.UUID)).toBeUndefined();
      expect(cookies.get(cookies.NAMES.TXS_SORT)).toBe('value-desc');
    });
  });

  it('marks a cookie secure when the app is served over https', async() => {
    await withEnvs([ [ 'NEXT_PUBLIC_APP_PROTOCOL', 'https' ] ], async() => {
      const cookies = await import('./index');

      expect(cookies.getDefaultAttributes()).toEqual({ path: '/', secure: true });
    });
  });

  it('does not mark a cookie secure when the app is served over http', async() => {
    await withEnvs([ [ 'NEXT_PUBLIC_APP_PROTOCOL', 'http' ] ], async() => {
      const cookies = await import('./index');

      expect(cookies.getDefaultAttributes()).toEqual({ path: '/', secure: false });
    });
  });
});
