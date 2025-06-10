/* eslint-disable */

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

const iconWallet = (
  <svg xmlns="http://www.w3.org/2000/svg" width={21} height={20} viewBox="0 0 21 20" fill="none">
    <path d="M17.1665 7.91665V5.99998C17.1665 5.06656 17.1665 4.59985 16.9848 4.24333C16.8251 3.92973 16.5701 3.67476 16.2565 3.51497C15.9 3.33332 15.4333 3.33331 14.4998 3.33331H4.83317C3.89975 3.33331 3.43304 3.33331 3.07652 3.51497C2.76292 3.67476 2.50795 3.92973 2.34816 4.24333C2.1665 4.59985 2.1665 5.06656 2.1665 5.99998V14C2.1665 14.9334 2.1665 15.4001 2.34816 15.7566C2.50795 16.0702 2.76292 16.3252 3.07652 16.485C3.43304 16.6666 3.89975 16.6666 4.83317 16.6666L14.4998 16.6666C15.4333 16.6666 15.9 16.6666 16.2565 16.485C16.5701 16.3252 16.8251 16.0702 16.9848 15.7566C17.1665 15.4001 17.1665 14.9334 17.1665 14V12.0833M12.9998 9.99998C12.9998 9.61277 12.9998 9.41916 13.0319 9.25816C13.1634 8.59701 13.6802 8.08018 14.3414 7.94867C14.5024 7.91665 14.696 7.91665 15.0832 7.91665H16.7498C17.1371 7.91665 17.3307 7.91665 17.4917 7.94867C18.1528 8.08018 18.6696 8.59701 18.8011 9.25816C18.8332 9.41916 18.8332 9.61277 18.8332 9.99998C18.8332 10.3872 18.8332 10.5808 18.8011 10.7418C18.6696 11.4029 18.1528 11.9198 17.4917 12.0513C17.3307 12.0833 17.1371 12.0833 16.7498 12.0833H15.0832C14.696 12.0833 14.5024 12.0833 14.3414 12.0513C13.6802 11.9198 13.1634 11.4029 13.0319 10.7418C12.9998 10.5808 12.9998 10.3872 12.9998 9.99998Z" 
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const UserWalletButton = ({ size, variant, onClick, isPending, isAutoConnectDisabled, address, domain }: Props, ref: React.ForwardedRef<HTMLButtonElement>) => {

  const isMobile = useIsMobile();

  const content = (() => {
    if (!address) {
      return <span className="user-connect-wallet-button-desktop-content">
        <span> { iconWallet } </span>
        <span>Connect</span>
      </span>
    }

    const text = domain || shortenString(address);

    return (
      <HStack gap={ 2 }>
        { iconWallet }
        <Box display={{ base: 'none', md: 'block' }}>{ text }</Box>
      </HStack>
    );
  })();

  return (
    <Tooltip
      label={ <span>Connect your wallet<br/>to Moca Chain for<br/>full-featured access</span> }
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
        className="user-connect-wallet-button-desktop"
        isLoading={ isPending }
        loadingText={ isMobile ? undefined : 'Connecting' }
      >
        { content }
      </Button>
    </Tooltip>
  );
};

export default React.memo(React.forwardRef(UserWalletButton));
