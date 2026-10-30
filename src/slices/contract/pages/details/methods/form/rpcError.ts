// SPDX-License-Identifier: LicenseRef-Blockscout

import { HttpRequestError, InternalRpcError, LimitExceededRpcError, TimeoutError } from 'viem';

export type RpcErrorKind = 'not-responding' | 'other';

function isNodeFailure(error: unknown): boolean {
  return (
    error instanceof HttpRequestError ||
    error instanceof TimeoutError ||
    error instanceof LimitExceededRpcError ||
    error instanceof InternalRpcError
  );
}

export function classifyRpcError(error: unknown): RpcErrorKind {
  const seen = new Set<unknown>();
  let current: unknown = error;

  while (current instanceof Error && !seen.has(current)) {
    if (isNodeFailure(current)) {
      return 'not-responding';
    }

    seen.add(current);
    current = current.cause;
  }

  return 'other';
}

export interface RpcNotRespondingCopy {
  readonly text: string;
  readonly linkText: string;
}

export function getRpcNotRespondingCopy(isCustomRpcInUse: boolean): RpcNotRespondingCopy {
  return isCustomRpcInUse ?
    { text: 'Your RPC node is not responding.', linkText: 'Check the RPC node URL and try again.' } :
    { text: 'The RPC node is not responding.', linkText: 'Try your own RPC node.' };
}
