import type { NextRouter } from 'next/router';

import getQueryParamString from 'lib/router/getQueryParamString';
import removeQueryParam from 'lib/router/removeQueryParam';

import { getAppUrl } from './utils';

// Mocking the dependencies
jest.mock('lib/router/getQueryParamString');
jest.mock('lib/router/removeQueryParam');

describe('getAppUrl', () => {
  let router: NextRouter;

  beforeEach(() => {
    router = {
      asPath: '/current/path?someParam=value',
      query: {
        url: 'https://example.com/custom-path?query=value',
      },
    } as unknown as NextRouter;
  });

  it('should return undefined if url is undefined', () => {
    const result = getAppUrl(undefined, router);
    expect(result).toBeUndefined();
  });

  it('should return the custom url if origins match', () => {
    (getQueryParamString as jest.Mock).mockReturnValue('https://example.com/custom-path?query=value');
    const result = getAppUrl('https://example.com/app', router);
    expect(result).toBe('https://example.com/custom-path?query=value');
  });

  it('should remove the query param and return original url if origins do not match', () => {
    (getQueryParamString as jest.Mock).mockReturnValue('https://different.com/custom-path?query=value');
    const result = getAppUrl('https://example.com/app', router);
    expect(result).toBe('https://example.com/app?someParam=value');
    expect(removeQueryParam).toHaveBeenCalledWith(router, 'url');
  });

  it('should construct the new url with custom params and hash', () => {
    router.asPath = '/current/path?path=newPath&newParam=newValue#section';
    const result = getAppUrl('https://example.com/app?existingParam=1', router);
    expect(result).toBe('https://example.com/newPath?existingParam=1&newParam=newValue#section');
  });

  it('should handle url without query and hash', () => {
    router.asPath = '/current/path';
    const result = getAppUrl('https://example.com/app', router);
    expect(result).toBe('https://example.com/app');
  });

  it('should handle error in custom url parsing', () => {
    (getQueryParamString as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid URL');
    });
    const result = getAppUrl('https://example.com/app', router);
    expect(result).toBe('https://example.com/app?someParam=value');
  });

  it('should handle error in target url parsing', () => {
    router.asPath = '/current/path?invalidQuery#section';
    const result = getAppUrl('invalid-url', router);
    expect(result).toBe('invalid-url');
  });
});
