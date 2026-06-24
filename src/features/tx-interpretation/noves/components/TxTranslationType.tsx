// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import TxType from 'src/slices/tx/components/TxType';

import { Badge } from 'src/toolkit/chakra/badge';

import { camelCaseToSentence } from '../utils/translation';

export interface Props {
  txTypes: schemas['Transaction']['transaction_types'];
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
