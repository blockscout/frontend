import _omit from 'lodash/omit';
import Head from 'next/head';
import React from 'react';

import type { Route } from 'nextjs-routes';
import type { Props as PageProps } from 'nextjs/getServerSideProps';

import useAdblockDetect from 'lib/hooks/useAdblockDetect';
import useGetCsrfToken from 'lib/hooks/useGetCsrfToken';
import * as metadata from 'lib/metadata';
import * as mixpanel from 'lib/mixpanel';
import { init as initSentry } from 'lib/sentry/config';

interface Props<Pathname extends Route['pathname']> {
  pathname: Pathname;
  children: React.ReactNode;
  pageProps?: PageProps;
}

initSentry();

const PageNextJs = <Pathname extends Route['pathname']>(props: Props<Pathname>) => {
  const { title, description, opengraph } = React.useMemo(() => {
    const query = _omit(props.pageProps, 'apiData');
    return metadata.generate(
      { pathname: props.pathname, query },
      props.pageProps?.apiData,
    );
  }, [ props.pageProps, props.pathname ]);

  useGetCsrfToken();
  useAdblockDetect();

  const isMixpanelInited = mixpanel.useInit();
  mixpanel.useLogPageView(isMixpanelInited);

  return (
    <>
      <Head>
        <title>{ title }</title>
        <meta name="description" content={ description }/>

        { /* OG TAGS */ }
        <meta property="og:title" content={ opengraph.title }/>
        { opengraph.description && <meta property="og:description" content={ opengraph.description }/> }
        <meta property="og:image" content={ opengraph.imageUrl }/>
        <meta name="twitter:card" content="summary_large_image"/>
        <meta property="twitter:image" content={ opengraph.imageUrl }/>
        <meta property="og:type" content="website"/>
      </Head>
      { props.children }
    </>
  );
};

export default React.memo(PageNextJs);
