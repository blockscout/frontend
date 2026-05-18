// SPDX-License-Identifier: LicenseRef-Blockscout

import { HStack } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'client/api/hooks/useApiQuery';

import config from 'configs/app';
import { Tag } from 'toolkit/chakra/tag';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';

import TacOperationEntity from '../../components/TacOperationEntity';
import TacOperationStatus from '../../components/TacOperationStatus';
import { TAC_OPERATION_DETAILS } from '../../stubs';
import { getTacOperationStage } from '../../utils/tac-operation';

interface Props {
  isLoading: boolean;
  txHash: string;
}

const TxDetailsTacOperation = ({ isLoading, txHash }: Props) => {
  const [ hasScroll, setHasScroll ] = React.useState(false);

  const { data, isPlaceholderData } = useApiQuery('tac:operation_by_tx_hash', {
    pathParams: { tx_hash: txHash },
    queryOptions: {
      enabled: config.features.tac.isEnabled && !isLoading,
      placeholderData: {
        items: [ TAC_OPERATION_DETAILS ],
      },
    },
  });

  if (!config.features.tac.isEnabled || !data) {
    return null;
  }

  const hasManyItems = data?.items.length > 1;

  return (
    <>
      <DetailedInfo.ItemLabel
        hint={ `Hash${ hasManyItems ? 'es' : '' } of the cross‑chain operation${ hasManyItems ? 's' : '' } that this transaction is part of` }
        isLoading={ isPlaceholderData }
        hasScroll={ hasScroll }
      >
        Source operation{ hasManyItems ? 's' : '' }
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValueWithScroll
        gradientHeight={ 48 }
        onScrollVisibilityChange={ setHasScroll }
        rowGap={ 3 }
        maxH="200px"
      >
        { data.items.map((tacOperation) => {
          const tags = [
            ...(getTacOperationStage(tacOperation, txHash) || []),
          ];

          return (
            <HStack key={ tacOperation.operation_id } rowGap={ 0 } columnGap={ 3 } flexWrap={{ base: 'wrap', lg: 'nowrap' }}>
              <TacOperationEntity
                id={ tacOperation.operation_id }
                type={ tacOperation.type }
                isLoading={ isPlaceholderData }
                my={{ base: '5px', lg: 0 }}
              />
              { tags.length > 0 && (
                <HStack flexShrink={ 0 } flexWrap="wrap" my={{ base: '3px', lg: 0 }}>
                  <TacOperationStatus status={ tacOperation.type } isLoading={ isPlaceholderData }/>
                  { tags.map((tag) => <Tag key={ tag } loading={ isPlaceholderData } flexShrink={ 0 }>{ tag }</Tag>) }
                </HStack>
              ) }
            </HStack>
          );
        }) }
      </DetailedInfo.ItemValueWithScroll>
    </>
  );
};

export default React.memo(TxDetailsTacOperation);
