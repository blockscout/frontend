// SPDX-License-Identifier: LicenseRef-Blockscout

import config from 'configs/app';

export default function getChainValidatorTitle() {
  switch (config.chain.verificationType) {
    case 'validation': {
      return 'validator';
    }
    case 'mining': {
      return 'miner';
    }
    case 'posting': {
      return 'poster';
    }
    case 'fee reception': {
      return 'fee recipient';
    }
    default: {
      return 'miner';
    }
  }
}
