import type { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import dynamic from 'next/dynamic';
import React from 'react';

import type { Props } from 'nextjs/getServerSideProps';
import PageNextJs from 'nextjs/PageNextJs';

const Transaction = dynamic(() => import('ui/pages/Transaction'), { ssr: false });

const Page: NextPage<Props> = (props: Props) => {
  return (
    <PageNextJs pathname="/tx/[hash]" query={ props }>
      <Transaction/>
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
    { params: { hash: '0x6c03a1147b962839e331e7fdab3df0f29a6cfa51bd47b25a6133e074ca08457e' } },
  ];

  return {
    paths,
    fallback: 'blocking',
  };
};
