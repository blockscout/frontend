// @vitest-environment jsdom
import { ENVS_MAP } from 'src/config/test-utils/env-presets';

import { describe } from 'vitest';
import checkPrimedRequests from 'vitest/utils/checkPrimedRequests';

// the real page mounts the slice inside the default layout (src/pages/_app.tsx getLayout)
const loadComponent = async() => {
  const [ { 'default': Layout }, { 'default': Tokens } ] = await Promise.all([
    import('src/shell/layout/Layout'),
    import('./Tokens'),
  ]);

  return { 'default': () => <Layout><Tokens/></Layout> };
};

describe('tokens page primed requests', () => {
  checkPrimedRequests({
    page: '/tokens',
    url: '/tokens',
    loadComponent,
  });

  // the list request reflects the URL filters — the primer must forward them from
  // location.search so the query string byte-matches the client's request
  checkPrimedRequests({
    title: 'primed request forwards the URL filter and sort params',
    page: '/tokens',
    url: '/tokens?q=usdc&type=ERC-20&sort=holders_count&order=desc',
    loadComponent,
  });

  checkPrimedRequests({
    title: 'nothing is primed for the multichain tokens page',
    page: '/tokens',
    url: '/tokens',
    loadComponent,
    envs: ENVS_MAP.multichain,
    expectEmpty: true,
  });

  checkPrimedRequests({
    title: 'nothing is primed on a non-default tab',
    page: '/tokens',
    url: '/tokens?tab=bridged',
    loadComponent,
    expectEmpty: true,
  });
});
