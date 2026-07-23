// @vitest-environment jsdom
import { ENVS_MAP } from 'src/config/test-utils/env-presets';

import { describe } from 'vitest';
import checkPrimedRequests from 'vitest/utils/checkPrimedRequests';

// the real page mounts the slice inside its layout (src/pages/index.tsx getLayout), and the
// shell contributes first-render requests of its own (e.g. the header's indexing alert)
const loadComponent = async() => {
  const [ { 'default': LayoutHome }, { 'default': Home } ] = await Promise.all([
    import('src/shell/layout/LayoutHome'),
    import('./Home'),
  ]);

  return { 'default': () => <LayoutHome><Home/></LayoutHome> };
};

describe('home page primed requests', () => {
  checkPrimedRequests({
    page: '/',
    url: '/',
    loadComponent,
  });

  checkPrimedRequests({
    title: 'primed requests match on an arbitrum rollup',
    page: '/',
    url: '/',
    loadComponent,
    envs: ENVS_MAP.arbitrumRollup,
  });

  checkPrimedRequests({
    title: 'arbitrum batches widget does not prime latest_batch when the stats widget is off',
    page: '/',
    url: '/',
    loadComponent,
    envs: [
      ...ENVS_MAP.arbitrumRollup,
      [ 'NEXT_PUBLIC_HOMEPAGE_STATS', '["average_block_time","total_txs","wallet_addresses","gas_tracker"]' ],
    ],
  });

  checkPrimedRequests({
    title: 'nothing is primed for the multichain home page',
    page: '/',
    url: '/',
    loadComponent,
    envs: ENVS_MAP.multichain,
    expectEmpty: true,
  });
});
