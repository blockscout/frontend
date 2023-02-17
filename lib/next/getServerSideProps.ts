import type { GetServerSideProps } from 'next';

export type Props = {
  cookies: string;
  referrer: string;
  id?: string;
  height?: string;
  hash?: string;
}

export const getServerSideProps: GetServerSideProps<Props> = async({ req, query }) => {
  return {
    props: {
      cookies: req.headers.cookie || '',
      referrer: req.headers.referer || '',
      id: query.id?.toString() || '',
      height: query.height?.toString() || '',
      hash: query.hash?.toString() || '',
    },
  };
};
