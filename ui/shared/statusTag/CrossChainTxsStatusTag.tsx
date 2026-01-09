import React from 'react';

import type { BadgeProps } from 'toolkit/chakra/badge';

import StatusTag, { type Props as StatusTagProps } from './StatusTag';

interface Props extends BadgeProps {
  status: string;
  mode?: StatusTagProps['mode'];
}

const CrossChainTxsStatusTag = ({ status: statusProp, mode = 'compact', ...rest }: Props) => {

  const { status, text } = (() => {
    switch (statusProp) {
      case 'completed':
        return { status: 'ok' as const, text: 'Success' };
      case 'failed':
        return { status: 'error' as const, text: 'Failed' };
      case 'initiated':
        return { status: 'pending' as const, text: 'Pending' };
      default:
        return { status: undefined, text: undefined };
    }
  })();

  if (!status) {
    return null;
  }

  return <StatusTag type={ status } text={ text } mode={ mode } { ...rest }/>;
};

export default React.memo(CrossChainTxsStatusTag);
