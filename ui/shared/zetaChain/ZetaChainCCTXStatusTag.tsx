import React from 'react';

import type { ZetaChainCCTXStatus } from 'types/api/zetaChain';

import { Tag } from 'toolkit/chakra/tag';

type Props = {
  status: ZetaChainCCTXStatus;
  isLoading?: boolean;
};

const TagText: Record<ZetaChainCCTXStatus, string> = {
  PENDING_OUTBOUND: 'Pending outbound',
  PENDING_INBOUND: 'Pending inbound',
  OUTBOUND_MINED: 'Outbound mined',
  PENDING_REVERT: 'Pending revert',
  ABORTED: 'Aborted',
  REVERTED: 'Reverted',
};

const ZetaChainCCTXStatusTag = ({ status, isLoading }: Props) => {
  return (
    <Tag loading={ isLoading }>
      { TagText[status] }
    </Tag>
  );
};

export default React.memo(ZetaChainCCTXStatusTag);
