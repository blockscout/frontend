import { ImageData, getNounData, getNounSeedFromBlockHash } from '@nouns/assets';
import { buildSVG } from '@nouns/sdk';
import React from 'react';

import { Image } from 'toolkit/chakra/image';

const { palette } = ImageData;

interface NounsIdenticonProps {
  hash: string;
  size: number;
}

const MAGIC_HASH = '0xAC1CA184579A254E4F289319E42FF4A67BF5698AD26C6E7C68769D0D21FAFCB1';

const getNumberFromString = (str: string) => {
  str = str.trim();
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash) * str.length;
};

const NounsIdenticon: React.FC<NounsIdenticonProps> = ({ hash, size }) => {
  const id = getNumberFromString(hash);
  const seed = getNounSeedFromBlockHash(id, MAGIC_HASH);

  const { parts, background } = getNounData(seed);
  const svg = buildSVG(parts, palette, background);
  const svgData = btoa(svg);
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

export default React.memo(NounsIdenticon);
