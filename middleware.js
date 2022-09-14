const { NextResponse } = require('next/server');

const { NAMES } = require('lib/cookies');
const { link } = require('lib/link/link');
const findNetwork = require('lib/networks/findNetwork').default;

export function middleware(req) {
  const [ , networkType, networkSubtype ] = req.nextUrl.pathname.split('/');
  const networkParams = {
    network_type: networkType,
    network_sub_type: networkSubtype,
  };
  const selectedNetwork = findNetwork(networkParams);

  if (selectedNetwork) {
    const apiToken = req.cookies.get(NAMES.API_TOKEN);

    if (!apiToken) {
      const authUrl = link('auth', networkParams);
      return NextResponse.redirect(authUrl);
    }
  }
}

export const config = {
  matcher: '/:network_type/:network_sub_type/account/:path*',
};
