import type { ButtonProps } from '@chakra-ui/react';
import { Box, HStack } from '@chakra-ui/react';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import shortenString from 'lib/shortenString';
import { Button } from 'toolkit/chakra/button';
import { Tooltip } from 'toolkit/chakra/tooltip';

import UserIdenticon from '../UserIdenticon';

interface Props {
  size?: ButtonProps['size'];
  visual?: ButtonProps['visual'];
  isPending?: boolean;
  isAutoConnectDisabled?: boolean;
  address?: string;
  domain?: string;
}

const UserWalletButton = ({ size, visual, isPending, isAutoConnectDisabled, address, domain }: Props, ref: React.ForwardedRef<HTMLButtonElement>) => {

  const isMobile = useIsMobile();

  const content = (() => {
    if (!address) {
      return 'Connect';
    }

    const text = domain || shortenString(address);

    return (
      <HStack gap={ 2 }>
        <UserIdenticon address={ address } isAutoConnectDisabled={ isAutoConnectDisabled }/>
        <Box display={{ base: 'none', md: 'block' }}>{ text }</Box>
      </HStack>
    );
  })();

  return (
    <Tooltip
      content={ <span>Connect your wallet<br/>to Blockscout for<br/>full-featured access</span> }
      disabled={ isMobile || Boolean(address) }
      openDelay={ 500 }
    >
      <Button
        ref={ ref }
        size={ size }
        visual={ visual }
        selected={ Boolean(address) }
        highlighted={ isAutoConnectDisabled }
        textStyle="sm"
        px={ address ? 2.5 : 4 }
        fontWeight={ address ? 700 : 600 }
        loading={ isPending }
        loadingText={ isMobile ? undefined : 'Connecting' }
      >
        { content }
      </Button>
    </Tooltip>
  );
};

export default React.memo(React.forwardRef(UserWalletButton));
