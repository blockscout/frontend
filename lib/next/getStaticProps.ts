import type { GetStaticProps, GetStaticPropsResult } from 'next';

export const getStaticProps: GetStaticProps = async(context): Promise<GetStaticPropsResult<{ [key: string]: unknown }>> => {
  return {
    props: {
      pageParams: context.params,
    },
  };
};
