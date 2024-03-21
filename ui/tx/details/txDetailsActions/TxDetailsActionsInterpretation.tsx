import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import { TX_INTERPRETATION } from 'stubs/txInterpretation';
import DetailsActionsWrapper from 'ui/shared/DetailsActionsWrapper';
import DetailsInfoItemDivider from 'ui/shared/DetailsInfoItemDivider';
import TxInterpretation from 'ui/shared/tx/interpretation/TxInterpretation';

interface Props {
  hash?: string;
  isTxDataLoading: boolean;
}

const TxDetailsActionsInterpretation = ({ hash, isTxDataLoading }: Props) => {
  const txInterpretationQuery = useApiQuery('tx_interpretation', {
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
      <DetailsActionsWrapper isLoading={ isTxDataLoading || txInterpretationQuery.isPlaceholderData } type="tx">
        { actions.map((action, index: number) => (
          <TxInterpretation
            key={ index }
            summary={ action }
            isLoading={ isTxDataLoading || txInterpretationQuery.isPlaceholderData }
          />
        ),
        ) }
      </DetailsActionsWrapper>
      <DetailsInfoItemDivider/>
    </>
  );
};

export default TxDetailsActionsInterpretation;
