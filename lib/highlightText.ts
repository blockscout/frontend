import xss from 'xss';

import escapeRegExp from 'lib/escapeRegExp';

export default function highlightText(text: string, query: string) {
  const regex = new RegExp('(' + escapeRegExp(query) + ')', 'i');
  return xss(text.replace(regex, '<mark>$1</mark>'));
}
