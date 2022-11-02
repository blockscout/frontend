import type { GetStaticProps, GetStaticPropsResult } from 'next';

export const getStaticProps: GetStaticProps = async(): Promise<GetStaticPropsResult<{ [key: string]: unknown }>> => {
  return {
    props: {},
  };
};
