import escapeRegExp from 'lib/escapeRegExp';

export default function highlightText(text: string, query: string) {
  const regex = new RegExp('(' + escapeRegExp(query) + ')', 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}
