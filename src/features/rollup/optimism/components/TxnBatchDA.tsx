// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';
import type { ExcludeUndefined } from 'src/shared/types/utils';

import type { BadgeProps } from 'src/toolkit/chakra/badge';
import { Badge } from 'src/toolkit/chakra/badge';

export interface Props extends Omit<BadgeProps, 'container'> {
  container?: ExcludeUndefined<schemas['BlockResponse']['optimism']>['batch_data_container'];
  isLoading?: boolean;
}

const OptimisticL2TxnBatchDA = ({ container, isLoading, ...rest }: Props) => {

  const text = (() => {
    switch (container) {
      case 'in_blob4844':
        return 'EIP-4844 blob';
      case 'in_calldata':
        return 'Calldata';
      case 'in_celestia':
        return 'Celestia blob';
      case 'in_eigenda':
        return 'EigenDA';
    }
  })();

  if (!text) {
    return null;
  }

  return (
    <Badge colorPalette="yellow" loading={ isLoading } { ...rest }>
      { text }
    </Badge>
  );
};

export default React.memo(OptimisticL2TxnBatchDA);
