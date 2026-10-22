// SPDX-License-Identifier: LicenseRef-Blockscout

import { HStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import ActionBar from 'src/shell/page/action-bar/ActionBar';

import BubblemapsMap from 'src/features/bubblemaps/components/BubblemapsMap';

import useIsMobile from 'src/shared/hooks/useIsMobile';
import getQueryParamString from 'src/shared/router/get-query-param-string';

import RoutedTabs from 'src/toolkit/components/RoutedTabs/RoutedTabs';

import TokenHoldersActions from './TokenHoldersActions';
import TokenHoldersList from './TokenHoldersList';
import { useTokenHoldersQuery } from './useTokenHoldersQuery';

export const TOKEN_HOLDERS_TAB_IDS = [ 'holders' as const, 'holders_bubblemaps' as const ];
const TAB_LIST_PROPS = {
  marginBottom: 0,
  pt: 6,
  pb: 3,
  marginTop: -6,
};

interface Props {
  token: schemas['Token'] | undefined;
  isLoading: boolean;
}

const TokenHoldersTabs = ({ token, isLoading }: Props) => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const tab = getQueryParamString(router.query.tab);
  const isAddressTab = tab !== 'holders_bubblemaps';

  const holdersQuery = useTokenHoldersQuery({ token, tokenId: undefined, enabled: !isLoading && isAddressTab });

  const addressActionBar = isMobile ? (
    <ActionBar>
      <TokenHoldersActions token={ token } query={ holdersQuery }/>
    </ActionBar>
  ) : null;

  const tabs = [
    {
      id: 'holders',
      title: 'Address',
      component: <TokenHoldersList token={ token } query={ holdersQuery } actionBar={ addressActionBar }/>,
    },
    {
      id: 'holders_bubblemaps',
      title: 'Bubblemaps',
      component: token ? <BubblemapsMap hash={ token.address_hash }/> : null,
    },
  ];

  const rightSlot = isAddressTab && !isMobile ? (
    <HStack gap={ 3 } w="100%">
      <TokenHoldersActions token={ token } query={ holdersQuery }/>
    </HStack>
  ) : null;

  const rightSlotProps = {
    display: 'flex',
    justifyContent: 'space-between',
    ml: { base: 0, lg: 4 },
    widthAllocation: 'available' as const,
  };

  return (
    <RoutedTabs
      variant="secondary"
      size="sm"
      tabs={ tabs }
      rightSlot={ rightSlot }
      rightSlotProps={ rightSlotProps }
      listProps={ isMobile ? undefined : TAB_LIST_PROPS }
      stickyEnabled={ !isMobile }
    />
  );
};

export default React.memo(TokenHoldersTabs);
