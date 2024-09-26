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
  const web3AccountWithDomain = useWeb3AccountWithDomain(true);
  const { isAutoConnectDisabled } = useMarketplaceContext();

  React.useEffect(() => {
    if (!isLoading) {
      setIsFetched(true);
    }
  }, [ isLoading ]);

  const content = (() => {
    if (web3AccountWithDomain.address) {
      return (
        <HStack gap={ 2 }>
          <UserIdenticon address={ web3AccountWithDomain.address } isAutoConnectDisabled={ isAutoConnectDisabled }/>
          <Box display={{ base: 'none', md: 'block' }}>
            { web3AccountWithDomain.domain || shortenString(web3AccountWithDomain.address) }
          </Box>
        </HStack>
      );
    }

    if (!data) {
      return 'Log in';
    }

    return (
      <HStack gap={ 2 }>
        <IconSvg name="profile" boxSize={ 5 }/>
        <Box display={{ base: 'none', md: 'block' }}>{ data.email ? getUserHandle(data.email) : 'My profile' }</Box>
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
          data-selected={ Boolean(data) || Boolean(web3AccountWithDomain.address) }
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
