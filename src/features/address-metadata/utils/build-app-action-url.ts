// SPDX-License-Identifier: LicenseRef-Blockscout

export type AppActionSource = 'Token' | 'NFT collection' | 'NFT item' | 'Txn';

interface Placeholders {
  readonly address: string | undefined;
  readonly chainId: string | undefined;
  readonly txHash: string | undefined;
}

const UTM_MEDIUM: Record<AppActionSource, string> = {
  Token: 'token',
  'NFT collection': 'token',
  'NFT item': 'token',
  Txn: 'tx',
};

export function buildAppActionUrl(template: string, placeholders: Placeholders, source: AppActionSource): string | undefined {
  const substituted = template
    .replaceAll('{address}', placeholders.address?.toLowerCase() ?? '')
    .replaceAll('{chainId}', placeholders.chainId ?? '')
    .replaceAll('{txHash}', placeholders.txHash ?? '');

  try {
    const url = new URL(substituted);
    url.searchParams.set('utm_source', 'blockscout');
    url.searchParams.set('utm_medium', UTM_MEDIUM[source]);
    return url.toString();
  } catch {
    return undefined;
  }
}
