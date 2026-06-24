// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import config from 'src/config';

import TxDetailsActionsInterpretation from './TxDetailsActionsInterpretation';

type Props = {
  isTxDataLoading: boolean;
  hash?: string;
};

const TxDetailsActions = ({ isTxDataLoading, hash }: Props) => {
  if (config.features.txInterpretation.isEnabled) {
    return <TxDetailsActionsInterpretation hash={ hash } isTxDataLoading={ isTxDataLoading }/>;
  }

  return null;
};

export default TxDetailsActions;
