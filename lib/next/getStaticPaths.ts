import type { GetStaticPaths } from 'next';

export const getStaticPaths: GetStaticPaths = async() => {
  return { paths: [], fallback: 'blocking' };
};
