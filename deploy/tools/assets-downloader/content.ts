// SPDX-License-Identifier: LicenseRef-Blockscout

import type { AssetKind } from './assets';

export type ImageType = 'svg' | 'png' | 'jpeg' | 'gif' | 'webp' | 'ico' | 'avif';

export type ContentCheck = { readonly ok: true } | { readonly ok: false; readonly reason: string };

const IMAGE_TYPE_BY_EXTENSION: Readonly<Record<string, ImageType>> = {
  svg: 'svg',
  png: 'png',
  jpg: 'jpeg',
  jpeg: 'jpeg',
  gif: 'gif',
  webp: 'webp',
  ico: 'ico',
  avif: 'avif',
};

const SUPPORTED_IMAGES = 'svg, png, jpg, jpeg, gif, webp, ico, avif';

const PNG_SIGNATURE = '\x89PNG\r\n\x1a\n';
const JPEG_SIGNATURE = '\xff\xd8\xff';
const ICO_SIGNATURE = '\x00\x00\x01\x00';
const SVG_SNIFF_LENGTH = 1024;

const startsWith = (buffer: Buffer, signature: string, offset = 0): boolean => {
  const expected = Buffer.from(signature, 'latin1');
  return buffer.subarray(offset, offset + expected.length).equals(expected);
};

const SVG_PREAMBLE = /^(?:\s|<\?xml[\s\S]*?\?>|<!--[\s\S]*?-->|<!DOCTYPE[\s\S]*?>)*/i;
const SVG_ROOT_TAG = /^<svg[\s>/]/i;

const isSvg = (buffer: Buffer): boolean => {
  const head = buffer.subarray(0, SVG_SNIFF_LENGTH).toString('utf8').replace(SVG_PREAMBLE, '');
  return SVG_ROOT_TAG.test(head);
};

const AVIF_BRANDS: ReadonlySet<string> = new Set([ 'avif', 'avis' ]);
const FTYP_BOX_TYPE_OFFSET = 4;
const FTYP_MAJOR_BRAND_OFFSET = 8;
const FTYP_COMPATIBLE_BRANDS_OFFSET = 16;
const BRAND_LENGTH = 4;

const ftypBrands = (buffer: Buffer): Array<string> => {
  if (!startsWith(buffer, 'ftyp', FTYP_BOX_TYPE_OFFSET)) {
    return [];
  }
  const boxEnd = Math.min(buffer.length, buffer.readUInt32BE(0) || buffer.length);
  const brand = (offset: number) => buffer.subarray(offset, offset + BRAND_LENGTH).toString('latin1');
  const brands = [ brand(FTYP_MAJOR_BRAND_OFFSET) ];
  for (let offset = FTYP_COMPATIBLE_BRANDS_OFFSET; offset + BRAND_LENGTH <= boxEnd; offset += BRAND_LENGTH) {
    brands.push(brand(offset));
  }
  return brands;
};

const isAvif = (buffer: Buffer): boolean => ftypBrands(buffer).some((brand) => AVIF_BRANDS.has(brand));

export function detectImageType(buffer: Buffer): ImageType | undefined {
  if (startsWith(buffer, PNG_SIGNATURE)) {
    return 'png';
  }
  if (startsWith(buffer, JPEG_SIGNATURE)) {
    return 'jpeg';
  }
  if (startsWith(buffer, 'GIF87a') || startsWith(buffer, 'GIF89a')) {
    return 'gif';
  }
  if (startsWith(buffer, 'RIFF') && startsWith(buffer, 'WEBP', 8)) {
    return 'webp';
  }
  if (isAvif(buffer)) {
    return 'avif';
  }
  if (startsWith(buffer, ICO_SIGNATURE)) {
    return 'ico';
  }
  if (isSvg(buffer)) {
    return 'svg';
  }
  return undefined;
}

type ParsedJson = { readonly ok: true; readonly value: unknown } | { readonly ok: false };

const parseJson = (buffer: Buffer): ParsedJson => {
  try {
    return { ok: true, value: JSON.parse(buffer.toString('utf8')) };
  } catch {
    return { ok: false };
  }
};

const fail = (reason: string): ContentCheck => ({ ok: false, reason });
const PASS: ContentCheck = { ok: true };

function checkJson(buffer: Buffer, expected: 'array' | 'object'): ContentCheck {
  const parsed = parseJson(buffer);
  if (!parsed.ok) {
    return fail('content is not valid JSON');
  }
  const isArray = Array.isArray(parsed.value);
  const isObject = typeof parsed.value === 'object' && parsed.value !== null && !isArray;
  if (expected === 'array' && !isArray) {
    return fail('content is not a JSON array');
  }
  if (expected === 'object' && !isObject) {
    return fail('content is not a JSON object');
  }
  return PASS;
}

function checkImage(buffer: Buffer, fileExtension: string | undefined): ContentCheck {
  const detected = detectImageType(buffer);
  if (!detected) {
    return fail(`content is not a supported image (${ SUPPORTED_IMAGES })`);
  }
  if (fileExtension === undefined) {
    return PASS;
  }
  const expected = IMAGE_TYPE_BY_EXTENSION[fileExtension];
  if (expected === undefined) {
    return fail(`".${ fileExtension }" is not a supported image extension (${ SUPPORTED_IMAGES })`);
  }
  if (expected !== detected) {
    return fail(`content is a ${ detected } image but the URL points to a ".${ fileExtension }" file`);
  }
  return PASS;
}

export function checkAssetContent(kind: AssetKind, buffer: Buffer, fileExtension: string | undefined): ContentCheck {
  switch (kind) {
    case 'json-array':
      return checkJson(buffer, 'array');
    case 'json-object':
      return checkJson(buffer, 'object');
    case 'image':
      return checkImage(buffer, fileExtension);
    case 'html':
      return PASS;
  }
}
