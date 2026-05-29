// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPageContext } from 'next';
import NextErrorComponent from 'next/error';
import React from 'react';
import Rollbar from 'rollbar';

import type { Props as ServerSidePropsCommon } from 'src/server/getServerSideProps/handlers';

import config from 'src/config';
import * as cookies from 'src/shared/storage/cookies';

const rollbar = config.services.rollbar.clientToken ? new Rollbar({
  accessToken: config.services.rollbar.clientToken,
  environment: config.services.rollbar.environment,
  payload: {
    code_version: config.services.rollbar.codeVersion,
    app_instance: config.services.rollbar.instance,
  },
  maxItems: 10,
  captureUncaught: true,
  captureUnhandledRejections: true,
}) : undefined;

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
    rollbar.error(err?.message ?? 'Unknown error', {
      cause: err?.cause,
      stack: err?.stack,
    });
  }

  return {
    ...baseProps,
    statusCode,
    cookies,
  };
};

export default CustomErrorComponent;
