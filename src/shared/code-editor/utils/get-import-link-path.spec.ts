// @vitest-environment jsdom
// SPDX-License-Identifier: LicenseRef-Blockscout

import { expect, it } from 'vitest';

import { getImportLinkPath } from './get-import-link-path';

function renderLine(html: string): HTMLElement {
  const line = document.createElement('span');
  line.innerHTML = html;

  return line;
}

const SINGLE_QUOTED_IMPORT = [
  '<span>import</span><span>\'</span>',
  '<span class="import-link">./</span>',
  '<span class="import-link">libraries</span>',
  '<span class="import-link">/</span>',
  '<span class="import-link">Tick</span>',
  '<span class="import-link">.</span>',
  '<span class="import-link">sol</span>',
  '<span>\'</span><span>;</span>',
].join('');

it('reads the path from a single token', () => {
  const line = renderLine('<span>import</span><span class="import-link">./libraries/Tick.sol</span><span>;</span>');

  expect(getImportLinkPath(line.children[1])).toBe('./libraries/Tick.sol');
});

it.each([ 2, 5, 7 ])('joins every token of a split path, whichever one is clicked (token %i)', (tokenIndex) => {
  const line = renderLine(SINGLE_QUOTED_IMPORT);

  expect(getImportLinkPath(line.children[tokenIndex])).toBe('./libraries/Tick.sol');
});

it('does not reach into another import on the same line', () => {
  const line = renderLine([
    '<span class="import-link">./A.sol</span>',
    '<span>; import </span>',
    '<span class="import-link">./</span>',
    '<span class="import-link">B.sol</span>',
  ].join(''));

  expect(getImportLinkPath(line.children[0])).toBe('./A.sol');
  expect(getImportLinkPath(line.children[3])).toBe('./B.sol');
});
