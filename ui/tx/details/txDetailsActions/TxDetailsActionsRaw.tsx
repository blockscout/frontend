import React from 'react';

import type { TxAction } from 'types/api/txAction';

import DetailsInfoItemDivider from 'ui/shared/DetailsInfoItemDivider';

import TxDetailsAction from './TxDetailsAction';
import TxDetailsActionsWrapper from './TxDetailsActionsWrapper';

interface Props {
  actions: Array<TxAction>;
  isLoading: boolean;
}

const TxDetailsActionsRaw = ({ actions, isLoading }: Props) => {
  return (
    <>
      <TxDetailsActionsWrapper isLoading={ isLoading }>
        { actions.map((action, index: number) => <TxDetailsAction key={ index } action={ action }/>) }
      </TxDetailsActionsWrapper>
      <DetailsInfoItemDivider/>
    </>
  );
};

export default TxDetailsActionsRaw;
