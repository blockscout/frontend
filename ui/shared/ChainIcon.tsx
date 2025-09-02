import { Box } from '@chakra-ui/react';
import React from 'react';

import type { CrossChainInfo } from 'types/client/crossChainInfo';

import { Image } from 'toolkit/chakra/image';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tooltip } from 'toolkit/chakra/tooltip';
import IconSvg from 'ui/shared/IconSvg';

type Props = {
  chain?: CrossChainInfo;
  boxSize?: number;
  isLoading?: boolean;
};

const Placeholder = ({ boxSize }: { boxSize: number }) => {
  return (
    <IconSvg
      name="networks/icon-placeholder"
      boxSize={ boxSize }
      color="text.secondary"
    />
  );
};

Placeholder.displayName = 'Placeholder';

const ChainIcon = ({ chain, boxSize = 5, isLoading }: Props) => {
  if (isLoading) {
    return <Skeleton boxSize={ boxSize } borderRadius="full" loading={ isLoading }/>;
  }
  return (
    <Tooltip content={ `${ chain?.chain_name || 'Unknown chain' } (chain id: ${ chain?.chain_id || 'Unknown' })` }>
      <Box>
        { chain?.chain_logo ?
          <Image src={ chain.chain_logo } boxSize={ boxSize } fallback={ <Placeholder boxSize={ boxSize }/> }/> :
          <Placeholder boxSize={ boxSize }/>
        }
      </Box>
    </Tooltip>
  );
};

export default ChainIcon;
