// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import { useAppContext } from 'src/shell/app/context';

import { useRpcNodePingQuery } from './useRpcNodePingQuery';
import type { RpcNodeStatus } from './utils';
import { getRpcNodeStatus, getSavedRpcNode, isRpcNodeSettingAvailable } from './utils';

export interface CustomRpcNodeStatus {
  readonly status: RpcNodeStatus;
  readonly isPending: boolean;
}

export function useCustomRpcNodeStatus(): CustomRpcNodeStatus | undefined {
  const { cookies } = useAppContext();
  const [ savedNode ] = React.useState(() => getSavedRpcNode(cookies));
  const url = isRpcNodeSettingAvailable() && savedNode.isInUse ? savedNode.url : undefined;

  const pingQuery = useRpcNodePingQuery(url);

  if (!url) {
    return;
  }

  return {
    status: getRpcNodeStatus(pingQuery.data?.outcome ?? 'connected'),
    isPending: pingQuery.data === undefined,
  };
}
