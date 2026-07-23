// @vitest-environment jsdom
import { ENVS_MAP } from 'src/config/test-utils/env-presets';

import { describe } from 'vitest';
import checkPrimedRequests from 'vitest/utils/checkPrimedRequests';

const ADDRESS_HASH = '0xEb533ee5687044E622C69c58B1B12329F56eD9ad';

// the real page mounts the slice inside the default layout (src/pages/_app.tsx getLayout)
const loadComponent = async() => {
  const [ { 'default': Layout }, { 'default': Address } ] = await Promise.all([
    import('src/shell/layout/Layout'),
    import('./Address'),
  ]);

  return { 'default': () => <Layout><Address/></Layout> };
};

describe('address page primed requests', () => {
  checkPrimedRequests({
    page: '/address/[hash]',
    url: `/address/${ ADDRESS_HASH }`,
    loadComponent,
  });

  checkPrimedRequests({
    title: 'primed requests match with user ops and xStar score enabled',
    page: '/address/[hash]',
    url: `/address/${ ADDRESS_HASH }`,
    loadComponent,
    envs: [ ...ENVS_MAP.userOps, ...ENVS_MAP.xStarScore ],
  });

  checkPrimedRequests({
    title: 'nothing is primed for the multichain address page',
    page: '/address/[hash]',
    url: `/address/${ ADDRESS_HASH }`,
    loadComponent,
    envs: ENVS_MAP.multichain,
    expectEmpty: true,
  });

  checkPrimedRequests({
    title: 'nothing is primed on a non-default tab',
    page: '/address/[hash]',
    url: `/address/${ ADDRESS_HASH }?tab=txs`,
    loadComponent,
    expectEmpty: true,
  });
});
