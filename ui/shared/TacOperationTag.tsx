import React from 'react';

import type * as tac from '@blockscout/tac-operation-lifecycle-types';

import type { BadgeProps } from 'toolkit/chakra/badge';
import { Badge } from 'toolkit/chakra/badge';
import { rightLineArrow } from 'toolkit/utils/htmlEntities';

interface Props extends BadgeProps {
  type: tac.OperationType;
}

const TacOperationTag = ({ type, ...rest }: Props) => {

  const text = (() => {
    switch (type) {
      case 'TON_TAC_TON':
        return `TON ${ rightLineArrow } TAC ${ rightLineArrow } TON`;
      case 'TAC_TON':
        return `TAC ${ rightLineArrow } TON`;
      case 'TON_TAC':
        return `TON ${ rightLineArrow } TAC`;
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
