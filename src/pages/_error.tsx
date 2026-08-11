// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPageContext } from 'next';
import NextErrorComponent from 'next/error';
import React from 'react';
import Rollbar from 'rollbar';

import type { Props as ServerSidePropsCommon } from 'src/server/getServerSideProps/handlers';

import config from 'src/config';
import { buildServerConfig } from 'src/services/rollbar/serverConfig';
import * as cookies from 'src/shared/storage/cookies';

const rollbar = config.services.rollbar.clientToken ?
  new Rollbar(buildServerConfig(config.services.rollbar.clientToken)) :
  undefined;

type Props = ServerSidePropsCommon & {
  statusCode: number;
};

const CustomErrorComponent = (props: Props) => {
  const colorModeCookie = cookies.getFromCookieString(props.cookies || '', cookies.NAMES.COLOR_MODE);
  return <NextErrorComponent statusCode={ props.statusCode } withDarkMode={ colorModeCookie === 'dark' }/>;
};

CustomErrorComponent.getInitialProps = async(context: NextPageContext) => {
  const { res, err, req } = context;

  const baseProps = await NextErrorComponent.getInitialProps(context); // Extract cookies from the request headers
  const statusCode = res?.statusCode ?? err?.statusCode;
  const cookies = req?.headers?.cookie || '';

  if (rollbar) {
    // Pass the Error itself, not just its message, so Rollbar builds a trace carrying `exception.class`
    // — the field the shared `isIgnoredExceptionClass` check in the server config reads to drop the DOM
    // / Abort noise. Falls back to a bare message when Next.js hands us no error object.
    rollbar.error(err ?? 'Unknown error', { cause: err?.cause });
  }

  return {
    ...baseProps,
    statusCode,
    cookies,
  };
};

export default CustomErrorComponent;
