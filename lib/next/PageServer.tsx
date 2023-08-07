import Head from 'next/head';
import type { Route } from 'nextjs-routes';
import React from 'react';

import * as metadata from 'lib/metadata';

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
      { props.children }
    </>
  );
};

export default React.memo(PageServer);
