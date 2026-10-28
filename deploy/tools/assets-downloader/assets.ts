// SPDX-License-Identifier: LicenseRef-Blockscout

export type AssetKind = 'json-array' | 'json-object' | 'image' | 'html';

export interface AssetEnv {
  readonly envName: string;
  readonly kind: AssetKind;
}

export const ASSET_ENVS: ReadonlyArray<AssetEnv> = [
  { envName: 'NEXT_PUBLIC_MARKETPLACE_CONFIG_URL', kind: 'json-array' },
  { envName: 'NEXT_PUBLIC_MARKETPLACE_CATEGORIES_URL', kind: 'json-array' },
  { envName: 'NEXT_PUBLIC_MARKETPLACE_BANNER_CONTENT_URL', kind: 'html' },
  { envName: 'NEXT_PUBLIC_MARKETPLACE_GRAPH_LINKS_URL', kind: 'json-object' },
  { envName: 'NEXT_PUBLIC_FEATURED_NETWORKS', kind: 'json-array' },
  { envName: 'NEXT_PUBLIC_FOOTER_LINKS', kind: 'json-array' },
  { envName: 'NEXT_PUBLIC_NETWORK_LOGO', kind: 'image' },
  { envName: 'NEXT_PUBLIC_NETWORK_LOGO_DARK', kind: 'image' },
  { envName: 'NEXT_PUBLIC_NETWORK_ICON', kind: 'image' },
  { envName: 'NEXT_PUBLIC_NETWORK_ICON_DARK', kind: 'image' },
  { envName: 'NEXT_PUBLIC_OG_IMAGE_URL', kind: 'image' },
  { envName: 'NEXT_PUBLIC_ADDRESS_3RD_PARTY_WIDGETS_CONFIG_URL', kind: 'json-object' },
  { envName: 'NEXT_PUBLIC_ZETACHAIN_SERVICE_CHAINS_CONFIG_URL', kind: 'json-array' },
  { envName: 'NEXT_PUBLIC_HOMEPAGE_HIGHLIGHTS_CONFIG', kind: 'json-array' },
];
