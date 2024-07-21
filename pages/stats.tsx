import type { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

import Stats from 'ui/pages/Stats';

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/stats">
      <Stats/>
    </PageNextJs>
  );
};

export default Page;

//export { stats as getServerSideProps } from 'nextjs/getServerSideProps';

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
      ])),
    },
  };
}
