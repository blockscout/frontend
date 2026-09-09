// SPDX-License-Identifier: LicenseRef-Blockscout

import config from 'src/config';

const PRO_API_URL = 'https://api.blockscout.com';
const PRO_API_KEY_PLACEHOLDER = '{PRO_API_KEY}';

function getCoreApiEndpoint() {
  return config.apis.core ? `${ config.apis.core.endpoint }${ config.apis.core.basePath ?? '' }` : '';
}

function getRpcUrl() {
  if (config.chain.rpcUrls[0]) {
    return config.chain.rpcUrls[0];
  }

  if (config.chain.isProApiSupported) {
    return `${ PRO_API_URL }/${ config.chain.id }/json-rpc?apikey=${ PRO_API_KEY_PLACEHOLDER }`;
  }

  const coreApiEndpoint = getCoreApiEndpoint();

  return coreApiEndpoint ? `${ coreApiEndpoint }/api/eth-rpc` : '';
}

export function getHardhatVerificationParams() {
  if (config.chain.isProApiSupported) {
    return {
      rpcUrl: getRpcUrl(),
      apiKey: PRO_API_KEY_PLACEHOLDER,
      apiUrl: `${ PRO_API_URL }/${ config.chain.id }/api`,
    };
  }

  const coreApiEndpoint = getCoreApiEndpoint();

  return {
    rpcUrl: getRpcUrl(),
    apiKey: 'empty',
    apiUrl: coreApiEndpoint ? `${ coreApiEndpoint }/api` : '',
  };
}

export function getFoundryVerificationParams() {
  if (config.chain.isProApiSupported) {
    return {
      rpcUrl: getRpcUrl(),
      apiKey: PRO_API_KEY_PLACEHOLDER,
      verifierUrl: `${ PRO_API_URL }/v2/api?chain_id=${ config.chain.id }`,
    };
  }

  const coreApiEndpoint = getCoreApiEndpoint();

  return {
    rpcUrl: getRpcUrl(),
    apiKey: undefined,
    verifierUrl: coreApiEndpoint ? `${ coreApiEndpoint }/api/` : '',
  };
}
