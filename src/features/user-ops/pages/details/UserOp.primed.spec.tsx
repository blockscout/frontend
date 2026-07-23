// @vitest-environment jsdom
import { ENVS_MAP } from 'src/config/test-utils/env-presets';

import { describe } from 'vitest';
import checkPrimedRequests from 'vitest/utils/checkPrimedRequests';

const USER_OP_HASH = '0xd829d43a222a4d0ac26b09fcaa4ea431a3b0327f8b2e29e26f4bd05a26cf2481';

// the real page mounts the feature page inside the default layout (src/pages/_app.tsx getLayout)
const loadComponent = async() => {
  const [ { 'default': Layout }, { 'default': UserOp } ] = await Promise.all([
    import('src/shell/layout/Layout'),
    import('./UserOp'),
  ]);

  return { 'default': () => <Layout><UserOp/></Layout> };
};

describe('user operation page primed requests', () => {
  // the /op route is server-gated on the user-ops feature, so exercise it with that config
  checkPrimedRequests({
    page: '/op/[hash]',
    url: `/op/${ USER_OP_HASH }`,
    loadComponent,
    envs: ENVS_MAP.userOps,
  });

  checkPrimedRequests({
    title: 'primed requests match with the interpretation feature enabled',
    page: '/op/[hash]',
    url: `/op/${ USER_OP_HASH }`,
    loadComponent,
    envs: [ ...ENVS_MAP.userOps, ...ENVS_MAP.txInterpretation ],
  });

  checkPrimedRequests({
    title: 'nothing is primed on a non-default tab',
    page: '/op/[hash]',
    url: `/op/${ USER_OP_HASH }?tab=logs`,
    loadComponent,
    envs: ENVS_MAP.userOps,
    expectEmpty: true,
  });
});
