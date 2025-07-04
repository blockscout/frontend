import config from 'configs/app';

export default function getNetworkValidationActionText(chainConfig = config) {
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
    case 'sequencing': {
      return 'sequenced';
    }
    default: {
      return 'miner';
    }
  }
}
