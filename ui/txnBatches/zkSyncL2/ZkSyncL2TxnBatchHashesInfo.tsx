import { Flex, Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { ZkSyncBatch } from 'types/api/zkSyncL2';

import * as DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import DetailsTimestamp from 'ui/shared/DetailsTimestamp';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';

interface Props {
  isLoading: boolean;
  data: Pick<
    ZkSyncBatch,
  'commit_transaction_hash' |
  'commit_transaction_timestamp' |
  'prove_transaction_hash' |
  'prove_transaction_timestamp' |
  'execute_transaction_hash' |
  'execute_transaction_timestamp'
  >;
}

const ZkSyncL2TxnBatchHashesInfo = ({ isLoading, data }: Props) => {
  return (
    <>
      <DetailsInfoItem.Label
        hint="Hash of L1 tx on which the batch was committed"
        isLoading={ isLoading }
      >
        Commit tx hash
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value
        flexDir="column"
        alignItems="flex-start"
      >
        { data.commit_transaction_hash ? (
          <>
            <TxEntityL1
              isLoading={ isLoading }
              hash={ data.commit_transaction_hash }
              maxW="100%"
              noCopy={ false }
            />
            { data.commit_transaction_timestamp && (
              <Flex alignItems="center" flexWrap="wrap" rowGap={ 3 }>
                <DetailsTimestamp timestamp={ data.commit_transaction_timestamp } isLoading={ isLoading }/>
              </Flex>
            ) }
          </>
        ) : <Skeleton isLoaded={ !isLoading }>Pending</Skeleton> }
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        hint="Hash of L1 tx on which the batch was proven"
        isLoading={ isLoading }
      >
        Prove tx hash
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value
        flexDir="column"
        alignItems="flex-start"
      >
        { data.prove_transaction_hash ? (
          <>
            <TxEntityL1
              isLoading={ isLoading }
              hash={ data.prove_transaction_hash }
              maxW="100%"
              noCopy={ false }
            />
            { data.prove_transaction_timestamp && (
              <Flex alignItems="center" flexWrap="wrap" rowGap={ 3 }>
                <DetailsTimestamp timestamp={ data.prove_transaction_timestamp } isLoading={ isLoading }/>
              </Flex>
            ) }
          </>
        ) : <Skeleton isLoaded={ !isLoading }>Pending</Skeleton> }
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        hint="Hash of L1 tx on which the batch was executed and finalized"
        isLoading={ isLoading }
      >
        Execute tx hash
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value
        flexDir="column"
        alignItems="flex-start"
      >
        { data.execute_transaction_hash ? (
          <>
            <TxEntityL1
              isLoading={ isLoading }
              hash={ data.execute_transaction_hash }
              maxW="100%"
              noCopy={ false }
            />
            { data.execute_transaction_timestamp && (
              <Flex alignItems="center" flexWrap="wrap" rowGap={ 3 }>
                <DetailsTimestamp timestamp={ data.execute_transaction_timestamp } isLoading={ isLoading }/>
              </Flex>
            ) }
          </>
        ) : <Skeleton isLoaded={ !isLoading }>Pending</Skeleton> }
      </DetailsInfoItem.Value>
    </>
  );
};

export default React.memo(ZkSyncL2TxnBatchHashesInfo);
