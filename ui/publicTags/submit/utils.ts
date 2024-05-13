import _isEqual from 'lodash/isEqual';

import type { FormSubmitResult, FormSubmitResultGrouped, FormSubmitResultItemGrouped } from './types';

import type { Route } from 'nextjs-routes';

import getQueryParamString from 'lib/router/getQueryParamString';

export function groupSubmitResult(data: FormSubmitResult | undefined): FormSubmitResultGrouped | undefined {
  if (!data) {
    return;
  }

  const _items: Array<FormSubmitResultItemGrouped> = [];

  // group by error and address
  for (const item of data) {
    const existingItem = _items.find(({ error, addresses }) => error === item.error && addresses.length === 1 && addresses[0] === item.payload.address);
    if (existingItem) {
      existingItem.tags.push({ name: item.payload.name, tagType: item.payload.tagType, meta: item.payload.meta });
      continue;
    }

    _items.push({
      error: item.error,
      addresses: [ item.payload.address ],
      tags: [ { name: item.payload.name, tagType: item.payload.tagType, meta: item.payload.meta } ],
    });
  }

  const items: Array<FormSubmitResultItemGrouped> = [];

  // merge items with the same error and tags
  for (const item of _items) {
    const existingItem = items.find(({ error, tags }) => error === item.error && _isEqual(tags, item.tags));
    if (existingItem) {
      existingItem.addresses.push(...item.addresses);
      continue;
    }

    items.push(item);
  }

  return {
    requesterName: data[0].payload.requesterName,
    requesterEmail: data[0].payload.requesterEmail,
    companyName: data[0].payload.companyName,
    companyWebsite: data[0].payload.companyWebsite,
    items: items.sort((a, b) => {
      if (a.error && !b.error) {
        return 1;
      }
      if (!a.error && b.error) {
        return -1;
      }
      return 0;
    }),
  };
}

export function getDefaultValuesFromQuery(query: Route['query']) {
  return {
    addresses: getAddressesFromQuery(query),
    requesterName: getQueryParamString(query?.requesterName),
    requesterEmail: getQueryParamString(query?.requesterEmail),
    companyName: getQueryParamString(query?.companyName),
    companyWebsite: getQueryParamString(query?.companyWebsite),
    tags: [ { name: '', type: { label: 'name', value: 'name' as const } } ],
  };
}

function getAddressesFromQuery(query: Route['query']) {
  if (!query?.addresses) {
    return [ { hash: '' } ];
  }

  if (Array.isArray(query.addresses)) {
    return query.addresses.map((hash) => ({ hash }));
  }

  return [ { hash: query.addresses } ];
}
