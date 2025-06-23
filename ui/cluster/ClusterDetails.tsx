import React from 'react';

import type { ClusterByNameResponse } from 'types/api/clusters';

import { isEvmAddress } from 'lib/clusters/detectInputType';
import dayjs from 'lib/date/dayjs';
import { Skeleton } from 'toolkit/chakra/skeleton';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import ClustersEntity from 'ui/shared/entities/clusters/ClustersEntity';

interface Props {
  clusterData?: ClusterByNameResponse['result']['data'];
  clusterName: string;
  isLoading: boolean;
}

const ClusterDetails = ({ clusterData, clusterName, isLoading }: Props) => {
  if (!clusterData && !isLoading) {
    return <div>Cluster not found</div>;
  }

  const ownerIsEvm = clusterData?.owner ? isEvmAddress(clusterData.owner) : false;
  const addressType = ownerIsEvm ? 'EVM' : 'NON-EVM';

  const backingEth = clusterData?.backingWei ? (parseFloat(clusterData.backingWei) / 1e18).toFixed(4) : '0';

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
        <Skeleton loading={ isLoading }>
          { backingEth } ETH
        </Skeleton>
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        hint="When this cluster name was created"
        isLoading={ isLoading }
      >
        Created
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Skeleton loading={ isLoading }>
          { clusterData?.createdAt ? dayjs(clusterData.createdAt).format('llll') : 'N/A' }
        </Skeleton>
      </DetailedInfo.ItemValue>
    </DetailedInfo.Container>
  );
};

export default ClusterDetails;
