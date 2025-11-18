import { Box, Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { TabItemRegular } from 'toolkit/components/AdaptiveTabs/types';

import getCheckedSummedAddress from 'lib/address/getCheckedSummedAddress';
import useApiQuery from 'lib/api/useApiQuery';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import * as contract from 'lib/multichain/contract';
import getQueryParamString from 'lib/router/getQueryParamString';
import { ADDRESS } from 'stubs/optimismSuperchain';
import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
import { CONTRACT_TAB_IDS } from 'ui/address/contract/utils';
import AddressQrCode from 'ui/address/details/AddressQrCode';
import ClusterChainsPopover from 'ui/optimismSuperchain/components/ClusterChainsPopover';
import TextAd from 'ui/shared/ad/TextAd';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import PageTitle from 'ui/shared/Page/PageTitle';

import OpSuperchainAddressCoinBalanceHistory from './OpSuperchainAddressCoinBalanceHistory';
import OpSuperchainAddressContract from './OpSuperchainAddressContract';
import OpSuperchainAddressDetails from './OpSuperchainAddressDetails';
import OpSuperchainAddressInternalTxs from './OpSuperchainAddressInternalTxs';
import OpSuperchainAddressLogs from './OpSuperchainAddressLogs';
import OpSuperchainAddressTokens, { ADDRESS_OP_SUPERCHAIN_TOKENS_TAB_IDS } from './OpSuperchainAddressTokens';
import OpSuperchainAddressTokenTransfers, { ADDRESS_OP_SUPERCHAIN_TOKEN_TRANSFERS_TAB_IDS } from './OpSuperchainAddressTokenTransfers';
import OpSuperchainAddressTxs, { ADDRESS_OP_SUPERCHAIN_TXS_TAB_IDS } from './OpSuperchainAddressTxs';

const OpSuperchainAddress = () => {
  const router = useRouter();

  const hash = getQueryParamString(router.query.hash);

  const addressQuery = useApiQuery('multichainAggregator:address', {
    pathParams: { hash },
    queryOptions: {
      placeholderData: ADDRESS,
    },
  });

  throwOnResourceLoadError(addressQuery);

  const isLoading = addressQuery.isPlaceholderData;
  const chainData = Object.values(addressQuery.data?.chain_infos ?? {});
  const isContractSomewhere = chainData.some((chainInfo) => chainInfo.is_contract);
  const isContract = contract.isContract(addressQuery.data);
  const isVerified = contract.isVerified(addressQuery.data);

  const checkSummedHash = React.useMemo(() => {
    if (isLoading) {
      return getCheckedSummedAddress(hash);
    }
    return addressQuery.data?.hash ?? getCheckedSummedAddress(hash);
  }, [ hash, addressQuery.data?.hash, isLoading ]);

  const tabs: Array<TabItemRegular> = React.useMemo(() => {
    return [
      {
        id: 'index',
        title: 'Details',
        component: <OpSuperchainAddressDetails addressHash={ checkSummedHash } data={ addressQuery.data } isLoading={ isLoading }/>,
      },
      isContractSomewhere && {
        id: 'contract',
        title: 'Contract',
        component: <OpSuperchainAddressContract addressHash={ checkSummedHash } data={ addressQuery.data } isLoading={ isLoading }/>,
        subTabs: CONTRACT_TAB_IDS,
      },
      {
        id: 'txs',
        title: 'Transactions',
        component: <OpSuperchainAddressTxs addressData={ addressQuery.data } isLoading={ isLoading }/>,
        subTabs: ADDRESS_OP_SUPERCHAIN_TXS_TAB_IDS,
      },
      {
        id: 'token_transfers',
        title: 'Token transfers',
        component: <OpSuperchainAddressTokenTransfers addressData={ addressQuery.data } isLoading={ isLoading }/>,
        subTabs: ADDRESS_OP_SUPERCHAIN_TOKEN_TRANSFERS_TAB_IDS,
      },
      addressQuery.data?.has_tokens && {
        id: 'tokens',
        title: 'Tokens',
        component: isLoading ? null : <OpSuperchainAddressTokens addressData={ addressQuery.data }/>,
        subTabs: ADDRESS_OP_SUPERCHAIN_TOKENS_TAB_IDS,
      },
      {
        id: 'internal_txs',
        title: 'Internal txns',
        component: <OpSuperchainAddressInternalTxs addressData={ addressQuery.data } isLoading={ isLoading }/>,
      },
      {
        id: 'coin_balance_history',
        title: 'Coin balance history',
        component: <OpSuperchainAddressCoinBalanceHistory addressData={ addressQuery.data } isLoading={ isLoading }/>,
      },
      isContractSomewhere && {
        id: 'logs',
        title: 'Logs',
        component: <OpSuperchainAddressLogs addressData={ addressQuery.data } isLoading={ isLoading }/>,
      },
    ].filter(Boolean);
  }, [ addressQuery.data, isLoading, isContractSomewhere, checkSummedHash ]);

  const titleSecondRow = (
    <Flex alignItems="center" w="100%" columnGap={ 2 } rowGap={ 2 } flexWrap={{ base: 'wrap', lg: 'nowrap' }}>
      <AddressEntity
        address={{
          ...addressQuery.data,
          hash: checkSummedHash,
          name: '',
          ens_domain_name: '',
          implementations: null,
          is_contract: isContract,
          is_verified: isVerified,
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
      <ClusterChainsPopover addressHash={ checkSummedHash } data={ addressQuery.data } isLoading={ isLoading }/>
    </Flex>
  );

  return (
    <>
      <TextAd mb={ 6 }/>
      <PageTitle
        title={ `${ isContract ? 'Contract' : 'Address' } details` }
        isLoading={ isLoading }
        secondRow={ titleSecondRow }
      />
      <RoutedTabs tabs={ tabs } isLoading={ isLoading }/>
    </>
  );
};

export default React.memo(OpSuperchainAddress);
