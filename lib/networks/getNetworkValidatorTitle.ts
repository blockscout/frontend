import config from 'configs/app';

export default function getNetworkValidatorTitle() {
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
    case 'sequencing': {
      return 'sequencer';
    }
    default: {
      return 'miner';
    }
  }
}
