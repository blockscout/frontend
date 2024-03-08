import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import { TX_INTERPRETATION } from 'stubs/txInterpretation';
import DetailsActionsWrapper from 'ui/shared/DetailsActionsWrapper';
import DetailsInfoItemDivider from 'ui/shared/DetailsInfoItemDivider';
import TxInterpretation from 'ui/shared/tx/interpretation/TxInterpretation';

interface Props {
  hash?: string;
  isUserOpDataLoading: boolean;
}

const TxDetailsActionsInterpretation = ({ hash, isUserOpDataLoading }: Props) => {
  const interpretationQuery = useApiQuery('user_op_interpretation', {
    pathParams: { hash },
    queryOptions: {
      enabled: Boolean(hash) && !isUserOpDataLoading,
      placeholderData: TX_INTERPRETATION,
      refetchOnMount: false,
    },
  });

  const actions = interpretationQuery.data?.data.summaries;

  if (!actions || actions.length < 2) {
    return null;
  }

  return (
    <>
      <DetailsActionsWrapper isLoading={ isUserOpDataLoading || interpretationQuery.isPlaceholderData } type="user_op">
        { actions.map((action, index: number) => (
          <TxInterpretation
            key={ index }
            summary={ action }
            isLoading={ isUserOpDataLoading || interpretationQuery.isPlaceholderData }
          />
        ),
        ) }
      </DetailsActionsWrapper>
      <DetailsInfoItemDivider/>
    </>
  );
};

export default TxDetailsActionsInterpretation;
