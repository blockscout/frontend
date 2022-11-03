import type { GetServerSideProps, GetServerSidePropsResult } from 'next';

export type Props = {
  cookies: string;
}

export const getServerSideProps: GetServerSideProps = async({ req }): Promise<GetServerSidePropsResult<Props>> => {
  return {
    props: {
      cookies: req.headers.cookie || '',
    },
  };
};
