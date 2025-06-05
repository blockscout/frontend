import type { MultichainConfig } from 'types/multichain';

import config from 'configs/app';
import { isBrowser } from 'toolkit/utils/isBrowser';

const multichainConfig: MultichainConfig | undefined = (() => {
  if (!config.features.multichain.isEnabled) {
    return;
  }

  if (isBrowser()) {
    return window.__multichainConfig;
  }

  try {
    const config = require('../../public/assets/multichain/config.json');
    return config;
  } catch (error) {}
})();

export default multichainConfig;
