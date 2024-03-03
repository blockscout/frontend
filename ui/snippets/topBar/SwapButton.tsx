import { Button, Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import getPageType from 'lib/mixpanel/getPageType';
import * as mixpanel from 'lib/mixpanel/index';
import IconSvg from 'ui/shared/IconSvg';

const feature = config.features.swapButton;

const SwapButton = () => {
  const router = useRouter();
  const source = getPageType(router.pathname);

  const handleClick = React.useCallback(() => {
    mixpanel.logEvent(mixpanel.EventTypes.BUTTON_CLICK, { Content: 'Swap button', Source: source });
  }, [ source ]);

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
      onClick={ handleClick }
    >
      <IconSvg name="swap" boxSize={ 3 } mr={{ base: 0, sm: 1 }}/>
      <Box display={{ base: 'none', sm: 'inline' }}>
        Swap
      </Box>
    </Button>
  );
};

export default React.memo(SwapButton);
