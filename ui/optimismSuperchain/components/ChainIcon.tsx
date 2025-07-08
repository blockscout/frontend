import React from 'react';

import type { ChainConfig } from 'types/multichain';

import getIconUrl from 'lib/multichain/getIconUrl';
import type { ImageProps } from 'toolkit/chakra/image';
import { Image } from 'toolkit/chakra/image';

interface Props extends ImageProps {
  data: ChainConfig;
}

const ChainIcon = ({ data, boxSize = 5, borderRadius = 'full', ...rest }: Props) => {
  return <Image src={ getIconUrl(data) } boxSize={ boxSize } borderRadius={ borderRadius } { ...rest }/>;
};

export default React.memo(ChainIcon);
