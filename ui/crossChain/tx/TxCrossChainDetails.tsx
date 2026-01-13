import React from 'react';

import type { InterchainMessage } from '@blockscout/interchain-indexer-types';

import useCrossChainConfig from 'lib/crossChain/useCrossChainConfig';
import CrossChainBridgeLink from 'ui/shared/crossChain/CrossChainBridgeLink';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import DetailedInfoTimestamp from 'ui/shared/DetailedInfo/DetailedInfoTimestamp';
import AddressEntityInterchain from 'ui/shared/entities/address/AddressEntityInterchain';
import RawInputData from 'ui/shared/RawInputData';
import CrossChainTxsStatusTag from 'ui/shared/statusTag/CrossChainTxsStatusTag';

import TxCrossChainDetailsLifecycle from './TxCrossChainDetailsLifecycle';
import TxCrossChainDetailsTransfers from './TxCrossChainDetailsTransfers';

interface Props {
  data: InterchainMessage | undefined;
  isLoading?: boolean;
}

const TxCrossChainDetails = ({ data, isLoading }: Props) => {
  const { data: crossChainConfig } = useCrossChainConfig();

  if (!data) {
    return <DataFetchAlert/>;
  }

  return (
    <DetailedInfo.Container>
      { data.sender && (
        <>
          <DetailedInfo.ItemLabel
            hint="Address that initiated the cross-chain transaction"
            isLoading={ isLoading }
          >
            Sender
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <AddressEntityInterchain
              address={ data.sender }
              isLoading={ isLoading }
              chains={ crossChainConfig }
              chainId={ data.source_chain_id }
            />
          </DetailedInfo.ItemValue>
        </>
      ) }
      { data.recipient && (
        <>
          <DetailedInfo.ItemLabel
            hint="Address that received the cross-chain transaction"
            isLoading={ isLoading }
          >
            Target
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <AddressEntityInterchain
              address={ data.recipient }
              isLoading={ isLoading }
              chains={ crossChainConfig }
              chainId={ data.destination_chain_id }
            />
          </DetailedInfo.ItemValue>
        </>
      ) }
      <DetailedInfo.ItemLabel
        hint="Protocol used for the cross-chain transaction"
        isLoading={ isLoading }
      >
        Protocol
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <CrossChainBridgeLink data={ data.bridge } isLoading={ isLoading }/>
      </DetailedInfo.ItemValue>

      { data.transfers.length > 0 && <TxCrossChainDetailsTransfers data={ data.transfers } id={ data.message_id } isLoading={ isLoading }/> }

      <DetailedInfo.ItemLabel
        hint="Status of the cross-chain transaction"
        isLoading={ isLoading }
      >
        Status
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <CrossChainTxsStatusTag status={ data.status } loading={ isLoading } mode="full"/>
      </DetailedInfo.ItemValue>
      <DetailedInfo.ItemLabel
        hint="Timestamp of the cross-chain transaction"
        isLoading={ isLoading }
      >
        Timestamp
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <DetailedInfoTimestamp timestamp={ data.receive_timestamp || data.send_timestamp } isLoading={ isLoading }/>
      </DetailedInfo.ItemValue>
      <DetailedInfo.ItemLabel
        hint="Lifecycle of the cross-chain transaction"
        isLoading={ isLoading }
      >
        Lifecycle
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue py={ 1 }>
        <TxCrossChainDetailsLifecycle data={ data } isLoading={ isLoading }/>
      </DetailedInfo.ItemValue>
      { data.payload && (
        <>
          <DetailedInfo.ItemLabel
            hint="Payload of the cross-chain transaction"
            isLoading={ isLoading }
          >
            Payload
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <RawInputData hex={ data.payload } isLoading={ isLoading }/>
          </DetailedInfo.ItemValue>
        </>
      ) }
    </DetailedInfo.Container>
  );
};

export default React.memo(TxCrossChainDetails);
