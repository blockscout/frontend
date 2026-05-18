// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type * as tac from '@blockscout/tac-operation-lifecycle-types';

import type { BadgeProps } from 'toolkit/chakra/badge';
import { Badge } from 'toolkit/chakra/badge';

import { getTacOperationStatus } from '../utils/tac-operation';

interface Props extends BadgeProps {
  type: tac.OperationType;
}

const TacOperationTag = ({ type, ...rest }: Props) => {

  const text = getTacOperationStatus(type);

  if (!text) {
    return null;
  }

  return <Badge { ...rest }>{ text }</Badge>;
};

export default React.memo(TacOperationTag);
