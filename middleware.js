const { NextResponse } = require('next/server');

const NETWORKS = require('lib/networks/availableNetworks').default;

export function middleware(req) {
  const [ , networkType, networkSubtype ] = req.nextUrl.pathname.split('/');
  const selectedNetwork = NETWORKS.find(({ type, subType }) =>
    type === networkType && (subType ? subType === networkSubtype : true));

  if (selectedNetwork) {
    const apiToken = req.cookies.get('_explorer_key');

    if (!apiToken) {
      const authPath = `/${ selectedNetwork.type }/${ selectedNetwork.subType }auth/auth0`;

      return NextResponse.redirect(new URL(authPath, 'https://blockscout.com/'));
    }
  }
}

export const config = {
  matcher: '/:network_type/:network_sub_type/account/:path*',
};
