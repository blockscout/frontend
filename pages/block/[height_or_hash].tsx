import type { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import dynamic from 'next/dynamic';
import React from 'react';

import type { Props } from 'nextjs/getServerSideProps';
import PageNextJs from 'nextjs/PageNextJs';

const Block = dynamic(() => import('ui/pages/Block'), { ssr: false });

const Page: NextPage<Props> = (props: Props) => {
  return (
    <PageNextJs pathname="/block/[height_or_hash]" query={ props }>
      <Block/>
    </PageNextJs>
  );
};

export default Page;

//export { base as getServerSideProps } from 'nextjs/getServerSideProps';

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
      ])),
    },
  };
}

export const getStaticPaths = async() => {
  const paths = [
    { params: { height_or_hash: '12345' } },
    { params: { height_or_hash: '67890' } },
  ];

  return {
    paths,
    fallback: 'blocking',
  };
};
