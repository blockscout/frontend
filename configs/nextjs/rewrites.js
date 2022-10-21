async function rewrites() {
  // there can be networks without subtype
  // routing in nextjs allows optional params only at the end of the path
  // if there are paths with subtype and subsubtype, we will change the routing
  // but so far we think we're ok with this hack
  //
  // UPDATE: as for now I hardcoded all networks without subtype
  // because we cannot do proper dynamic rewrites in middleware using runtime ENVs
  // see issue - https://github.com/vercel/next.js/discussions/35231
  // it seems like it's solved but it's not actually

  return [
    { source: '/node-api/:slug*', destination: '/api/:slug*' },
    { source: '/astar/:slug*', destination: '/astar/mainnet/:slug*' },
    { source: '/shiden/:slug*', destination: '/shiden/mainnet/:slug*' },
  ];
}

module.exports = rewrites;
