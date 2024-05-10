import type { FormSubmitResult, FormSubmitResultGrouped, FormSubmitResultItemGrouped } from './types';

const tagIdentity = (tag: FormSubmitResultItemGrouped['tags'][number]) => tag.name + ':' + tag.tagType;

export function groupSubmitResult(data: FormSubmitResult): FormSubmitResultGrouped {
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
    const existingItem = items.find(({ error, tags }) => error === item.error &&
        tags.length === item.tags.length && tags.every(tagIdentity),
    );
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
    items,
  };
}
