import React from 'react';

import type { TransactionType } from 'types/api/transaction';

import { Badge } from 'toolkit/chakra/badge';

import { camelCaseToSentence } from './noves/utils';
import TxType from './TxType';

export interface Props {
  types: Array<TransactionType>;
  isLoading?: boolean;
  translatationType: string | undefined;
}

const TxTranslationType = ({ types, isLoading, translatationType }: Props) => {

  const filteredTypes = [ 'unclassified' ];

  if (!translatationType || filteredTypes.includes(translatationType)) {
    return <TxType types={ types } isLoading={ isLoading }/>;
  }

  return (
    <Badge colorPalette="purple" loading={ isLoading }>
      { camelCaseToSentence(translatationType) }
    </Badge>
  );

};

export default TxTranslationType;
