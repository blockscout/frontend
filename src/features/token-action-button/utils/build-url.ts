// SPDX-License-Identifier: LicenseRef-Blockscout

export const buildUrl = (url: string): string | undefined => {
  try {
    const urlObj = new URL(url);

    urlObj.searchParams.set('utm_source', 'blockscout');
    urlObj.searchParams.set('utm_medium', 'token');

    return urlObj.toString();
  } catch {
    return undefined;
  }
};
