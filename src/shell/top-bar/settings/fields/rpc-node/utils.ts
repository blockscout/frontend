// SPDX-License-Identifier: LicenseRef-Blockscout

import { CUSTOM_RPC_IN_USE_VALUE } from 'src/features/connect-wallet/utils/rpc-urls';

import config from 'src/config';
import * as cookies from 'src/shared/storage/cookies';
import type { IconName } from 'src/sprite/SpriteIcon';

import type { AlertProps } from 'src/toolkit/chakra/alert';
import type { BadgeProps } from 'src/toolkit/chakra/badge';
import { SECOND } from 'src/toolkit/utils/consts';

export type RpcPingOutcome = 'connected' | 'wrong-chain' | 'unknown-chain' | 'unreachable';

export interface RpcPingResult {
  readonly outcome: RpcPingOutcome;
  readonly chainId: string | undefined;
}

export type RpcNodeState = RpcPingOutcome | 'disconnected';

export interface RpcNodeStatus {
  readonly tag: { readonly label: string; readonly colorPalette: BadgeProps['colorPalette'] };
  readonly nodeText: string;
  readonly plug: { readonly icon: IconName; readonly color: string };
  readonly alert: { readonly status: AlertProps['status']; readonly text: string } | undefined;
}

const PING_TIMEOUT = 5 * SECOND;

const HEX_CHAIN_ID_REGEXP = /^0x[0-9a-f]+$/i;

export const RPC_URL_INVALID_MESSAGE = 'Invalid format';

export function validateRpcUrl(value: string): true | string {
  if (value === '') {
    return true;
  }

  try {
    return new URL(value).protocol === 'https:' || RPC_URL_INVALID_MESSAGE;
  } catch {
    return RPC_URL_INVALID_MESSAGE;
  }
}

export interface SavedRpcNode {
  readonly url: string | undefined;
  readonly isInUse: boolean;
}

export function getSavedRpcNode(): SavedRpcNode {
  const url = cookies.get(cookies.NAMES.CUSTOM_RPC_URL);
  return {
    url: url || undefined,
    isInUse: Boolean(url) && cookies.get(cookies.NAMES.CUSTOM_RPC_IN_USE) === CUSTOM_RPC_IN_USE_VALUE,
  };
}

export function isRpcNodeSettingAvailable(): boolean {
  return !config.features.multichain.isEnabled && config.chain.rpcUrls.length > 0;
}

function readChainId(body: unknown): string | undefined {
  if (typeof body !== 'object' || body === null || !('result' in body)) {
    return;
  }

  const result = body.result;

  return typeof result === 'string' && HEX_CHAIN_ID_REGEXP.test(result) ? result : undefined;
}

export async function pingRpcNode(url: string): Promise<RpcPingResult> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_chainId', params: [] }),
      signal: AbortSignal.timeout(PING_TIMEOUT),
    });

    if (!response.ok) {
      return { outcome: 'unreachable', chainId: undefined };
    }

    const chainId = readChainId(await response.json());

    if (chainId === undefined) {
      return { outcome: 'unknown-chain', chainId: undefined };
    }

    const outcome = String(parseInt(chainId, 16)) === config.chain.id ? 'connected' : 'wrong-chain';

    return { outcome, chainId };
  } catch {
    return { outcome: 'unreachable', chainId: undefined };
  }
}

const WRONG_CHAIN_TEXT = 'This RPC belongs to a different network. Make sure you\'re using the correct RPC URL to avoid displaying incorrect data.';
const UNKNOWN_CHAIN_TEXT = 'We couldn\'t identify the network for this RPC. Please verify the RPC URL and make sure it matches your selected network.';
const UNREACHABLE_TEXT = 'This RPC node isn\'t responding. Check the URL and try again.';

const CUSTOM_NODE_TEXT = 'Using your custom node';

export function getRpcNodeStatus(state: RpcNodeState): RpcNodeStatus {
  switch (state) {
    case 'connected':
      return {
        tag: { label: 'Connected', colorPalette: 'green' },
        nodeText: CUSTOM_NODE_TEXT,
        plug: { icon: 'integration/full', color: 'green.500' },
        alert: undefined,
      };
    case 'wrong-chain':
      return {
        tag: { label: 'Connected', colorPalette: 'green' },
        nodeText: CUSTOM_NODE_TEXT,
        plug: { icon: 'integration/full', color: 'orange.500' },
        alert: { status: 'warning', text: WRONG_CHAIN_TEXT },
      };
    case 'unknown-chain':
      return {
        tag: { label: 'Connected', colorPalette: 'green' },
        nodeText: CUSTOM_NODE_TEXT,
        plug: { icon: 'integration/full', color: 'orange.500' },
        alert: { status: 'info', text: UNKNOWN_CHAIN_TEXT },
      };
    case 'unreachable':
      return {
        tag: { label: 'Not responding', colorPalette: 'red' },
        nodeText: CUSTOM_NODE_TEXT,
        plug: { icon: 'integration/full', color: 'red.500' },
        alert: { status: 'error', text: UNREACHABLE_TEXT },
      };
    case 'disconnected':
      return {
        tag: { label: 'Disconnected', colorPalette: 'gray' },
        nodeText: 'Using the default node',
        plug: { icon: 'integration/partial', color: 'icon.secondary' },
        alert: undefined,
      };
  }
}
