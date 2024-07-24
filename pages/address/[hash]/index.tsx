import type { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import dynamic from 'next/dynamic';
import React from 'react';

import type { Props } from 'nextjs/getServerSideProps';
import PageNextJs from 'nextjs/PageNextJs';

const Address = dynamic(() => import('ui/pages/Address'), { ssr: false });

const Page: NextPage<Props> = (props: Props) => {
  return (
    <PageNextJs pathname="/address/[hash]" query={ props }>
      <Address/>
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
    { params: { hash: '0x3Cd0A705a2DC65e5b1E1205896BaA2be8A07c6e0' } },
  ];

  return {
    paths,
    fallback: 'blocking',
  };
};
