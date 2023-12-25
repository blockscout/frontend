import React from 'react';

import type { TxInterpretationSummary } from 'types/api/txInterpretation';

import TxInterpretation from 'ui/tx/interpretation/TxInterpretation';

import TxDetailsActionsWrapper from './TxDetailsActionsWrapper';

interface Props {
  actions?: Array<TxInterpretationSummary>;
  isLoading: boolean;
}

const TxDetailsActionsInterpretation = ({ isLoading, actions }: Props) => {
  if (!actions || actions.length < 2) {
    return null;
  }
  return (
    <TxDetailsActionsWrapper isLoading={ isLoading }>
      { actions.map((action, index: number) => <TxInterpretation key={ index } summary={ action } isLoading={ isLoading }/>) }
    </TxDetailsActionsWrapper>
  );
};

export default TxDetailsActionsInterpretation;
