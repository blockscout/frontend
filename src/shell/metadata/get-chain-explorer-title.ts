// SPDX-License-Identifier: LicenseRef-Blockscout

import config from 'src/config';

export default function getChainExplorerTitle() {
  return config.chain.name + (config.chain.shortName ? ` (${ config.chain.shortName })` : '') + ' Explorer';
}
