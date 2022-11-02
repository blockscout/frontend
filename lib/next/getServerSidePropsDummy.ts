import type { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async({ res }) => {
  res.setHeader(
    'Cache-Control',
    `public, s-maxage=${ 60 * 60 }, stale-while-revalidate=${ 2 * 60 * 60 }`,
  );

  return { props: {} };
};
