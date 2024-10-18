import type { ButtonProps } from '@chakra-ui/react';
import { Button, Box, HStack, Tooltip } from '@chakra-ui/react';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import shortenString from 'lib/shortenString';

import UserIdenticon from '../UserIdenticon';

interface Props {
  size?: ButtonProps['size'];
  variant?: ButtonProps['variant'];
  onClick?: () => void;
  isPending?: boolean;
  isAutoConnectDisabled?: boolean;
  address?: string;
  domain?: string;
}

const UserWalletButton = ({ size, variant, onClick, isPending, isAutoConnectDisabled, address, domain }: Props, ref: React.ForwardedRef<HTMLButtonElement>) => {

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
      label={ <span>Connect your wallet<br/>to Blockscout for<br/>full-featured access</span> }
      textAlign="center"
      padding={ 2 }
      isDisabled={ isMobile || Boolean(address) }
      openDelay={ 500 }
    >
      <Button
        ref={ ref }
        size={ size }
        variant={ variant }
        onClick={ onClick }
        data-selected={ Boolean(address) }
        data-warning={ isAutoConnectDisabled }
        fontSize="sm"
        lineHeight={ 5 }
        px={ address ? 2.5 : 4 }
        fontWeight={ address ? 700 : 600 }
        isLoading={ isPending }
        loadingText={ isMobile ? undefined : 'Connecting' }
      >
        { content }
      </Button>
    </Tooltip>
  );
};

export default React.memo(React.forwardRef(UserWalletButton));
