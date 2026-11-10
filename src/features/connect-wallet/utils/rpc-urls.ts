// SPDX-License-Identifier: LicenseRef-Blockscout

import config from 'src/config';
import * as cookies from 'src/shared/storage/cookies';

export const CUSTOM_RPC_IN_USE_VALUE = 'true';

export function resolveCustomRpcUrl(url: string | undefined, inUseFlag: string | undefined): string | undefined {
  if (inUseFlag !== CUSTOM_RPC_IN_USE_VALUE || !url) {
    return;
  }

  try {
    return new URL(url).protocol === 'https:' ? url : undefined;
  } catch {
    return;
  }
}

export function getCustomRpcUrl(): string | undefined {
  return resolveCustomRpcUrl(cookies.get(cookies.NAMES.CUSTOM_RPC_URL), cookies.get(cookies.NAMES.CUSTOM_RPC_IN_USE));
}

interface Options {
  withCoreApiFallback?: boolean;
}

export function getRpcUrls({ withCoreApiFallback }: Options = {}): Array<string> {
  const customUrl = getCustomRpcUrl();

  if (customUrl) {
    return [ customUrl ];
  }

  const coreApi = config.apis.core;
  const coreApiFallback = withCoreApiFallback && coreApi ? `${ coreApi.endpoint }${ coreApi.basePath ?? '' }/api/eth-rpc` : undefined;

  return [ ...config.chain.rpcUrls, coreApiFallback ].filter(Boolean);
}
