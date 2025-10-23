import { Box } from '@chakra-ui/react';
import React from 'react';

// TODO @tom2drum refactor chain icon
import type { ExternalChain } from 'types/externalChains';

import { Image } from 'toolkit/chakra/image';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tooltip } from 'toolkit/chakra/tooltip';
import IconSvg from 'ui/shared/IconSvg';

type Props = {
  chain?: Omit<ExternalChain, 'explorer_url'>;
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
    <Tooltip content={ `${ chain?.name || 'Unknown chain' } (chain id: ${ chain?.id || 'Unknown' })` }>
      <Box>
        { chain?.logo ?
          <Image src={ chain.logo } boxSize={ boxSize } fallback={ <Placeholder boxSize={ boxSize }/> }/> :
          <Placeholder boxSize={ boxSize }/>
        }
      </Box>
    </Tooltip>
  );
};

export default ChainIcon;
