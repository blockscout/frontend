// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { ExternalChain } from 'src/shared/external-chains/types';

import SpriteIcon from 'src/sprite/SpriteIcon';

import type { ImageProps } from 'src/toolkit/chakra/image';
import { Image } from 'src/toolkit/chakra/image';
import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { Tooltip } from 'src/toolkit/chakra/tooltip';

import getChainTooltipText from './get-chain-tooltip-text';

interface Props extends ImageProps {
  data: Omit<ExternalChain, 'explorer_url'> | undefined;
  isLoading?: boolean;
  noTooltip?: boolean;
}

const ChainIcon = ({ data, boxSize = 5, borderRadius = 'none', isLoading, noTooltip, ...rest }: Props) => {
  if (isLoading) {
    return <Skeleton boxSize={ boxSize } borderRadius={ borderRadius === 'none' ? 'full' : borderRadius } { ...rest } loading/>;
  }

  const placeholder = <SpriteIcon name="networks/icon-placeholder" boxSize={ boxSize } color="icon.primary"/>;
  const content = (
    <Image
      src={ data?.logo }
      boxSize={ boxSize }
      borderRadius={ borderRadius }
      fallback={ placeholder }
      alt={ `${ data?.name || 'Unknown' } chain icon` }
      { ...rest }
    />
  );

  if (!noTooltip) {
    return (
      <Tooltip content={ getChainTooltipText(data) }>
        { content }
      </Tooltip>
    );
  }

  return content;
};

export default React.memo(ChainIcon);
