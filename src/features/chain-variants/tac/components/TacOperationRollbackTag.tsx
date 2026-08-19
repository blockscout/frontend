// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { BadgeProps } from 'src/toolkit/chakra/badge';
import { Badge } from 'src/toolkit/chakra/badge';

/**
 * A sibling of the status tag rather than a fourth status value: `rollback` is independent of `status` in the
 * contract. Carries no tooltip of its own — the rollback wording lives in the status tag, which receives
 * `isRollback`. Exists so surfaces outside this feature can render the badge without owning tac markup.
 */
const TacOperationRollbackTag = (props: BadgeProps) => {
  return <Badge { ...props }>Rollback</Badge>;
};

export default React.memo(TacOperationRollbackTag);
