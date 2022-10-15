const BASE_PATH = require('../../lib/link/basePath.js');
const PATHS = require('../../lib/link/paths.js');

const oldUrls = [
  {
    oldPath: '/account/tag_address',
    newPath: `${ PATHS.private_tags }?tab=address`,
  },
  {
    oldPath: '/account/tag_transaction',
    newPath: `${ PATHS.private_tags }?tab=tx`,
  },
  {
    oldPath: '/pending-transactions',
    newPath: `${ PATHS.txs }?tab=pending`,
  },
  {
    oldPath: '/tx/:id/internal-transactions',
    newPath: `${ PATHS.tx }?tab=internal`,
  },
  {
    oldPath: '/tx/:id/logs',
    newPath: `${ PATHS.tx }?tab=logs`,
  },
  {
    oldPath: '/tx/:id/raw-trace',
    newPath: `${ PATHS.tx }?tab=raw_trace`,
  },
  {
    oldPath: '/tx/:id/state',
    newPath: `${ PATHS.tx }?tab=state`,
  },
  {
    oldPath: '/uncles',
    newPath: `${ PATHS.blocks }?tab=uncles`,
  },
  {
    oldPath: '/reorgs',
    newPath: `${ PATHS.blocks }?tab=reorgs`,
  },
  {
    oldPath: '/block/:id/transactions',
    newPath: `${ PATHS.block }?tab=txs`,
  },
];

async function redirects() {
  const homePagePath = '/' + [ process.env.NEXT_PUBLIC_NETWORK_TYPE, process.env.NEXT_PUBLIC_NETWORK_SUBTYPE ].filter(Boolean).join('/');

  return [
    {
      source: '/',
      destination: homePagePath,
      permanent: false,
    },
    ...oldUrls.map(item => {
      const source = BASE_PATH.replaceAll('[', ':').replaceAll(']', '') + item.oldPath;
      const destination = item.newPath.replaceAll('[', ':').replaceAll(']', '');
      return { source, destination, permanent: false };
    }),
  ];
}

module.exports = redirects;
