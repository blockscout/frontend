// SPDX-License-Identifier: LicenseRef-Blockscout

import type { Query, Url } from './types';

const formatQuery = (query: Query | null | undefined): string => {
  const searchParams = new URLSearchParams();

  Object.entries(query ?? {}).forEach(([ key, value ]) => {
    (Array.isArray(value) ? value : [ value ]).forEach((item) => {
      if (item !== undefined) {
        searchParams.append(key, item);
      }
    });
  });

  return searchParams.toString();
};

const formatHash = (hash: string | undefined): string => {
  if (!hash) {
    return '';
  }

  return hash.startsWith('#') ? hash : `#${ hash }`;
};

export const formatUrl = (url: Url): string => {
  if (typeof url === 'string') {
    return url;
  }

  const search = formatQuery(url.query);

  return `${ url.pathname ?? '' }${ search ? `?${ search }` : '' }${ formatHash(url.hash) }`;
};
