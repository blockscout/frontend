// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, HStack } from '@chakra-ui/react';
import React from 'react';

import { getUserHandle } from 'client/features/account/utils/user-handle';
import useAccountWithDomain from 'client/features/connect-wallet/hooks/useAccountWithDomain';

import shortenString from 'client/shared/text/shorten-string';

import { useMarketplaceContext } from 'lib/contexts/marketplace';
import { Button, type ButtonProps } from 'toolkit/chakra/button';
import IconSvg from 'ui/shared/IconSvg';

import UserIdenticon from '../UserIdenticon';

interface Props extends ButtonProps {
  email?: string;
}

const UserProfileButton = ({ selected, email, ...rest }: Props) => {
  const { isAutoConnectDisabled } = useMarketplaceContext();
  const accountWithDomain = useAccountWithDomain(true);

  const isLoading = accountWithDomain.isLoading;

  const content = (() => {
    if (selected && !isLoading) {
      return accountWithDomain.address ? (
        <HStack gap={ 2 }>
          <UserIdenticon address={ accountWithDomain.address } isAutoConnectDisabled={ isAutoConnectDisabled }/>
          <Box display={{ base: 'none', md: 'block' }} maxW="200px" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
            { accountWithDomain.domain || shortenString(accountWithDomain.address) }
          </Box>
        </HStack>
      ) : (
        <HStack gap={ 2 }>
          <IconSvg name="profile" boxSize={ 5 }/>
          <Box display={{ base: 'none', md: 'block' }}>{ email ? getUserHandle(email) : 'My profile' }</Box>
        </HStack>
      );
    }

    return 'Log in';
  })();

  return (
    <Button
      px={{ base: 2.5, lg: 3 }}
      selected={ selected }
      highlighted={ isAutoConnectDisabled }
      fontWeight={ selected ? 700 : undefined }
      loading={ isLoading }
      { ...rest }
    >
      { content }
    </Button>
  );
};

export default React.memo(UserProfileButton);
