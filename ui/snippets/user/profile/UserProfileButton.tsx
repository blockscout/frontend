import type { ButtonProps } from '@chakra-ui/react';
import { Box, HStack } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React, { useCallback, useState } from 'react';

import type { UserInfo } from 'types/api/account';

import { useMarketplaceContext } from 'lib/contexts/marketplace';
import useIsMobile from 'lib/hooks/useIsMobile';
import shortenString from 'lib/shortenString';
import useWeb3AccountWithDomain from 'lib/web3/useAccountWithDomain';
import { Button } from 'toolkit/chakra/button';
import { Tooltip } from 'toolkit/chakra/tooltip';
import IconSvg from 'ui/shared/IconSvg';

import UserIdenticon from '../UserIdenticon';
import { getUserHandle } from './utils';

interface Props {
  profileQuery: UseQueryResult<UserInfo, unknown>;
  size?: ButtonProps['size'];
  visual?: ButtonProps['visual'];
  onClick: () => void;
  isPending?: boolean;
}

const UserProfileButton = ({ profileQuery, size, visual, onClick, isPending }: Props, ref: React.ForwardedRef<HTMLButtonElement>) => {
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

  const isButtonLoading = isPending || !isFetched;
  const dataExists = !isButtonLoading && (Boolean(data) || Boolean(web3AccountWithDomain.address));

  return (
    <Tooltip
      content={ <span>Sign in to My Account to add tags,<br/>create watchlists, access API keys and more</span> }
      disabled={ isMobile || isLoading || Boolean(data) }
      openDelay={ 500 }
    >
      <Button
        ref={ ref }
        size={ size }
        visual={ visual }
        onClick={ onClick }
        onFocus={ handleFocus }
        selected={ dataExists }
        highlighted={ isAutoConnectDisabled }
        textStyle="sm"
        px={ dataExists ? 2.5 : 4 }
        fontWeight={ dataExists ? 700 : 600 }
        loading={ isButtonLoading }
      >
        { content }
      </Button>
    </Tooltip>
  );
};

export default React.memo(React.forwardRef(UserProfileButton));
