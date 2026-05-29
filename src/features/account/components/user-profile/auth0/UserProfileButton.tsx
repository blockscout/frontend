// SPDX-License-Identifier: LicenseRef-Blockscout

import type { ButtonProps } from '@chakra-ui/react';
import { Box, HStack } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React, { useCallback, useState } from 'react';

import type { UserInfo } from 'src/features/account/types/api';

import { getUserHandle } from 'src/features/account/utils/user-handle';
import useWeb3AccountWithDomain from 'src/features/connect-wallet/hooks/useAccountWithDomain';
import { useMarketplaceContext } from 'src/features/marketplace/context';

import useIsMobile from 'src/shared/hooks/useIsMobile';
import shortenString from 'src/shared/texts/shorten-string';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { Button } from 'src/toolkit/chakra/button';
import { Tooltip } from 'src/toolkit/chakra/tooltip';

import UserIdenticon from '../UserIdenticon';

interface Props {
  profileQuery: UseQueryResult<UserInfo, unknown>;
  size?: ButtonProps['size'];
  variant?: ButtonProps['variant'];
  onClick: () => void;
  isPending?: boolean;
}

const UserProfileButton = ({ profileQuery, size, variant, onClick, isPending, ...rest }: Props, ref: React.ForwardedRef<HTMLButtonElement>) => {
  const [ isFetched, setIsFetched ] = useState(false);
  const isMobile = useIsMobile();

  const { data, isLoading } = profileQuery;
  const web3AccountWithDomain = useWeb3AccountWithDomain(true);
  const { isAutoConnectDisabled } = useMarketplaceContext();

  React.useEffect(() => {
    if (!isLoading) {
      setIsFetched(true);
    }
  }, [ isLoading ]);

  const handleFocus = useCallback((e: React.FocusEvent<HTMLButtonElement>) => {
    e.preventDefault();
  }, []);

  const isButtonLoading = isPending || !isFetched || web3AccountWithDomain.isLoading;
  const dataExists = !isButtonLoading && (Boolean(data) || Boolean(web3AccountWithDomain.address));

  const content = (() => {
    if (web3AccountWithDomain.address && !isButtonLoading) {
      return (
        <HStack gap={ 2 }>
          <UserIdenticon address={ web3AccountWithDomain.address } isAutoConnectDisabled={ isAutoConnectDisabled }/>
          <Box display={{ base: 'none', md: 'block' }} maxW="200px" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
            { web3AccountWithDomain.domain || shortenString(web3AccountWithDomain.address) }
          </Box>
        </HStack>
      );
    }

    if (!data || isButtonLoading) {
      return 'Log in';
    }

    return (
      <HStack gap={ 2 }>
        <SpriteIcon name="profile" boxSize={ 5 }/>
        <Box display={{ base: 'none', md: 'block' }}>{ data.email ? getUserHandle(data.email) : 'My profile' }</Box>
      </HStack>
    );
  })();

  return (
    <Tooltip
      content={ <span>Sign in to My Account to add tags,<br/>create watchlists, access API keys and more</span> }
      disabled={ isMobile || isLoading || Boolean(data) }
      openDelay={ 500 }
      disableOnMobile
    >
      <span>
        <Button
          ref={ ref }
          size={ size }
          variant={ variant }
          onClick={ onClick }
          onFocus={ handleFocus }
          selected={ dataExists }
          highlighted={ isAutoConnectDisabled }
          px={{ base: 2.5, lg: 3 }}
          fontWeight={ dataExists ? 700 : 600 }
          loading={ isButtonLoading }
          { ...rest }
        >
          { content }
        </Button>
      </span>
    </Tooltip>
  );
};

export default React.forwardRef(UserProfileButton);
