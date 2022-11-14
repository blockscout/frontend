import type { GetServerSideProps, GetServerSidePropsResult } from 'next';

export type Props = {
  cookies: string;
  referrer: string;
  id?: string;
}

export const getServerSideProps: GetServerSideProps = async({ req, query }): Promise<GetServerSidePropsResult<Props>> => {
  return {
    props: {
      cookies: req.headers.cookie || '',
      referrer: req.headers.referer || '',
      id: query.id?.toString() || '',
    },
  };
};
