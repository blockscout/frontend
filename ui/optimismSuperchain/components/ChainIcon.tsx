import React from 'react';

import type { ChainConfig } from 'types/multichain';

import getIconUrl from 'lib/multichain/getIconUrl';
import type { ImageProps } from 'toolkit/chakra/image';
import { Image } from 'toolkit/chakra/image';
import { Skeleton } from 'toolkit/chakra/skeleton';

interface Props extends ImageProps {
  data: ChainConfig;
  isLoading?: boolean;
}

const ChainIcon = ({ data, boxSize = 5, borderRadius = 'full', isLoading, ...rest }: Props) => {
  if (isLoading) {
    return <Skeleton boxSize={ boxSize } borderRadius={ borderRadius } { ...rest } loading/>;
  }

  return <Image src={ getIconUrl(data) } boxSize={ boxSize } borderRadius={ borderRadius } { ...rest }/>;
};

export default React.memo(ChainIcon);
