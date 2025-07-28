import type { Feature } from './types';

import { getEnvValue } from '../utils';

const title = 'Raw trace';

const config: Feature<{ isEnabled: true | false }> = (() => {
  const isEnabled = getEnvValue('NEXT_PUBLIC_ENABLE_RAW_TRACE') === 'true';

  return Object.freeze({
    title,
    isEnabled,
  });
})();

export default config;
