import NextErrorComponent from 'next/error';
import React from 'react';

import type { Props as ServerSidePropsCommon } from 'nextjs/getServerSideProps';

import * as cookies from 'lib/cookies';

type Props = ServerSidePropsCommon & {
  statusCode: number;
};

const CustomErrorComponent = (props: Props) => {
  const colorModeCookie = cookies.getFromCookieString(props.cookies || '', cookies.NAMES.COLOR_MODE);
  return <NextErrorComponent statusCode={ props.statusCode } withDarkMode={ colorModeCookie === 'dark' }/>;
};

export default CustomErrorComponent;
