import type { Feature } from './types';

import { getEnvValue, parseEnvJson } from '../utils';

type TxExternalTransactionsConfig = {
  chain_name: string;
  chain_logo_url: string;
  explorer_url_template: string;
};

const externalTransactionsConfig = parseEnvJson<TxExternalTransactionsConfig>(getEnvValue('NEXT_PUBLIC_TX_EXTERNAL_TRANSACTIONS_CONFIG'));

const title = 'External transactions';

const config: Feature<{ chainName: string; chainLogoUrl: string; explorerUrlTemplate: string }> = (() => {
  if (externalTransactionsConfig) {
    return Object.freeze({
      title,
      isEnabled: true,
      chainName: externalTransactionsConfig.chain_name,
      chainLogoUrl: externalTransactionsConfig.chain_logo_url,
      explorerUrlTemplate: externalTransactionsConfig.explorer_url_template,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
