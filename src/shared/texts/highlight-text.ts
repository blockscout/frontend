// SPDX-License-Identifier: LicenseRef-Blockscout

import { filterXSS } from 'xss';

import escapeRegExp from 'src/shared/texts/escape-reg-exp';

const wrapInMark = (match: string): string => `<mark>${ match }</mark>`;

export default function highlightText(text: string, query: string): string {
  const queryPattern = new RegExp(escapeRegExp(query), 'gi');
  const markedText = text.replaceAll(queryPattern, wrapInMark);

  return filterXSS(markedText);
}
