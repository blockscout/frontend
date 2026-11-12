// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

const CUSTOM_HEADING_FONT: Array<[ string, string ]> = [
  [ 'NEXT_PUBLIC_FONT_FAMILY_HEADING', '{\'name\':\'Custom\',\'url\':\'https://fonts.example.com/css/custom.css\'}' ],
];

describe('custom font', () => {
  it('can load its stylesheet and its font files from the configured host', async() => {
    const policy = await withEnvs(CUSTOM_HEADING_FONT, async() => (await import('./app')).app());

    expect(policy['style-src']).toContain('fonts.example.com');
    expect(policy['font-src']).toContain('fonts.example.com');
  });
});
