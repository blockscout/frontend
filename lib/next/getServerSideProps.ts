import type { GetServerSideProps, GetServerSidePropsResult } from 'next';

export type Props = {
  cookies: string;
  referrer: string;
}

export const getServerSideProps: GetServerSideProps = async({ req }): Promise<GetServerSidePropsResult<Props>> => {
  return {
    props: {
      cookies: req.headers.cookie || '',
      referrer: req.headers.referer || '',
    },
  };
};
