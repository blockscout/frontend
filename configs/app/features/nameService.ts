import type { Feature } from './types';

import apis from '../apis';

const title = 'Name service integration';

const config: Feature<{}> = (() => {
  if (apis.bens) {
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
