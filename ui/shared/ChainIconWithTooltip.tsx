import { Box } from '@chakra-ui/react';
import React from 'react';

import type { ChainInfo } from 'types/client/chainInfo';

import { Image } from 'toolkit/chakra/image';
import { Tooltip } from 'toolkit/chakra/tooltip';
import IconSvg from 'ui/shared/IconSvg';

type Props = {
  chain?: ChainInfo;
  isLoading?: boolean;
};

const Placeholder = () => {
  return (
    <IconSvg
      name="networks/icon-placeholder"
      boxSize={ 5 }
      color="text.secondary"
    />
  );
};

Placeholder.displayName = 'Placeholder';

const ChainIconWithTooltip = ({ chain }: Props) => {
  return (
    <Tooltip content={ `${ chain?.chain_name || 'Unknown chain' } (chain id: ${ chain?.chain_id || 'Unknown' })` }>
      <Box>
        { chain?.chain_logo ? <Image src={ chain.chain_logo } boxSize={ 5 } fallback={ <Placeholder/> }/> : <Placeholder/> }
      </Box>
    </Tooltip>
  );
};

export default ChainIconWithTooltip;
