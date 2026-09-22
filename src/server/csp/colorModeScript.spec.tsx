// SPDX-License-Identifier: LicenseRef-Blockscout

// @vitest-environment jsdom

import { createHash } from 'node:crypto';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { ColorModeProvider } from 'src/toolkit/chakra/color-mode';

import { describe, expect, it } from 'vitest';

import generateCspPolicy from './generateCspPolicy';

function getColorModeScriptHash(defaultTheme: string | undefined): string | undefined {
  const html = renderToStaticMarkup(<ColorModeProvider defaultTheme={ defaultTheme }/>);
  const script = new DOMParser().parseFromString(html, 'text/html').querySelector('script')?.textContent;

  return script ? `'sha256-${ createHash('sha256').update(script).digest('base64') }'` : undefined;
}

describe('color mode inline script', () => {
  it('guards against a vacuous suite — the provider must render an inline script', () => {
    expect(getColorModeScriptHash('dark')).toBeDefined();
  });

  it.each([ undefined, 'dark', 'light' ])('is allowed by the policy when the default color mode is %s', (defaultTheme) => {
    expect(generateCspPolicy()).toContain(getColorModeScriptHash(defaultTheme));
  });
});
