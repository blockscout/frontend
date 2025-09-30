import { Box, Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { TabItemRegular } from 'toolkit/components/AdaptiveTabs/types';
import type { EntityTag } from 'ui/shared/EntityTags/types';

import getCheckedSummedAddress from 'lib/address/getCheckedSummedAddress';
import getQueryParamString from 'lib/router/getQueryParamString';
import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
import { CONTRACT_TAB_IDS } from 'ui/address/contract/utils';
import AddressQrCode from 'ui/address/details/AddressQrCode';
import ClusterChainsPopover from 'ui/optimismSuperchain/components/ClusterChainsPopover';
import TextAd from 'ui/shared/ad/TextAd';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import EntityTags from 'ui/shared/EntityTags/EntityTags';
import PageTitle from 'ui/shared/Page/PageTitle';

import OpSuperchainAddressCoinBalanceHistory from './OpSuperchainAddressCoinBalanceHistory';
import OpSuperchainAddressContract from './OpSuperchainAddressContract';
import OpSuperchainAddressDetails from './OpSuperchainAddressDetails';
import OpSuperchainAddressInternalTxs from './OpSuperchainAddressInternalTxs';
import OpSuperchainAddressLogs from './OpSuperchainAddressLogs';
import OpSuperchainAddressTokens, { ADDRESS_OP_SUPERCHAIN_TOKENS_TAB_IDS } from './OpSuperchainAddressTokens';
import OpSuperchainAddressTokenTransfers, { ADDRESS_OP_SUPERCHAIN_TOKEN_TRANSFERS_TAB_IDS } from './OpSuperchainAddressTokenTransfers';
import OpSuperchainAddressTxs, { ADDRESS_OP_SUPERCHAIN_TXS_TAB_IDS } from './OpSuperchainAddressTxs';

const PREDEFINED_TAG_PRIORITY = 100;

const OpSuperchainAddress = () => {
  const router = useRouter();

  const hash = getQueryParamString(router.query.hash);

  const isLoading = false;

  const addressQuery = {
    data: {
      hash: undefined,
    },
  };

  const checkSummedHash = React.useMemo(() => addressQuery.data?.hash ?? getCheckedSummedAddress(hash), [ hash, addressQuery.data?.hash ]);

  const tabs: Array<TabItemRegular> = React.useMemo(() => {
    return [
      {
        id: 'index',
        title: 'Details',
        component: <OpSuperchainAddressDetails addressHash={ checkSummedHash }/>,
      },
      {
        id: 'contract',
        title: 'Contract',
        component: <OpSuperchainAddressContract addressHash={ checkSummedHash }/>,
        subTabs: CONTRACT_TAB_IDS,
      },
      {
        id: 'txs',
        title: 'Transactions',
        component: <OpSuperchainAddressTxs/>,
        subTabs: ADDRESS_OP_SUPERCHAIN_TXS_TAB_IDS,
      },
      {
        id: 'token_transfers',
        title: 'Token transfers',
        component: <OpSuperchainAddressTokenTransfers/>,
        subTabs: ADDRESS_OP_SUPERCHAIN_TOKEN_TRANSFERS_TAB_IDS,
      },
      {
        id: 'tokens',
        title: 'Tokens',
        component: <OpSuperchainAddressTokens/>,
        subTabs: ADDRESS_OP_SUPERCHAIN_TOKENS_TAB_IDS,
      },
      {
        id: 'internal_txs',
        title: 'Internal txns',
        component: <OpSuperchainAddressInternalTxs/>,
      },
      {
        id: 'coin_balance_history',
        title: 'Coin balance history',
        component: <OpSuperchainAddressCoinBalanceHistory/>,
      },
      {
        id: 'logs',
        title: 'Logs',
        component: <OpSuperchainAddressLogs/>,
      },
    ];
  }, [ checkSummedHash ]);

  const titleSecondRow = (
    <Flex alignItems="center" w="100%" columnGap={ 2 } rowGap={ 2 } flexWrap={{ base: 'wrap', lg: 'nowrap' }}>
      <AddressEntity
        address={{
          ...addressQuery.data,
          hash: checkSummedHash,
          name: '',
          ens_domain_name: '',
          implementations: null,
        }}
        isLoading={ isLoading }
        variant="subheading"
        noLink
        icon={{
          shield: { name: 'pie_chart', isLoading },
        }}
      />
      <AddressQrCode hash={ checkSummedHash } isLoading={ isLoading }/>
      <Box ml="auto"/>
      <ClusterChainsPopover addressHash={ checkSummedHash }/>
    </Flex>
  );

  const tags: Array<EntityTag> = React.useMemo(() => {
    return [
      { slug: 'eoa', name: 'EOA', tagType: 'custom' as const, ordinal: PREDEFINED_TAG_PRIORITY },
    ];
  }, []);

  const titleContentAfter = (
    <EntityTags
      tags={ tags }
      isLoading={ isLoading }
      addressHash={ checkSummedHash }
    />
  );

  return (
    <>
      <TextAd mb={ 6 }/>
      <PageTitle
        title="Address details"
        isLoading={ isLoading }
        secondRow={ titleSecondRow }
        contentAfter={ titleContentAfter }
      />
      <RoutedTabs tabs={ tabs } isLoading={ isLoading }/>
    </>
  );
};

export default React.memo(OpSuperchainAddress);
