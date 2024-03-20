/* eslint-disable max-len */
import Head from 'next/head';
import React from 'react';

import type { Route } from 'nextjs-routes';

import useAdblockDetect from 'lib/hooks/useAdblockDetect';
import useGetCsrfToken from 'lib/hooks/useGetCsrfToken';
import * as metadata from 'lib/metadata';
import * as mixpanel from 'lib/mixpanel';
import { init as initSentry } from 'lib/sentry/config';

type Props = Route & {
  children: React.ReactNode;
}

initSentry();

const PageNextJs = (props: Props) => {
  const { title, description, opengraph } = metadata.generate(props);

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
        <meta property="og:description" content={ opengraph.description }/>
        <meta property="og:image" content="https://ogcdn.net/e4b8c678-7bd5-445d-ba03-bfaad510c686/v3/orbit-demo-bs-custom.alt.technology/This%20is%20NEXT_PUBLIC_OG_TITLE/https%3A%2F%2Forbit-demo-bs-custom.alt.technology%2Fassets%2Fog_image.svg/og.png"/>
        <meta property="og:type" content="website"/>
        <meta property="og:url" content={ opengraph.url.origin }/>

        { /* Twitter Meta Tags  */ }
        <meta name="twitter:card" content="summary_large_image"/>
        <meta property="twitter:domain" content={ opengraph.url.host }/>
        <meta property="twitter:url" content={ opengraph.url.origin }/>
        <meta name="twitter:title" content={ opengraph.title }/>
        <meta name="twitter:description" content={ opengraph.description }/>
        <meta name="twitter:image" content="https://ogcdn.net/e4b8c678-7bd5-445d-ba03-bfaad510c686/v3/orbit-demo-bs-custom.alt.technology/This%20is%20NEXT_PUBLIC_OG_TITLE/https%3A%2F%2Forbit-demo-bs-custom.alt.technology%2Fassets%2Fog_image.svg/og.png"/>
      </Head>
      { props.children }
    </>
  );
};

export default React.memo(PageNextJs);
