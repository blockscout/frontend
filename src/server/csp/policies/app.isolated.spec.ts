// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it } from 'vitest';

// the app config is frozen on first import, so the font has to be set before anything pulls it in
process.env.NEXT_PUBLIC_FONT_FAMILY_HEADING = '{\'name\':\'Custom\',\'url\':\'https://fonts.example.com/css/custom.css\'}';

const { app } = await import('./app');

describe('custom font', () => {
  it('can load its stylesheet and its font files from the configured host', () => {
    const policy = app();

    expect(policy['style-src']).toContain('fonts.example.com');
    expect(policy['font-src']).toContain('fonts.example.com');
  });
});
