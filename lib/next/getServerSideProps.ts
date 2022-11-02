import type { GetServerSideProps, GetServerSidePropsResult } from 'next';

export type Props = {
  cookies: string;
}

export const getServerSideProps: GetServerSideProps = async({ req, res }): Promise<GetServerSidePropsResult<Props>> => {
  res.setHeader(
    'Cache-Control',
    `public, s-maxage=${ 60 * 60 }, stale-while-revalidate=${ 2 * 60 * 60 }`,
  );

  return {
    props: {
      cookies: req.headers.cookie || '',
    },
  };
};
