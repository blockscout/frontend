// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { TxAction } from '../../types/api';

import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';
import DetailedInfoActionsWrapper from 'src/shared/detailed-info/DetailedInfoActionsWrapper';

import TxDetailsAction from './TxDetailsAction';

interface Props {
  actions: Array<TxAction>;
  isLoading: boolean;
}

const TxDetailsActionsRaw = ({ actions, isLoading }: Props) => {
  return (
    <>
      <DetailedInfoActionsWrapper isLoading={ isLoading } type="tx">
        { actions.map((action, index: number) => <TxDetailsAction key={ index } action={ action }/>) }
      </DetailedInfoActionsWrapper>
      <DetailedInfo.ItemDivider/>
    </>
  );
};

export default TxDetailsActionsRaw;
