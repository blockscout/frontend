// SPDX-License-Identifier: LicenseRef-Blockscout

import xss from 'xss';

import escapeRegExp from 'client/shared/text/escape-reg-exp';

export default function highlightText(text: string, query: string) {
  const regex = new RegExp('(' + escapeRegExp(query) + ')', 'gi');
  return xss(text.replace(regex, '<mark>$1</mark>'));
}
