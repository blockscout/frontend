// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it } from 'vitest';

import { buildExternalAssetFilePath } from './envs';

describe('buildExternalAssetFilePath', () => {
  it('derives the file name from the env name and the extension from the URL path', () => {
    expect(buildExternalAssetFilePath('NEXT_PUBLIC_NETWORK_LOGO', 'https://example.com/images/logo.svg'))
      .toBe('/assets/configs/network_logo.svg');
    expect(buildExternalAssetFilePath('NEXT_PUBLIC_MARKETPLACE_CONFIG_URL', 'https://example.com/config.json?v=2'))
      .toBe('/assets/configs/marketplace_config.json');
  });

  it('uses the bare file name when the URL path has no extension', () => {
    expect(buildExternalAssetFilePath('NEXT_PUBLIC_NETWORK_LOGO', 'https://imagedelivery.net/abc/390b3c31-7286/public'))
      .toBe('/assets/configs/network_logo');
    expect(buildExternalAssetFilePath('NEXT_PUBLIC_OG_IMAGE_URL', 'https://example.com/v1.2/og'))
      .toBe('/assets/configs/og_image');
  });

  it('lowercases the extension', () => {
    expect(buildExternalAssetFilePath('NEXT_PUBLIC_NETWORK_ICON', 'https://example.com/Icon.PNG'))
      .toBe('/assets/configs/network_icon.png');
  });

  it('supports file:// URLs', () => {
    expect(buildExternalAssetFilePath('NEXT_PUBLIC_FOOTER_LINKS', 'file:///opt/links.json'))
      .toBe('/assets/configs/footer_links.json');
  });

  it('treats a raw JSON value as a json file', () => {
    expect(buildExternalAssetFilePath('NEXT_PUBLIC_FEATURED_NETWORKS', '[{"title":"Foo"}]'))
      .toBe('/assets/configs/featured_networks.json');
  });

  it('returns undefined for a value that is neither a URL nor JSON', () => {
    expect(buildExternalAssetFilePath('NEXT_PUBLIC_FEATURED_NETWORKS', 'not a url')).toBeUndefined();
  });
});
