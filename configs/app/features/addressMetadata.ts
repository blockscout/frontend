import type { Feature } from './types';

import apis from '../apis';

const title = 'Address metadata';

const config: Feature<{}> = (() => {
  if (apis.metadata) {
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
