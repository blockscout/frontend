import type { Feature } from './types';

const title = 'Multichain explorer';

const config: Feature<{ }> = (() => {
  return Object.freeze({
    title,
    isEnabled: true,
  });
})();

export default config;
