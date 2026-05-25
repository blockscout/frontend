// SPDX-License-Identifier: LicenseRef-Blockscout

import config from 'configs/app';

export default function getChainValidationActionText(chainConfig = config) {
  switch (chainConfig.chain.verificationType) {
    case 'validation': {
      return 'validated';
    }
    case 'mining': {
      return 'mined';
    }
    case 'posting': {
      return 'posted';
    }
    case 'fee reception': {
      return 'validated';
    }
    default: {
      return 'mined';
    }
  }
}
