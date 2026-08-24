// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type * as tac from '@blockscout/tac-operation-lifecycle-types';

import type { BadgeProps } from 'src/toolkit/chakra/badge';
import { Badge } from 'src/toolkit/chakra/badge';

import { getTacOperationRoute } from '../utils/tac-operation';

interface Props extends BadgeProps {
  type: tac.V2OperationType;
  isRollback?: boolean;
}

const TacOperationTag = ({ type, isRollback, ...rest }: Props) => {

  if (isRollback) {
    return <Badge { ...rest }>Rollback</Badge>;
  }

  const text = getTacOperationRoute(type);

  if (!text) {
    return null;
  }

  return <Badge { ...rest }>{ text }</Badge>;
};

export default React.memo(TacOperationTag);
