// SPDX-License-Identifier: LicenseRef-Blockscout

import { HStack } from '@chakra-ui/react';
import React from 'react';

import type * as tac from '@blockscout/tac-operation-lifecycle-types';

import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';
import DetailedInfoTimestamp from 'src/shared/detailed-info/DetailedInfoTimestamp';

import { Badge } from 'src/toolkit/chakra/badge';

import AddressEntityTacTon from '../../components/AddressEntityTacTon';
import TacOperationStatus from '../../components/TacOperationStatus';
import { sortStatusHistory } from '../../utils/tac-operation';
import TacOperationLifecycleAccordion from './TacOperationLifecycleAccordion';

interface Props {
  isLoading?: boolean;
  data: tac.V2OperationDetails;
}

const TacOperationDetails = ({ isLoading, data }: Props) => {

  const statusHistory = data.status_history.filter((item) => item.is_exist).sort(sortStatusHistory);

  return (
    <DetailedInfo.Container
      templateColumns={{ base: 'minmax(0, 1fr)', lg: '210px minmax(728px, auto)' }}
    >
      { data?.sender && (
        <>
          <DetailedInfo.ItemLabel
            hint="The address on the source chain that starts a cross‑chain operation"
            isLoading={ isLoading }
          >
            Sender
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <AddressEntityTacTon
              address={{ hash: data.sender.address }}
              chainType={ data.sender.blockchain }
              isLoading={ isLoading }
            />
          </DetailedInfo.ItemValue>
        </>
      ) }

      <DetailedInfo.ItemLabel
        hint="The status of the operation"
        isLoading={ isLoading }
      >
        Status
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <HStack gap={ 1 } flexWrap="wrap">
          <TacOperationStatus
            status={ data.status }
            type={ data.type }
            errorReason={ data.error_reason }
            isLoading={ isLoading }
            isRollback={ data.rollback }
          />
          { data.rollback && <Badge loading={ isLoading }>Rollback</Badge> }
        </HStack>
      </DetailedInfo.ItemValue>

      { data.timestamp && (
        <>
          <DetailedInfo.ItemLabel
            hint="Block time on the source chain when a cross‑chain operation is formed and sent"
            isLoading={ isLoading }
          >
            Timestamp
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <DetailedInfoTimestamp timestamp={ data.timestamp } isLoading={ isLoading }/>
          </DetailedInfo.ItemValue>
        </>
      ) }

      { statusHistory.length > 0 && (
        <>
          <DetailedInfo.ItemLabel
            hint="Stages of a cross‑chain operation"
            isLoading={ isLoading }
          >
            Lifecycle
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue mt={ 1 }>
            <TacOperationLifecycleAccordion data={ statusHistory } isLoading={ isLoading } status={ data.status }/>
          </DetailedInfo.ItemValue>
        </>
      ) }
    </DetailedInfo.Container>
  );
};

export default React.memo(TacOperationDetails);
