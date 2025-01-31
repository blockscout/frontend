import React from 'react';

import type { TxAction } from 'types/api/txAction';

import DetailsActionsWrapper from 'ui/shared/DetailsActionsWrapper';
import DetailsInfoItemDivider from 'ui/shared/DetailsInfoItemDivider';

import TxDetailsAction from './TxDetailsAction';

interface Props {
  actions: Array<TxAction>;
  isLoading: boolean;
}

const TxDetailsActionsRaw = ({ actions, isLoading }: Props) => {
  return (
    <>
      <DetailsActionsWrapper isLoading={ isLoading } type="tx">
        { actions.map((action, index: number) => <TxDetailsAction key={ index } action={ action }/>) }
      </DetailsActionsWrapper>
      <DetailsInfoItemDivider/>
    </>
  );
};

export default TxDetailsActionsRaw;
