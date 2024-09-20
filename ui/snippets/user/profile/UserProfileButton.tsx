import type { ButtonProps } from '@chakra-ui/react';
import { Button, Skeleton, Tooltip, Box, HStack } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { UserInfo } from 'types/api/account';

import { useMarketplaceContext } from 'lib/contexts/marketplace';
import useIsMobile from 'lib/hooks/useIsMobile';
import shortenString from 'lib/shortenString';
import useWeb3AccountWithDomain from 'lib/web3/useAccountWithDomain';
import IconSvg from 'ui/shared/IconSvg';

import UserIdenticon from '../UserIdenticon';
import { getUserHandle } from './utils';

interface Props {
  profileQuery: UseQueryResult<UserInfo, unknown>;
  size?: ButtonProps['size'];
  variant?: ButtonProps['variant'];
  onClick: () => void;
  isPending?: boolean;
}

const UserProfileButton = ({ profileQuery, size, variant, onClick, isPending }: Props, ref: React.ForwardedRef<HTMLDivElement>) => {
  const [ isFetched, setIsFetched ] = React.useState(false);
  const isMobile = useIsMobile();

  const { data, isLoading } = profileQuery;
  const web3AccountWithDomain = useWeb3AccountWithDomain(!data?.address_hash);
  const { isAutoConnectDisabled } = useMarketplaceContext();

  React.useEffect(() => {
    if (!isLoading) {
      setIsFetched(true);
    }
  }, [ isLoading ]);

  const content = (() => {
    if (!data) {
      return 'Connect';
    }

    const address = data.address_hash || web3AccountWithDomain.address;
    if (address) {
      const text = (() => {
        if (data.address_hash) {
          return shortenString(data.address_hash);
        }

        if (web3AccountWithDomain.domain) {
          return web3AccountWithDomain.domain;
        }

        return shortenString(address);
      })();

      return (
        <HStack gap={ 2 }>
          <UserIdenticon address={ address } isAutoConnectDisabled={ isAutoConnectDisabled }/>
          <Box display={{ base: 'none', md: 'block' }}>{ text }</Box>
        </HStack>
      );
    }

    return (
      <HStack gap={ 2 }>
        <IconSvg name="profile" boxSize={ 5 }/>
        <Box display={{ base: 'none', md: 'block' }}>{ data.email ? getUserHandle(data.email) : 'Profile' }</Box>
      </HStack>
    );
  })();

  return (
    <Tooltip
      label={ <span>Sign in to My Account to add tags,<br/>create watchlists, access API keys and more</span> }
      textAlign="center"
      padding={ 2 }
      isDisabled={ isMobile || isFetched || Boolean(data) }
      openDelay={ 500 }
    >
      <Skeleton isLoaded={ isFetched } borderRadius="base" ref={ ref }>
        <Button
          size={ size }
          variant={ variant }
          onClick={ onClick }
          data-selected={ Boolean(data) }
          data-warning={ isAutoConnectDisabled }
          fontSize="sm"
          lineHeight={ 5 }
          px={ data ? 2.5 : 4 }
          fontWeight={ data ? 700 : 600 }
          isLoading={ isPending }
          loadingText={ isMobile ? undefined : 'Connecting' }
        >
          { content }
        </Button>
      </Skeleton>
    </Tooltip>
  );
};

export default React.memo(React.forwardRef(UserProfileButton));
