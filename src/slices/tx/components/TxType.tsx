// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import type { BadgeProps } from 'src/toolkit/chakra/badge';
import { Badge } from 'src/toolkit/chakra/badge';

type TransactionType = schemas['Transaction']['transaction_types'][number] |
'op_stack_l1_attributes_tx' |
'op_stack_post_exec_tx';

export interface Props extends BadgeProps {
  types: Array<TransactionType>;
  isLoading?: boolean;
}

const TYPES_ORDER: Array<TransactionType> = [
  'op_stack_l1_attributes_tx',
  'op_stack_post_exec_tx',
  'blob_transaction',
  'rootstock_remasc',
  'rootstock_bridge',
  'token_creation',
  'contract_creation',
  'token_transfer',
  'contract_call',
  'coin_transfer',
  // Listed last and deliberately given no label of its own — the details page header carries the
  // "Sponsored" tag instead, and lists have no room for it. An unlisted type would score -1 here and sort
  // ahead of every real one, masking labels like "Contract call".
  'sponsored_transaction',
];

const TxType = ({ types, isLoading, ...rest }: Props) => {
  const typeToShow = types.sort((t1, t2) => TYPES_ORDER.indexOf(t1) - TYPES_ORDER.indexOf(t2))[0];

  let label;
  let colorPalette: BadgeProps['colorPalette'];

  switch (typeToShow) {
    case 'contract_call':
      label = 'Contract call';
      colorPalette = 'blue';
      break;
    case 'blob_transaction':
      label = 'Blob txn';
      colorPalette = 'yellow';
      break;
    case 'contract_creation':
      label = 'Contract creation';
      colorPalette = 'blue';
      break;
    case 'token_transfer':
      label = 'Token transfer';
      colorPalette = 'orange';
      break;
    case 'token_creation':
      label = 'Token creation';
      colorPalette = 'orange';
      break;
    case 'coin_transfer':
      label = 'Coin transfer';
      colorPalette = 'orange';
      break;
    case 'op_stack_l1_attributes_tx':
      label = 'L1 attr tx';
      colorPalette = 'green';
      break;
    case 'op_stack_post_exec_tx':
      label = 'Post exec tx';
      colorPalette = 'green';
      break;
    case 'rootstock_remasc':
      label = 'REMASC';
      colorPalette = 'blue';
      break;
    case 'rootstock_bridge':
      label = 'Bridge';
      colorPalette = 'blue';
      break;
    default:
      label = 'Transaction';
      colorPalette = 'purple';
  }

  if (!label) {
    return null;
  }

  return (
    <Badge colorPalette={ colorPalette } loading={ isLoading } { ...rest }>
      { label }
    </Badge>
  );
};

export default TxType;
