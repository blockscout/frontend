import config from 'configs/app';
import * as multichainConfig from 'configs/multichain/config.nodejs';

(async() => {
  config.features.opSuperchain.isEnabled && await multichainConfig.load();
})();
