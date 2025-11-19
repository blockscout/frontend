import React from 'react';

import * as multichain from '@blockscout/multichain-aggregator-types';

import type { BadgeProps } from 'toolkit/chakra/badge';
import StatusTag from 'ui/shared/statusTag/StatusTag';

interface Props extends BadgeProps {
  status: multichain.InteropMessage_Status;
}

const CrossChainTxStatusTag = ({ status: statusProp, ...rest }: Props) => {

  const { status, text } = (() => {
    switch (statusProp) {
      case multichain.InteropMessage_Status.SUCCESS:
        return { status: 'ok' as const, text: 'Relayed' };
      case multichain.InteropMessage_Status.FAILED:
        return { status: 'error' as const, text: 'Failed' };
      case multichain.InteropMessage_Status.EXPIRED:
        return { status: 'error' as const, text: 'Expired' };
      case multichain.InteropMessage_Status.PENDING:
        return { status: 'pending' as const, text: 'Sent' };
      default:
        return { status: undefined, text: undefined };
    }
  })();

  if (!status || !text) {
    return null;
  }

  return <StatusTag type={ status } text={ text } { ...rest }/>;
};

export default React.memo(CrossChainTxStatusTag);
