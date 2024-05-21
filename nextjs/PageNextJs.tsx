import Head from 'next/head';
import React from 'react';

import type { Route } from 'nextjs-routes';
import type { Props as PageProps } from 'nextjs/getServerSideProps';

import config from 'configs/app';
import useAdblockDetect from 'lib/hooks/useAdblockDetect';
import useGetCsrfToken from 'lib/hooks/useGetCsrfToken';
import * as metadata from 'lib/metadata';
import * as mixpanel from 'lib/mixpanel';
import { init as initSentry } from 'lib/sentry/config';

interface Props<Pathname extends Route['pathname']> {
  pathname: Pathname;
  children: React.ReactNode;
  query?: PageProps<Pathname>['query'];
  apiData?: PageProps<Pathname>['apiData'];
}

initSentry();

const PageNextJs = <Pathname extends Route['pathname']>(props: Props<Pathname>) => {
  const { title, description, opengraph, canonical } = metadata.generate(props, props.apiData);

  useGetCsrfToken();
  useAdblockDetect();

  const isMixpanelInited = mixpanel.useInit();
  mixpanel.useLogPageView(isMixpanelInited);

  return (
    <>
      <Head>
        <title>{ title }</title>
        <meta name="description" content={ description }/>
        { canonical && <link rel="canonical" href={ canonical }/> }

        { /* OG TAGS */ }
        <meta property="og:title" content={ opengraph.title }/>
        { opengraph.description && <meta property="og:description" content={ opengraph.description }/> }
        <meta property="og:image" content={ opengraph.imageUrl }/>
        <meta property="og:type" content="website"/>

        { /* Twitter Meta Tags */ }
        <meta name="twitter:card" content="summary_large_image"/>
        <meta property="twitter:domain" content={ config.app.host }/>
        <meta name="twitter:title" content={ opengraph.title }/>
        { opengraph.description && <meta name="twitter:description" content={ opengraph.description }/> }
        <meta property="twitter:image" content={ opengraph.imageUrl }/>
      </Head>
      { props.children }
    </>
  );
};

export default React.memo(PageNextJs);
