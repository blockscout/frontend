// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it } from 'vitest';

import { checkAssetContent, detectImageType } from './content';

const PNG = Buffer.from([ 0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d ]);
const JPEG = Buffer.from([ 0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10 ]);
const GIF = Buffer.from('GIF89a\x01\x00\x01\x00', 'latin1');
const WEBP = Buffer.concat([ Buffer.from('RIFF'), Buffer.from([ 0x24, 0, 0, 0 ]), Buffer.from('WEBP'), Buffer.from('VP8 ') ]);
const AVIF = Buffer.concat([ Buffer.from([ 0, 0, 0, 0x1c ]), Buffer.from('ftypavif'), Buffer.from('mif1') ]);
const ICO = Buffer.from([ 0x00, 0x00, 0x01, 0x00, 0x01, 0x00 ]);
const SVG = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"></svg>');
const SVG_WITH_PROLOGUE = Buffer.from('﻿<?xml version="1.0" encoding="UTF-8"?>\n<!-- logo -->\n<svg xmlns="http://www.w3.org/2000/svg"/>');

describe('detectImageType', () => {
  it.each([
    [ 'png', PNG ],
    [ 'jpeg', JPEG ],
    [ 'gif', GIF ],
    [ 'gif', Buffer.from('GIF87a\x01\x00\x01\x00', 'latin1') ],
    [ 'webp', WEBP ],
    [ 'avif', AVIF ],
    [ 'ico', ICO ],
    [ 'svg', SVG ],
    [ 'svg', SVG_WITH_PROLOGUE ],
  ])('detects %s', (type, buffer) => {
    expect(detectImageType(buffer)).toBe(type);
  });

  it.each([
    [ 'JSON', Buffer.from('{"type":"shamir","sealed":false}') ],
    [ 'HTML', Buffer.from('<!DOCTYPE html><html><body>Moved</body></html>') ],
    [ 'XML without svg', Buffer.from('<?xml version="1.0"?><root/>') ],
    [ 'plain text', Buffer.from('root:x:0:0:root:/root:/bin/sh') ],
    [ 'RIFF container that is not WEBP', Buffer.concat([ Buffer.from('RIFF'), Buffer.from([ 0x24, 0, 0, 0 ]), Buffer.from('WAVE') ]) ],
    [ 'empty', Buffer.alloc(0) ],
  ])('rejects %s', (name, buffer) => {
    expect(detectImageType(buffer)).toBeUndefined();
  });
});

describe('checkAssetContent', () => {
  describe('json-array', () => {
    it('accepts a JSON array', () => {
      expect(checkAssetContent('json-array', Buffer.from('[{"title":"Foo"}]'), 'json')).toEqual({ ok: true });
    });

    it('rejects a JSON object', () => {
      expect(checkAssetContent('json-array', Buffer.from('{"type":"shamir","sealed":false}'), 'json'))
        .toEqual({ ok: false, reason: 'content is not a JSON array' });
    });

    it('rejects invalid JSON', () => {
      expect(checkAssetContent('json-array', Buffer.from('<html>Moved Permanently</html>'), 'json'))
        .toEqual({ ok: false, reason: 'content is not valid JSON' });
    });
  });

  describe('json-object', () => {
    it('accepts a JSON object', () => {
      expect(checkAssetContent('json-object', Buffer.from('{"0x1":[{"title":"a","url":"b"}]}'), 'json')).toEqual({ ok: true });
    });

    it.each([
      [ 'array', '[]' ],
      [ 'null', 'null' ],
      [ 'string', '"text"' ],
    ])('rejects a JSON %s', (name, content) => {
      expect(checkAssetContent('json-object', Buffer.from(content), 'json'))
        .toEqual({ ok: false, reason: 'content is not a JSON object' });
    });
  });

  describe('image', () => {
    it('accepts an image whose type matches the file extension', () => {
      expect(checkAssetContent('image', PNG, 'png')).toEqual({ ok: true });
      expect(checkAssetContent('image', JPEG, 'jpg')).toEqual({ ok: true });
      expect(checkAssetContent('image', JPEG, 'jpeg')).toEqual({ ok: true });
      expect(checkAssetContent('image', SVG, 'svg')).toEqual({ ok: true });
    });

    it('accepts any supported image when the file has no extension', () => {
      expect(checkAssetContent('image', WEBP, undefined)).toEqual({ ok: true });
    });

    it('rejects a non-image', () => {
      expect(checkAssetContent('image', Buffer.from('{"type":"shamir","sealed":false}'), 'svg'))
        .toEqual({ ok: false, reason: 'content is not a supported image (svg, png, jpg, jpeg, gif, webp, ico, avif)' });
    });

    it('rejects an image whose type does not match the file extension', () => {
      expect(checkAssetContent('image', PNG, 'svg'))
        .toEqual({ ok: false, reason: 'content is a png image but the URL points to a ".svg" file' });
    });

    it('rejects an unsupported image extension', () => {
      expect(checkAssetContent('image', PNG, 'bmp'))
        .toEqual({ ok: false, reason: '".bmp" is not a supported image extension (svg, png, jpg, jpeg, gif, webp, ico, avif)' });
    });
  });

  it('accepts anything for html', () => {
    expect(checkAssetContent('html', Buffer.from('<div>banner</div>'), undefined)).toEqual({ ok: true });
    expect(checkAssetContent('html', Buffer.alloc(0), 'html')).toEqual({ ok: true });
  });
});
