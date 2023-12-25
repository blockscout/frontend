import React from 'react';

import type { TxAction } from 'types/api/txAction';

import TxDetailsAction from './TxDetailsAction';
import TxDetailsActionsWrapper from './TxDetailsActionsWrapper';

interface Props {
  actions: Array<TxAction>;
  isLoading: boolean;
}

const TxDetailsActionsFallback = ({ actions, isLoading }: Props) => {
  return (
    <TxDetailsActionsWrapper isLoading={ isLoading }>
      { actions.map((action, index: number) => <TxDetailsAction key={ index } action={ action }/>) }
    </TxDetailsActionsWrapper>
  );
};

export default TxDetailsActionsFallback;
