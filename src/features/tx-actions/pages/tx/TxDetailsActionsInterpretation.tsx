// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import useApiQuery from 'src/api/hooks/useApiQuery';

import { TX_INTERPRETATION } from 'src/features/tx-interpretation/blockscout/stubs';
import TxInterpretation from 'src/features/tx-interpretation/common/components/TxInterpretation';

import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';
import DetailedInfoActionsWrapper from 'src/shared/detailed-info/DetailedInfoActionsWrapper';

interface Props {
  hash?: string;
  isTxDataLoading: boolean;
}

const TxDetailsActionsInterpretation = ({ hash, isTxDataLoading }: Props) => {
  const txInterpretationQuery = useApiQuery('core:tx_interpretation', {
    pathParams: { hash },
    queryOptions: {
      enabled: Boolean(hash) && !isTxDataLoading,
      placeholderData: TX_INTERPRETATION,
      refetchOnMount: false,
    },
  });

  const actions = txInterpretationQuery.data?.data.summaries;

  if (!actions || actions.length < 2) {
    return null;
  }

  return (
    <>
      <DetailedInfoActionsWrapper isLoading={ isTxDataLoading || txInterpretationQuery.isPlaceholderData } type="tx">
        { actions.map((action, index: number) => (
          <TxInterpretation
            key={ index }
            summary={ action }
            isLoading={ isTxDataLoading || txInterpretationQuery.isPlaceholderData }
          />
        ),
        ) }
      </DetailedInfoActionsWrapper>
      <DetailedInfo.ItemDivider/>
    </>
  );
};

export default TxDetailsActionsInterpretation;
