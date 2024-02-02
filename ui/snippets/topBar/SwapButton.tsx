import { Button, Box } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

import * as regexp from 'lib/regexp';
import IconSvg from 'ui/shared/IconSvg';
import LinkExternal from 'ui/shared/LinkExternal';
import LinkInternal from 'ui/shared/LinkInternal';

const SwapButton = ({ appUrl }: { appUrl: string }) => {
  const button = (
    <Button variant="solid" size="xs" borderRadius="sm" height={ 5 } px={ 1.5 }>
      <IconSvg name="swap" boxSize={ 3 } mr={{ base: 0, sm: 1 }}/>
      <Box display={{ base: 'none', sm: 'inline' }}>
        Swap
      </Box>
    </Button>
  );

  return regexp.URL_PREFIX.test(appUrl) ? (
    <LinkExternal href={ appUrl } hideIcon>
      { button }
    </LinkExternal>
  ) : (
    <LinkInternal
      href={ route({ pathname: '/apps/[id]', query: { id: appUrl, action: 'connect' } }) }
      display="contents"
    >
      { button }
    </LinkInternal>
  );
};

export default React.memo(SwapButton);
