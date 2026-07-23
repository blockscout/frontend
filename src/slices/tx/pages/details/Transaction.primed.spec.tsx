// @vitest-environment jsdom
import { ENVS_MAP } from 'src/config/test-utils/env-presets';

import { describe } from 'vitest';
import checkPrimedRequests from 'vitest/utils/checkPrimedRequests';

const TX_HASH = '0xd829d43a222a4d0ac26b09fcaa4ea431a3b0327f8b2e29e26f4bd05a26cf2481';

// the real page mounts the slice inside the default layout (src/pages/_app.tsx getLayout)
const loadComponent = async() => {
  const [ { 'default': Layout }, { 'default': Transaction } ] = await Promise.all([
    import('src/shell/layout/Layout'),
    import('./Transaction'),
  ]);

  return { 'default': () => <Layout><Transaction/></Layout> };
};

describe('tx page primed requests', () => {
  checkPrimedRequests({
    page: '/tx/[hash]',
    url: `/tx/${ TX_HASH }`,
    loadComponent,
  });

  checkPrimedRequests({
    title: 'primed requests match with the interpretation feature enabled',
    page: '/tx/[hash]',
    url: `/tx/${ TX_HASH }`,
    loadComponent,
    envs: ENVS_MAP.txInterpretation,
  });

  checkPrimedRequests({
    title: 'nothing is primed on a non-default tab',
    page: '/tx/[hash]',
    url: `/tx/${ TX_HASH }?tab=logs`,
    loadComponent,
    expectEmpty: true,
  });
});
