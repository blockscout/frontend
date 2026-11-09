// SPDX-License-Identifier: LicenseRef-Blockscout

import { FilterXSS, getDefaultWhiteList, safeAttrValue } from 'xss';
import type { IWhiteList } from 'xss';

// Operator-supplied HTML (e.g. NEXT_PUBLIC_MAINTENANCE_ALERT_MESSAGE) is rendered via innerHTML on the app's
// own origin. Markup is limited to text formatting, links and images; no scripts, frames, forms or inline styles.
// A frame is the only way such markup runs JS under the app's CSP (a same-origin `srcdoc` frame loading a script
// from `'self'`), and an inline style lets a banner cover the page with a phishing overlay.
const ALLOWED_TAGS: IWhiteList = {
  ...getDefaultWhiteList(),
  a: [ 'href', 'target', 'title', 'rel' ],
};

const TAGS_STRIPPED_WITH_CONTENT = [ 'script', 'style', 'iframe', 'object', 'embed', 'noscript', 'template', 'svg', 'math' ];

const sanitizer = new FilterXSS({
  whiteList: ALLOWED_TAGS,
  stripIgnoreTag: true,
  stripIgnoreTagBody: TAGS_STRIPPED_WITH_CONTENT,
});

export function sanitizeHtml(html: string): string {
  return sanitizer.process(html);
}

export function findDisallowedHtml(html: string): Array<string> {
  const found = new Set<string>();

  new FilterXSS({
    whiteList: ALLOWED_TAGS,
    onIgnoreTag: (tag, _html, options) => {
      if (!options.isClosing) {
        found.add(`<${ tag.split('/')[0] }>`);
      }
      return '';
    },
    onIgnoreTagAttr: (tag, name) => {
      found.add(`${ name } attribute on <${ tag }>`);
      return '';
    },
    safeAttrValue: (tag, name, value, cssFilter) => {
      const safeValue = safeAttrValue(tag, name, value, cssFilter);
      if (safeValue === '' && value.trim() !== '') {
        found.add(`${ name } attribute value on <${ tag }>`);
      }
      return safeValue;
    },
  }).process(html);

  return Array.from(found);
}
