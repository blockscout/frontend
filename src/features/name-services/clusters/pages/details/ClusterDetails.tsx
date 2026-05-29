// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { ClusterByNameResponse } from 'src/features/name-services/clusters/types/api';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';
import { isEvmAddress } from 'src/slices/address/utils/is-evm-address';
import { currencyUnits } from 'src/slices/chain/units';

import ClustersEntity from 'src/features/name-services/clusters/components/ClustersEntity';

import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';
import DetailedInfoTimestamp from 'src/shared/detailed-info/DetailedInfoTimestamp';
import NativeCoinValue from 'src/shared/values/entity/NativeCoinValue';

import { Skeleton } from 'src/toolkit/chakra/skeleton';

interface Props {
  clusterData?: ClusterByNameResponse['result']['data'];
  clusterName: string;
  isLoading: boolean;
}

const ClusterDetails = ({ clusterData, clusterName, isLoading }: Props) => {
  if (!clusterData && !isLoading) {
    throw new Error('Cluster not found', { cause: { status: 404 } });
  }

  const ownerIsEvm = clusterData?.owner ? isEvmAddress(clusterData.owner) : false;
  const addressType = ownerIsEvm ? 'EVM' : 'NON-EVM';

  return (
    <DetailedInfo.Container>
      <DetailedInfo.ItemLabel
        hint="The unique cluster name"
        isLoading={ isLoading }
      >
        Cluster name
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <ClustersEntity
          clusterName={ clusterName }
          isLoading={ isLoading }
          noLink
          fontWeight={ 500 }
        />
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        hint="The address attached to this cluster name"
        isLoading={ isLoading }
      >
        Owner address
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <AddressEntity
          address={{ hash: clusterData?.owner || '' }}
          isLoading={ isLoading }
          fontWeight={ 500 }
          noLink={ !ownerIsEvm }
        />
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        hint="The network type of the address attached to this cluster name"
        isLoading={ isLoading }
      >
        Type
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Skeleton loading={ isLoading }>
          { addressType }
        </Skeleton>
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        hint={ `The amount of ${ currencyUnits.ether } backing this cluster name` }
        isLoading={ isLoading }
      >
        Backing
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <NativeCoinValue
          amount={ clusterData?.backingWei || '0' }
          loading={ isLoading }
        />
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        hint="When this cluster name was created"
        isLoading={ isLoading }
      >
        Created
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        { clusterData?.createdAt ? (
          <DetailedInfoTimestamp
            timestamp={ clusterData.createdAt }
            isLoading={ isLoading }
          />
        ) : (
          <Skeleton loading={ isLoading }>N/A</Skeleton>
        ) }
      </DetailedInfo.ItemValue>
    </DetailedInfo.Container>
  );
};

export default ClusterDetails;
