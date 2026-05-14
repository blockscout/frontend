// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { TransactionType } from 'client/slices/tx/types/api';

import TxType from 'client/slices/tx/components/TxType';

import { Badge } from 'toolkit/chakra/badge';

import { camelCaseToSentence } from '../utils/translation';

export interface Props {
  txTypes: Array<TransactionType>;
  isLoading?: boolean;
  type: string | undefined;
}

const FILTERED_TYPES = [ 'unclassified' ];

const TxTranslationType = ({ txTypes, isLoading, type }: Props) => {

  if (!type || FILTERED_TYPES.includes(type.toLowerCase())) {
    return <TxType types={ txTypes } isLoading={ isLoading }/>;
  }

  return (
    <Badge colorPalette="purple" loading={ isLoading }>
      { camelCaseToSentence(type) }
    </Badge>
  );

};

export default TxTranslationType;
