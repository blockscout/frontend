import Head from 'next/head';
import React from 'react';

import type { Route } from 'nextjs-routes';

import useAdblockDetect from 'lib/hooks/useAdblockDetect';
import useConfigSentry from 'lib/hooks/useConfigSentry';
import useGetCsrfToken from 'lib/hooks/useGetCsrfToken';
import * as metadata from 'lib/metadata';
import * as mixpanel from 'lib/mixpanel';

type Props = Route & {
  children: React.ReactNode;
}

const PageNextJs = (props: Props) => {
  const { title, description } = metadata.generate(props);

  useGetCsrfToken();
  useAdblockDetect();
  useConfigSentry();

  const isMixpanelInited = mixpanel.useInit();
  mixpanel.useLogPageView(isMixpanelInited);

  return (
    <>
      <Head>
        <title>{ title }</title>
        <meta name="description" content={ description }/>
      </Head>
      { props.children }
    </>
  );
};

export default React.memo(PageNextJs);
