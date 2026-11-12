// Chakra emits one class per style object; the rule text for an element's classes is the only place a style prop lands in jsdom.
export function getCssText(element: Element): string {
  const classes = Array.from(element.classList).filter((name) => name.startsWith('css-'));
  const sheets = Array.from(document.querySelectorAll('style')).map((style) => style.textContent ?? '').join('\n');
  return classes.map((name) => {
    const start = sheets.indexOf(`.${ name }{`);
    return start === -1 ? '' : sheets.slice(start, sheets.indexOf('}', start) + 1);
  }).join('\n');
}
