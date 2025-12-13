import type { Feature } from './types';

import apis from '../apis';
import app from '../app';
import account from './account';
import blockchainInteraction from './blockchainInteraction';

const title = 'Rewards service integration';

const config: Feature<{}> = (() => {
  if (app.appProfile !== 'private' && apis.rewards && account.isEnabled && blockchainInteraction.isEnabled) {
    return Object.freeze({
      title,
      isEnabled: true,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
