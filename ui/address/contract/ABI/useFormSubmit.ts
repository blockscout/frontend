import React from 'react';

import type { FormSubmitHandler } from './types';

import config from 'configs/app';

import useCallMethodApi from './useCallMethodApi';
import useCallMethodWalletClient from './useCallMethodWalletClient';

interface Params {
  tab: string;
  addressHash: string;
}

function useFormSubmit({ tab, addressHash }: Params): FormSubmitHandler {
  const callMethodApi = useCallMethodApi();
  const callMethodWalletClient = useCallMethodWalletClient();

  return React.useCallback(async(item, args, strategy) => {
    switch (strategy) {
      case 'api': {
        if (!('method_id' in item)) {
          throw new Error('Method ID is not defined');
        }
        return callMethodApi({
          args,
          methodId: item.method_id,
          addressHash,
          isCustomAbi: tab === 'read_custom_methods' || tab === 'write_custom_methods',
          isProxy: tab === 'read_proxy' || tab === 'write_proxy',
        });
      }
      case 'wallet_client': {
        return callMethodWalletClient({ args, item, addressHash });
      }

      default: {
        throw new Error(`Unknown call strategy "${ strategy }"`);
      }
    }
  }, [ addressHash, callMethodApi, callMethodWalletClient, tab ]);
}

function useFormSubmitFallback({ tab, addressHash }: Params): FormSubmitHandler {
  const callMethodApi = useCallMethodApi();

  return React.useCallback(async(item, args, strategy) => {
    switch (strategy) {
      case 'api': {
        if (!('method_id' in item)) {
          throw new Error('Method ID is not defined');
        }
        return callMethodApi({
          args,
          methodId: item.method_id,
          addressHash,
          isCustomAbi: tab === 'read_custom_methods' || tab === 'write_custom_methods',
          isProxy: tab === 'read_proxy' || tab === 'write_proxy',
        });
      }

      default: {
        throw new Error(`Unknown call strategy "${ strategy }"`);
      }
    }

  }, [ addressHash, callMethodApi, tab ]);
}

const hook = config.features.blockchainInteraction.isEnabled ? useFormSubmit : useFormSubmitFallback;

export default hook;
