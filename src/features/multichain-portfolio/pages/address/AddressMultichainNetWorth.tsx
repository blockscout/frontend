// SPDX-License-Identifier: LicenseRef-Blockscout

import { BigNumber } from 'bignumber.js';
import React from 'react';

import useApiQuery from 'src/api/hooks/useApiQuery';

import AddressMultichainButtons from 'src/features/multichain-button/pages/address/AddressMultichainButtons';
import { useIncludePoorReputationTokens } from 'src/features/multichain/pages/address/portfolio/useIncludePoorReputationTokens';
import { ADDRESS_PORTFOLIO } from 'src/features/multichain/stubs';

import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';
import SimpleValue from 'src/shared/values/entity/SimpleValue';
import { DEFAULT_ACCURACY_USD } from 'src/shared/values/entity/utils';

import { Skeleton } from 'src/toolkit/chakra/skeleton';

interface Props {
  addressHash: string;
  hasMultichainButtons: boolean;
  isLoading: boolean;
}

const AddressMultichainNetWorth = ({ addressHash, hasMultichainButtons, isLoading }: Props) => {
  const includePoorReputationTokens = useIncludePoorReputationTokens();

  const portfolioQuery = useApiQuery('multichainAggregator:address_portfolio', {
    pathParams: { hash: addressHash },
    queryParams: {
      include_poor_reputation_tokens: includePoorReputationTokens,
    },
    queryOptions: {
      enabled: Boolean(addressHash),
      placeholderData: ADDRESS_PORTFOLIO,
    },
  });

  const totalValue = portfolioQuery.data?.portfolio?.total_value;
  const isValueLoading = isLoading || portfolioQuery.isPlaceholderData;

  return (
    <>
      <DetailedInfo.ItemLabel
        hint="Total net worth in USD of all tokens for the address across all chains"
        isLoading={ isLoading }
      >
        Multichain net worth
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue multiRow columnGap={ 2 }>
        { totalValue ?
          <SimpleValue value={ BigNumber(totalValue) } accuracy={ DEFAULT_ACCURACY_USD } prefix="$" loading={ isValueLoading }/> :
          <Skeleton loading={ isValueLoading }><span>N/A</span></Skeleton> }
        { hasMultichainButtons && <AddressMultichainButtons addressHash={ addressHash }/> }
      </DetailedInfo.ItemValue>
    </>
  );
};

export default React.memo(AddressMultichainNetWorth);
