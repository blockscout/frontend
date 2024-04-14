import type { Feature } from './types';

const specUrl = '/static/swagger.yaml';

const title = 'REST API documentation';

const config: Feature<{ specUrl: string }> = (() => {
  return Object.freeze({
    title,
    isEnabled: true,
    specUrl,
  });
})();

export default config;
