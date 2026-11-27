// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import useApiQuery from 'src/api/hooks/useApiQuery';

import MultichainAddressPortfolioTokens from 'src/features/multichain/pages/address/portfolio/MultichainAddressPortfolioTokens';
import { ADDRESS } from 'src/features/multichain/stubs';

import ApiFetchAlert from 'src/shared/alerts/ApiFetchAlert';
import { useClusterConfigQuery } from 'src/shared/external-chains/useClusterConfigQuery';
import getQueryParamString from 'src/shared/router/get-query-param-string';
import { useRouter } from 'src/shared/router/useRouter';

import { ContentLoader } from 'src/toolkit/components/loaders/ContentLoader';

const AddressMultichainPortfolio = () => {
  const router = useRouter();
  const hash = getQueryParamString(router.query.hash);

  const clusterConfigQuery = useClusterConfigQuery();

  const addressQuery = useApiQuery('multichainAggregator:address', {
    pathParams: { hash },
    queryOptions: {
      enabled: clusterConfigQuery.isSuccess,
      placeholderData: ADDRESS,
    },
  });

  if (clusterConfigQuery.isError) {
    return <ApiFetchAlert/>;
  }

  if (clusterConfigQuery.isPending) {
    return <ContentLoader/>;
  }

  return <MultichainAddressPortfolioTokens addressData={ addressQuery.data } isLoading={ addressQuery.isPlaceholderData }/>;
};

export default React.memo(AddressMultichainPortfolio);
