// SPDX-License-Identifier: LicenseRef-Blockscout

import xss from 'xss';

import escapeRegExp from 'src/shared/texts/escape-reg-exp';

export default function highlightText(text: string, query: string) {
  const regex = new RegExp('(' + escapeRegExp(query) + ')', 'gi');
  return xss(text.replace(regex, '<mark>$1</mark>'));
}
