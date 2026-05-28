// SPDX-License-Identifier: LicenseRef-Blockscout

import config from 'client/config';

// TODO delete when page descriptions is refactored
export default function getChainTitle() {
  return config.chain.name + (config.chain.shortName ? ` (${ config.chain.shortName })` : '') + ' Explorer';
}
