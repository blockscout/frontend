import React from 'react';

import type { ChainConfig } from 'types/multichain';

import getChainTooltipText from 'lib/multichain/getChainTooltipText';
import getIconUrl from 'lib/multichain/getIconUrl';
import type { ImageProps } from 'toolkit/chakra/image';
import { Image } from 'toolkit/chakra/image';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tooltip } from 'toolkit/chakra/tooltip';
import IconSvg from 'ui/shared/IconSvg';

interface Props extends ImageProps {
  data: ChainConfig;
  isLoading?: boolean;
  withTooltip?: boolean;
}

const ChainIcon = ({ data, boxSize = 5, borderRadius = 'full', isLoading, withTooltip, ...rest }: Props) => {
  const placeholder = <IconSvg name="networks/icon-placeholder" boxSize={ boxSize } color="text.secondary"/>;

  const iconUrl = getIconUrl(data);

  const content = (
    <Image
      src={ iconUrl }
      boxSize={ boxSize }
      borderRadius={ borderRadius }
      fallback={ placeholder }
      alt={ `${ data.config.chain.name } chain icon` }
      { ...rest }
    />
  );

  if (isLoading) {
    return <Skeleton boxSize={ boxSize } borderRadius={ borderRadius } { ...rest } loading/>;
  }

  if (withTooltip) {
    return (
      <Tooltip content={ getChainTooltipText(data) }>
        { content }
      </Tooltip>
    );
  }

  return content;
};

export default React.memo(ChainIcon);
