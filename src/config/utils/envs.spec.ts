// SPDX-License-Identifier: LicenseRef-Blockscout

import { execFileSync } from 'node:child_process';
import path from 'node:path';

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
    expect(buildExternalAssetFilePath('NEXT_PUBLIC_NETWORK_LOGO', 'https://example.com/logo.svg/'))
      .toBe('/assets/configs/network_logo');
    expect(buildExternalAssetFilePath('NEXT_PUBLIC_NETWORK_LOGO', 'https://example.com'))
      .toBe('/assets/configs/network_logo');
    expect(buildExternalAssetFilePath('NEXT_PUBLIC_NETWORK_LOGO', 'https://example.com/file.foo-bar'))
      .toBe('/assets/configs/network_logo');
  });

  it('lowercases the extension', () => {
    expect(buildExternalAssetFilePath('NEXT_PUBLIC_NETWORK_ICON', 'https://example.com/Icon.PNG'))
      .toBe('/assets/configs/network_icon.png');
  });

  it('supports file:// URLs and an uppercase scheme', () => {
    expect(buildExternalAssetFilePath('NEXT_PUBLIC_FOOTER_LINKS', 'file:///opt/links.json'))
      .toBe('/assets/configs/footer_links.json');
    expect(buildExternalAssetFilePath('NEXT_PUBLIC_NETWORK_LOGO', 'HTTPS://example.com/logo.svg'))
      .toBe('/assets/configs/network_logo.svg');
  });

  it('treats a raw JSON value as a json file', () => {
    expect(buildExternalAssetFilePath('NEXT_PUBLIC_FEATURED_NETWORKS', '[{"title":"Foo"}]'))
      .toBe('/assets/configs/featured_networks.json');
  });

  it('returns undefined for a value that is neither a URL nor JSON', () => {
    expect(buildExternalAssetFilePath('NEXT_PUBLIC_FEATURED_NETWORKS', 'not a url')).toBeUndefined();
  });
});

// The container entrypoint saves every asset under the name computed by get_target_filename() in
// deploy/scripts/download_assets.sh; the app then requests the path from buildExternalAssetFilePath().
// Both must produce the same file name for every value, otherwise the asset silently 404s.
describe('parity with deploy/scripts/download_assets.sh', () => {
  const SCRIPT = path.resolve(__dirname, '../../../deploy/scripts/download_assets.sh');

  const getTargetFilename = (envName: string, value: string) => {
    const bash = [
      `source <(sed -n '/^is_url()/,/^}/p; /^get_target_filename()/,/^}/p' "$SCRIPT")`,
      `get_target_filename "${ envName }"`,
    ].join('\n');
    // eslint-disable-next-line no-restricted-properties -- bash needs PATH; this is not an app env read
    const env = { ...process.env, SCRIPT, [envName]: value };
    return execFileSync('bash', [ '-c', bash ], { env, encoding: 'utf8' }).trim();
  };

  const cases: Array<[ string, string ]> = [
    [ 'NEXT_PUBLIC_NETWORK_LOGO', 'https://example.com/images/logo.svg' ],
    [ 'NEXT_PUBLIC_NETWORK_LOGO', 'https://imagedelivery.net/abc/390b3c31-7286/public' ],
    [ 'NEXT_PUBLIC_NETWORK_LOGO', 'https://example.com/logo.svg/' ],
    [ 'NEXT_PUBLIC_NETWORK_LOGO', 'https://example.com' ],
    [ 'NEXT_PUBLIC_NETWORK_LOGO', 'https://example.com/' ],
    [ 'NEXT_PUBLIC_NETWORK_LOGO', 'https://example.com/file.foo-bar' ],
    [ 'NEXT_PUBLIC_NETWORK_LOGO', 'HTTPS://example.com/logo.svg' ],
    [ 'NEXT_PUBLIC_NETWORK_LOGO', 'ftp://example.com/logo.svg' ],
    [ 'NEXT_PUBLIC_NETWORK_ICON', 'https://example.com/Icon.PNG?x=1' ],
    [ 'NEXT_PUBLIC_OG_IMAGE_URL', 'https://example.com/v1.2/og#frag' ],
    [ 'NEXT_PUBLIC_MARKETPLACE_CONFIG_URL', 'https://example.com/config.json?v=2' ],
    [ 'NEXT_PUBLIC_FOOTER_LINKS', 'file:///opt/links.json' ],
    [ 'NEXT_PUBLIC_FEATURED_NETWORKS', '[{"title":"Foo"}]' ],
  ];

  it.each(cases)('%s=%s', (envName, value) => {
    expect(buildExternalAssetFilePath(envName, value)).toBe(`/assets/configs/${ getTargetFilename(envName, value) }`);
  });
});
