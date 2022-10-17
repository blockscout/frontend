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
import type { NextPageContext } from 'next';
import NextErrorComponent from 'next/error';
import React from 'react';

import sentryConfig from 'configs/sentry/nextjs';

type ContextOrProps = {
  req?: NextPageContext['req'];
  res?: NextPageContext['res'];
  err?: NextPageContext['err'] | string;
  pathname?: string;
  statusCode?: number;
};

const CustomErrorComponent = (props: { statusCode: number }) => {
  return <NextErrorComponent statusCode={ props.statusCode }/>;
};

CustomErrorComponent.getInitialProps = async(contextData: ContextOrProps) => {
  Sentry.init(sentryConfig);

  // In case this is running in a serverless function, await this in order to give Sentry
  // time to send the error before the lambda exits
  await Sentry.captureUnderscoreErrorException(contextData);

  // This will contain the status code of the response
  return NextErrorComponent.getInitialProps(contextData as NextPageContext);
};

export default CustomErrorComponent;
