// @vitest-environment jsdom
import { describe } from 'vitest';
import checkPrimedRequests from 'vitest/utils/checkPrimedRequests';

const BLOCK_HEIGHT = '17615608';

// the real page mounts the slice inside the default layout (src/pages/_app.tsx getLayout)
const loadComponent = async() => {
  const [ { 'default': Layout }, { 'default': Block } ] = await Promise.all([
    import('src/shell/layout/Layout'),
    import('./Block'),
  ]);

  return { 'default': () => <Layout><Block/></Layout> };
};

describe('block page primed requests', () => {
  checkPrimedRequests({
    page: '/block/[height_or_hash]',
    url: `/block/${ BLOCK_HEIGHT }`,
    loadComponent,
  });

  checkPrimedRequests({
    title: 'nothing is primed on a non-default tab',
    page: '/block/[height_or_hash]',
    url: `/block/${ BLOCK_HEIGHT }?tab=txs`,
    loadComponent,
    expectEmpty: true,
  });
});
