import React from 'react';

import type { ClusterByNameResponse } from 'types/api/clusters';

import { isEvmAddress } from 'lib/address/isEvmAddress';
import { currencyUnits } from 'lib/units';
import { Skeleton } from 'toolkit/chakra/skeleton';
import AppError from 'ui/shared/AppError/AppError';
import CurrencyValue from 'ui/shared/CurrencyValue';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import DetailedInfoTimestamp from 'ui/shared/DetailedInfo/DetailedInfoTimestamp';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import ClustersEntity from 'ui/shared/entities/clusters/ClustersEntity';

interface Props {
  clusterData?: ClusterByNameResponse['result']['data'];
  clusterName: string;
  isLoading: boolean;
}

const ClusterDetails = ({ clusterData, clusterName, isLoading }: Props) => {
  if (!clusterData && !isLoading) {
    const error = new Error('Cluster not found');
    error.cause = { status: 404 };
    return <AppError error={ error }/>;
  }

  const ownerIsEvm = clusterData?.owner ? isEvmAddress(clusterData.owner) : false;
  const addressType = ownerIsEvm ? 'EVM' : 'NON-EVM';

  return (
    <DetailedInfo.Container>
      <DetailedInfo.ItemLabel
        hint="The unique cluster name"
        isLoading={ isLoading }
      >
        Cluster Name
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
        hint="The amount of ETH backing this cluster name"
        isLoading={ isLoading }
      >
        Backing
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <CurrencyValue
          value={ clusterData?.backingWei || '0' }
          currency={ currencyUnits.ether }
          isLoading={ isLoading }
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
