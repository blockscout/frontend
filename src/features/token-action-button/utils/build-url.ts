// SPDX-License-Identifier: LicenseRef-Blockscout

const HASH_PLACEHOLDER = '{hash}';

export const buildUrl = (template: string, tokenHash: string): string | undefined => {
  try {
    // substituted before parsing: the URL parser percent-encodes braces in the path, which would break a later replace
    const urlObj = new URL(template.replaceAll(HASH_PLACEHOLDER, tokenHash.toLowerCase()));

    urlObj.searchParams.set('utm_source', 'blockscout');
    urlObj.searchParams.set('utm_medium', 'token');

    return urlObj.toString();
  } catch {
    return undefined;
  }
};
