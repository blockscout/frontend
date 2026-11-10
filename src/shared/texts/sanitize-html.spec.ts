import { describe, expect, it } from 'vitest';

import { findDisallowedHtml, sanitizeHtml } from './sanitize-html';

const BANNER = [
  '<p>Example <a href="https://example.com" target="_blank" rel="noopener"><b>Learn more</b></a>',
  '<br /><img src="https://example.com/i.png" alt="i"></p>',
].join('');
const SRCDOC_FRAME = `Hello <iframe srcdoc="<script src='/assets/configs/network_logo.js'></script>"></iframe> world`;
const OVERLAY = [
  '<div style="position:fixed;inset:0;z-index:2147483647">Wallet verification required ',
  '<a href="https://evil.example" onclick="x()">Connect Wallet</a></div>',
].join('');

describe('sanitizeHtml', () => {
  it('keeps text formatting, links and images', () => {
    expect(sanitizeHtml(BANNER)).toBe(BANNER);
  });

  it('removes a frame with its content', () => {
    expect(sanitizeHtml(SRCDOC_FRAME)).toBe('Hello  world');
    expect(sanitizeHtml('<IFRAME/src=https://evil.example></IFRAME>after')).toBe('after');
  });

  it('removes scripts and vector graphics with their content', () => {
    expect(sanitizeHtml('<script>alert(1)</script>tail')).toBe('tail');
    expect(sanitizeHtml('<svg onload="alert(1)"><circle/></svg>after')).toBe('after');
  });

  it('drops inline styles and event handlers but keeps the text', () => {
    expect(sanitizeHtml(OVERLAY)).toBe('<div>Wallet verification required <a href="https://evil.example">Connect Wallet</a></div>');
  });

  it('drops a form but keeps its text', () => {
    expect(sanitizeHtml('<form action="https://evil.example"><input name="pw"><button>Go</button></form>')).toBe('Go');
  });

  it('blanks a javascript: link target', () => {
    expect(sanitizeHtml('<a href="javascript:alert(1)">x</a>')).toBe('<a href>x</a>');
  });
});

describe('findDisallowedHtml', () => {
  it('reports nothing for allowed markup', () => {
    expect(findDisallowedHtml(BANNER)).toEqual([]);
    expect(findDisallowedHtml('plain text')).toEqual([]);
  });

  it('names disallowed tags once, whatever the casing', () => {
    expect(findDisallowedHtml(SRCDOC_FRAME)).toEqual([ '<iframe>' ]);
    expect(findDisallowedHtml('<IFRAME/src=https://evil.example></IFRAME><iframe></iframe>')).toEqual([ '<iframe>' ]);
  });

  it('names an unclosed disallowed tag and ignores a stray closing one', () => {
    expect(findDisallowedHtml('<iframe src="https://evil.example">')).toEqual([ '<iframe>' ]);
    expect(findDisallowedHtml('Hello</iframe>')).toEqual([]);
  });

  it('names disallowed attributes with their tag', () => {
    expect(findDisallowedHtml(OVERLAY)).toEqual([ 'style attribute on <div>', 'onclick attribute on <a>' ]);
  });

  it('names an attribute whose value is rejected', () => {
    expect(findDisallowedHtml('<a href="javascript:alert(1)">x</a>')).toEqual([ 'href attribute value on <a>' ]);
  });

  it('reports nothing for an attribute that is already empty', () => {
    expect(findDisallowedHtml('<a href="">x</a><img src=" " alt="">')).toEqual([]);
  });
});
