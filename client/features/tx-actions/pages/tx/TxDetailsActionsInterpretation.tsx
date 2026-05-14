// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import useApiQuery from 'client/api/hooks/useApiQuery';

import TxInterpretation from 'client/features/tx-interpretation/common/components/TxInterpretation';

import { TX_INTERPRETATION } from 'stubs/txInterpretation';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import DetailedInfoActionsWrapper from 'ui/shared/DetailedInfo/DetailedInfoActionsWrapper';

interface Props {
  hash?: string;
  isTxDataLoading: boolean;
}

const TxDetailsActionsInterpretation = ({ hash, isTxDataLoading }: Props) => {
  const txInterpretationQuery = useApiQuery('general:tx_interpretation', {
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
