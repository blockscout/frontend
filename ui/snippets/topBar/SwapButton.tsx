import { Button, Box } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import IconSvg from 'ui/shared/IconSvg';

const feature = config.features.swapButton;

const SwapButton = () => {
  if (!feature.isEnabled) {
    return null;
  }

  const href = 'url' in feature ?
    feature.url :
    route({ pathname: '/apps/[id]', query: { id: feature.dappId, action: 'connect' } });

  return (
    <Button
      as="a"
      href={ href }
      target={ 'url' in feature ? '_blank' : '_self' }
      variant="solid"
      size="xs"
      borderRadius="sm"
      height={ 5 }
      px={ 1.5 }
    >
      <IconSvg name="swap" boxSize={ 3 } mr={{ base: 0, sm: 1 }}/>
      <Box display={{ base: 'none', sm: 'inline' }}>
        Swap
      </Box>
    </Button>
  );
};

export default React.memo(SwapButton);
