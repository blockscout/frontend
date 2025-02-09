import React from 'react';

import type { TransactionType } from 'types/api/transaction';

import Tag from 'ui/shared/chakra/Tag';

import { camelCaseToSentence } from './noves/utils';
import TxType from './TxType';

export interface Props {
  types: Array<TransactionType>;
  isLoading?: boolean;
  translationType: string | undefined;
}

const TxTranslationType = ({ types, isLoading, translationType }: Props) => {

  const filteredTypes = [ 'unclassified' ];

  if (!translationType || filteredTypes.includes(translationType)) {
    return <TxType types={ types } isLoading={ isLoading }/>;
  }

  return (
    <Tag colorScheme="purple" isLoading={ isLoading }>
      { camelCaseToSentence(translationType) }
    </Tag>
  );

};

export default TxTranslationType;
