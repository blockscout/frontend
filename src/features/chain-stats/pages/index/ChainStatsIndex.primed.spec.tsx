// @vitest-environment jsdom
import { ENVS_MAP } from 'src/config/test-utils/env-presets';

import { describe } from 'vitest';
import checkPrimedRequests from 'vitest/utils/checkPrimedRequests';

// the real page mounts the feature page inside the default layout (src/pages/_app.tsx getLayout)
const loadComponent = async() => {
  const [ { 'default': Layout }, { 'default': ChainStatsIndex } ] = await Promise.all([
    import('src/shell/layout/Layout'),
    import('./ChainStatsIndex'),
  ]);

  return { 'default': () => <Layout><ChainStatsIndex/></Layout> };
};

describe('chain stats page primed requests', () => {
  checkPrimedRequests({
    page: '/stats',
    url: '/stats',
    loadComponent,
  });

  checkPrimedRequests({
    title: 'nothing is primed for the multichain stats page',
    page: '/stats',
    url: '/stats',
    loadComponent,
    envs: ENVS_MAP.multichain,
    expectEmpty: true,
  });
});
