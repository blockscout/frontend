// SPDX-License-Identifier: LicenseRef-Blockscout

import type { IframeEcosystemHandler } from '@lifi/widget-light';
import { useEthereumIframeHandler } from '@lifi/widget-light/ethereum';
import { useCallback, useMemo, useRef } from 'react';
import * as v from 'valibot';
import { isHash } from 'viem';

import { useMarketplaceWalletActivity } from '../../../hooks/useMarketplaceWalletActivity';

const BATCH_SUCCESS_STATUS = 200;
const BATCH_FAILURE_STATUS = 300;
type ConfirmTransaction = (hash: string) => Promise<void>;
const batchRequestSchema = v.tuple([ v.object({ calls: v.array(v.object({ to: v.optional(v.string()) })) }) ]);
const batchIdSchema = v.union([ v.string(), v.object({ id: v.string() }) ]);
const batchStatusSchema = v.object({
  status: v.union([ v.number(), v.literal('CONFIRMED'), v.literal('PENDING') ]),
  receipts: v.optional(v.array(v.object({ status: v.string(), transactionHash: v.string() }))),
});

export function useSwapWallet(): IframeEcosystemHandler {
  const handler = useEthereumIframeHandler();
  const { prepareTransaction, trackTransaction, logEvent } = useMarketplaceWalletActivity('swap', true);
  const pendingBatches = useRef(new Map<string, ConfirmTransaction>());

  const sendCalls = useCallback<IframeEcosystemHandler['handleRequest']>(async(id, method, params) => {
    const request = v.safeParse(batchRequestSchema, params);
    if (!request.success || !request.output[0].calls.length) {
      return handler.handleRequest(id, method, params);
    }
    // LI.FI appends the swap call after approvals and uses the last receipt for its transaction hash.
    const confirm = await prepareTransaction(request.output[0].calls.at(-1)?.to ?? '');
    const result = await handler.handleRequest(id, method, params);
    const parsedId = v.safeParse(batchIdSchema, result);
    if (parsedId.success) {
      const batchId = typeof parsedId.output === 'string' ? parsedId.output : parsedId.output.id;
      pendingBatches.current.set(batchId, confirm);
      logEvent('Send Transaction');
    }
    return result;
  }, [ handler, prepareTransaction, logEvent ]);

  const confirmCalls = useCallback(async(params: unknown, result: unknown) => {
    const batchId: unknown = Array.isArray(params) ? params[0] : undefined;
    if (typeof batchId !== 'string') {
      return;
    }
    const confirm = pendingBatches.current.get(batchId);
    const response = v.safeParse(batchStatusSchema, result);
    if (!confirm || !response.success) {
      return;
    }
    const { status, receipts } = response.output;
    if (typeof status === 'number' && status >= BATCH_FAILURE_STATUS) {
      pendingBatches.current.delete(batchId);
      return;
    }
    const isConfirmed = status === 'CONFIRMED' || (typeof status === 'number' && status >= BATCH_SUCCESS_STATUS);
    const hash = receipts?.at(-1)?.transactionHash;
    if (!isConfirmed || !hash || !isHash(hash) || !receipts?.every((receipt) => receipt.status === '0x1')) {
      return;
    }
    pendingBatches.current.delete(batchId);
    await confirm(hash);
  }, []);

  const handleRequest = useCallback<IframeEcosystemHandler['handleRequest']>(async(id, method, params) => {
    if (method === 'wallet_sendCalls') {
      return sendCalls(id, method, params);
    }
    if (method === 'eth_sendTransaction') {
      const transaction: unknown = Array.isArray(params) ? params[0] : undefined;
      const to = transaction && typeof transaction === 'object' && 'to' in transaction && typeof transaction.to === 'string' ?
        transaction.to : '';
      return trackTransaction(to, () => handler.handleRequest(id, method, params));
    }

    const result = await handler.handleRequest(id, method, params);
    if (method === 'wallet_getCallsStatus') {
      await confirmCalls(params, result);
    } else if (method === 'personal_sign' || method === 'eth_sign') {
      logEvent('Sign Message');
    } else if (method === 'eth_signTypedData_v4') {
      logEvent('Sign Typed Data');
    }
    return result;
  }, [ handler, trackTransaction, logEvent, sendCalls, confirmCalls ]);

  return useMemo(() => ({ ...handler, handleRequest }), [ handler, handleRequest ]);
}
