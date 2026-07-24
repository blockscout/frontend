// SPDX-License-Identifier: LicenseRef-Blockscout

import { ImageData, getNounData, getNounSeedFromBlockHash } from '@nouns/assets';
import { buildSVG } from '@nouns/sdk';
import CryptoJS from 'crypto-js';
import React from 'react';

import { Image } from 'src/toolkit/chakra/image';

const { palette } = ImageData;

interface Props {
  hash: string;
  size: number;
}

const MAGIC_HASH = '0xAC1CA184579A254E4F289319E42FF4A67BF5698AD26C6E7C68769D0D21FAFCB1';

// analog of getNumberFromString from deleted @cloudnoun package
export const getNumberFromString = (input: string): number => {
  const str = input.trim();
  if (!str) return 0;

  const combined = [
    str,
    CryptoJS.MD5(str).toString(CryptoJS.enc.Hex),
    CryptoJS.SHA1(str).toString(CryptoJS.enc.Base64),
    CryptoJS.SHA256(str).toString(CryptoJS.enc.Hex),
    CryptoJS.SHA512(str).toString(CryptoJS.enc.Base64),
    CryptoJS.RIPEMD160(str).toString(CryptoJS.enc.Base64),
  ].join('');

  let sum = 0;
  for (let i = 0; i < combined.length; i++) {
    sum += combined.charCodeAt(i);
  }
  return sum * str.length;
};

// Generating the icon runs 5 crypto hashes and builds an SVG, which adds up when a table
// mounts ~100 identicons at once (and the same address often repeats many times on a page),
// so we cache the result by address; the SVG does not depend on the rendered size.
// The number of distinct addresses viewed in an SPA session is unbounded, so the cache is
// capped with LRU eviction — list pages re-render their rows (socket updates), which keeps
// the current page's addresses fresh while old pages' entries age out.
const CACHE_MAX_SIZE = 500;
const svgDataCache = new Map<string, string>();

const getSvgData = (hash: string): string => {
  const cached = svgDataCache.get(hash);
  if (cached !== undefined) {
    // re-insert to mark the entry as recently used (Map preserves insertion order)
    svgDataCache.delete(hash);
    svgDataCache.set(hash, cached);
    return cached;
  }

  const id = getNumberFromString(hash);
  const seed = getNounSeedFromBlockHash(id, MAGIC_HASH);

  const { parts, background } = getNounData(seed);
  const svg = buildSVG(parts, palette, background);
  const svgData = btoa(svg);

  if (svgDataCache.size >= CACHE_MAX_SIZE) {
    const leastRecentlyUsedKey = svgDataCache.keys().next().value;
    if (leastRecentlyUsedKey !== undefined) {
      svgDataCache.delete(leastRecentlyUsedKey);
    }
  }
  svgDataCache.set(hash, svgData);
  return svgData;
};

const AddressIdenticonNouns: React.FC<Props> = ({ hash, size }) => {
  const svgData = getSvgData(hash);
  if (!svgData) {
    return null;
  }

  return (
    <Image
      src={ `data:image/svg+xml;base64,${ svgData }` }
      alt={ `Nouns identicon for ${ hash }` }
      width={ `${ size }px` }
      height={ `${ size }px` }
    />
  );
};

export default React.memo(AddressIdenticonNouns);
