import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

import config from 'configs/app';
import LinkExternal from 'ui/shared/LinkExternal';
import PageTitle from 'ui/shared/Page/PageTitle';

const feature = config.features.marketplace;

const Marketplace = dynamic(() => import('ui/pages/Marketplace'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/apps">
      <>
        <PageTitle
          title="DAppscout"
          contentAfter={ feature.isEnabled && (
            <LinkExternal href={ feature.submitFormUrl } variant="subtle" fontSize="sm" lineHeight={ 5 } ml="auto">
              Submit app
            </LinkExternal>
          ) }
        />
        <Marketplace/>
      </>
    </PageNextJs>
  );
};

export default Page;

export { marketplace as getServerSideProps } from 'nextjs/getServerSideProps';
