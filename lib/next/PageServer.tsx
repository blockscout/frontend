import Head from 'next/head';
import type { Route } from 'nextjs-routes';
import React from 'react';

import * as metadata from 'lib/metadata';
import Page from 'ui/shared/Page/Page';

type Props = Route & {
  children: React.ReactNode;
}

const PageServer = (props: Props) => {
  const { title, description } = metadata.generate(props);

  return (
    <>
      <Head>
        <title>{ title }</title>
        <meta name="description" content={ description }/>
      </Head>
      <Page>
        { props.children }
      </Page>
    </>
  );
};

export default React.memo(PageServer);
