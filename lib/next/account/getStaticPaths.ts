import type { GetStaticPaths } from 'next';

import getAvailablePaths from 'lib/networks/getAvailablePaths';

export const getStaticPaths: GetStaticPaths = async() => {
  return { paths: getAvailablePaths(), fallback: false };
};
