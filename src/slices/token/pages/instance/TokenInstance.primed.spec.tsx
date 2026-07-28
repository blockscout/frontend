// @vitest-environment jsdom
import { describe } from 'vitest';
import checkPrimedRequests from 'vitest/utils/checkPrimedRequests';

const TOKEN_HASH = '0xEb533ee5687044E622C69c58B1B12329F56eD9ad';
const INSTANCE_ID = '42';

// the real page mounts the slice inside the default layout (src/pages/_app.tsx getLayout)
const loadComponent = async() => {
  const [ { 'default': Layout }, { 'default': TokenInstance } ] = await Promise.all([
    import('src/shell/layout/Layout'),
    import('./TokenInstance'),
  ]);

  return { 'default': () => <Layout><TokenInstance/></Layout> };
};

describe('token instance page primed requests', () => {
  checkPrimedRequests({
    page: '/token/[hash]/instance/[id]',
    url: `/token/${ TOKEN_HASH }/instance/${ INSTANCE_ID }`,
    loadComponent,
  });

  checkPrimedRequests({
    title: 'nothing is primed on a non-default tab',
    page: '/token/[hash]/instance/[id]',
    url: `/token/${ TOKEN_HASH }/instance/${ INSTANCE_ID }?tab=token_transfers`,
    loadComponent,
    expectEmpty: true,
  });
});
