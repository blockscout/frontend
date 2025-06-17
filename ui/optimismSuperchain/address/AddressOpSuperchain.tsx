import { Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { TabItemRegular } from 'toolkit/components/AdaptiveTabs/types';

import getCheckedSummedAddress from 'lib/address/getCheckedSummedAddress';
import getQueryParamString from 'lib/router/getQueryParamString';
import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
import AddressQrCode from 'ui/address/details/AddressQrCode';
import TextAd from 'ui/shared/ad/TextAd';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import PageTitle from 'ui/shared/Page/PageTitle';

import AddressOpSuperchainTxs, { ADDRESS_OP_SUPERCHAIN_TXS_TAB_IDS } from './AddressOpSuperchainTxs';

const AddressOpSuperchain = () => {
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
        component: <div>Coming soon 🔜</div>,
      },
      {
        id: 'txs',
        title: 'Transactions',
        component: <AddressOpSuperchainTxs/>,
        subTabs: ADDRESS_OP_SUPERCHAIN_TXS_TAB_IDS,
      },
    ];
  }, []);

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
      />
      <AddressQrCode hash={ checkSummedHash } isLoading={ isLoading }/>
    </Flex>
  );

  return (
    <>
      <TextAd mb={ 6 }/>
      <PageTitle
        title="Address details"
        isLoading={ isLoading }
        secondRow={ titleSecondRow }
      />
      <RoutedTabs tabs={ tabs } isLoading={ isLoading }/>
    </>
  );
};

export default React.memo(AddressOpSuperchain);
