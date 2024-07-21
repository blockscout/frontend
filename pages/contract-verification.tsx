import type { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';

import type { Props } from 'nextjs/getServerSideProps';
import PageNextJs from 'nextjs/PageNextJs';

import ContractVerification from 'ui/pages/ContractVerification';

const Page: NextPage<Props> = (props: Props) => {
  return (
    <PageNextJs pathname="/contract-verification" query={ props }>
      <ContractVerification/>
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
