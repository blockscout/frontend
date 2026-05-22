// SPDX-License-Identifier: LicenseRef-Blockscout

import { useRouter } from 'next/router';
import React from 'react';

import useApiQuery from 'client/api/hooks/useApiQuery';

import TextAd from 'client/features/ads/text/components/TextAd';
import ClusterDetails from 'client/features/name-services/clusters/pages/details/ClusterDetails';

import getQueryParamString from 'client/shared/router/get-query-param-string';

import PageTitle from 'ui/shared/Page/PageTitle';

const Cluster = () => {
  const router = useRouter();
  const encodedClusterName = getQueryParamString(router.query.name);
  const clusterName = decodeURIComponent(encodedClusterName || '');

  const clusterQuery = useApiQuery('clusters:get_cluster_by_name', {
    queryParams: {
      input: JSON.stringify({ name: clusterName }),
    },
  });

  const clusterData = clusterQuery.data?.result?.data;

  const isLoading = clusterQuery.isLoading;

  return (
    <>
      <TextAd mb={ 6 }/>
      <PageTitle title="Cluster details"/>
      <ClusterDetails
        clusterData={ clusterData }
        clusterName={ clusterName }
        isLoading={ isLoading }
      />
    </>
  );
};

export default Cluster;
