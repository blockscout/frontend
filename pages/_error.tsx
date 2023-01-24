/**
 * NOTE: This requires `@sentry/nextjs` version 7.3.0 or higher.
 *
 * NOTE: If using this with `next` version 12.2.0 or lower, uncomment the
 * penultimate line in `CustomErrorComponent`.
 *
 * This page is loaded by Nextjs:
 *  - on the server, when data-fetching methods throw or reject
 *  - on the client, when `getInitialProps` throws or rejects
 *  - on the client, when a React lifecycle method throws or rejects, and it's
 *    caught by the built-in Nextjs error boundary
 *
 * See:
 *  - https://nextjs.org/docs/basic-features/data-fetching/overview
 *  - https://nextjs.org/docs/api-reference/data-fetching/get-initial-props
 *  - https://reactjs.org/docs/error-boundaries.html
 */

import * as Sentry from '@sentry/nextjs';
import type { GetServerSideProps } from 'next';
import NextErrorComponent from 'next/error';
import Head from 'next/head';
import React from 'react';

import sentryConfig from 'configs/sentry/nextjs';
import * as cookies from 'lib/cookies';
import getNetworkTitle from 'lib/networks/getNetworkTitle';
import type { Props as ServerSidePropsCommon } from 'lib/next/getServerSideProps';
import { getServerSideProps as getServerSidePropsCommon } from 'lib/next/getServerSideProps';
import AppError from 'ui/shared/AppError/AppError';
import Page from 'ui/shared/Page/Page';

type Props = ServerSidePropsCommon & {
  statusCode: number;
}

const CustomErrorComponent = (props: Props) => {
  if (props.statusCode === 404) {
    const title = getNetworkTitle();

    return (
      <>
        <Head>
          <title>{ title }</title>
        </Head>
        <Page>
          <AppError statusCode={ 404 } mt="50px"/>
        </Page>
      </>
    );
  }

  const colorModeCookie = cookies.getFromCookieString(props.cookies || '', cookies.NAMES.COLOR_MODE);
  return <NextErrorComponent statusCode={ props.statusCode } withDarkMode={ colorModeCookie === 'dark' }/>;
};

export default CustomErrorComponent;

export const getServerSideProps: GetServerSideProps = async(context) => {
  Sentry.init(sentryConfig);

  // In case this is running in a serverless function, await this in order to give Sentry
  // time to send the error before the lambda exits
  await Sentry.captureUnderscoreErrorException(context);

  const commonSSPResult = await getServerSidePropsCommon(context);
  const commonSSProps = 'props' in commonSSPResult ? commonSSPResult.props : undefined;

  return { props: { ...commonSSProps, statusCode: context.res.statusCode } };
};
