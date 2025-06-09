import config from 'configs/app';
import * as multichainConfig from 'configs/multichain/config.nodejs';

(async() => {
  config.features.multichain.isEnabled && await multichainConfig.load();
})();
