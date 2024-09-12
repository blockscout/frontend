import type { NextRouter } from 'next/router';

import config from 'configs/app';
import getQueryParamString from 'lib/router/getQueryParamString';
import removeQueryParam from 'lib/router/removeQueryParam';
import type { TOption } from 'ui/shared/sort/Option';

const feature = config.features.marketplace;

export type SortValue = 'rating' | 'security_score';

export const SORT_OPTIONS: Array<TOption<SortValue>> = [
  { title: 'Default', id: undefined },
  (feature.isEnabled && feature.rating) && { title: 'Rating', id: 'rating' },
  (feature.isEnabled && feature.securityReportsUrl) && { title: 'Security score', id: 'security_score' },
].filter(Boolean) as Array<TOption<SortValue>>;

export function getAppUrl(url: string | undefined, router: NextRouter) {
  if (!url) {
    return;
  }

  try {
    // get the custom url from the query
    const customUrl = getQueryParamString(router.query.url);

    if (customUrl) {
      const customOrigin = new URL(customUrl).origin;
      const appOrigin = new URL(url).origin;
      if (customOrigin === appOrigin) {
        return customUrl;
      } else {
        removeQueryParam(router, 'url');
      }
    }
  } catch (err) {}

  try {
    // get hash and params (using asPath to avoid conflicts with dynamic route params)
    const [ , queryAndHash ] = router.asPath.split('?');
    const [ queryString, hash ] = queryAndHash ? queryAndHash.split('#') : [ '', '' ];
    const customHash = hash ? `#${ hash }` : '';
    const customParams = new URLSearchParams(queryString);

    // remove reserved params
    [ 'url', 'action' ].forEach((param) => customParams.delete(param));

    if (customParams.toString() || customHash) {
      const targetUrl = new URL(url);
      const targetParams = new URLSearchParams(targetUrl.search);

      let customPath = customParams.get('path');
      if (customPath) {
        customPath = customPath.startsWith('/') ? customPath : `/${ customPath }`;
        targetUrl.pathname = customPath;
        customParams.delete('path');
      }

      customParams.forEach((value, key) => {
        targetParams.append(key, value);
      });

      targetUrl.search = targetParams.toString();
      targetUrl.hash = customHash;
      return targetUrl.toString();
    }
  } catch (err) {}

  return url;
}
