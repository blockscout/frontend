import React from 'react';

import type * as tac from '@blockscout/tac-operation-lifecycle-types';

import type { BadgeProps } from 'toolkit/chakra/badge';
import { Badge } from 'toolkit/chakra/badge';

interface Props extends BadgeProps {
  type: tac.OperationType;
}

const TacOperationTag = ({ type, ...rest }: Props) => {

  const text = (() => {
    switch (type) {
      case 'TON_TAC_TON':
        return 'TON > TAC > TON';
      case 'TAC_TON':
        return 'TAC > TON';
      case 'TON_TAC':
        return 'TON > TAC';
      case 'ERROR':
        return 'Rollback';
      default:
        return null;
    }
  })();

  if (!text) {
    return null;
  }

  return <Badge { ...rest }>{ text }</Badge>;
};

export default React.memo(TacOperationTag);
