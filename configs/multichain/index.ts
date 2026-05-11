import type { MultichainConfig } from 'types/multichain';

import config from 'configs/app';
import { isBrowser } from 'toolkit/utils/isBrowser';

import * as multichainConfigNodejs from './config.nodejs';

const multichainConfig: () => MultichainConfig | undefined = () => {
  if (!config.features.multichain.isEnabled) {
    return;
  }

  if (isBrowser()) {
    return window.__multichainConfig;
  }

  return multichainConfigNodejs.getValue();
};

export default multichainConfig;
