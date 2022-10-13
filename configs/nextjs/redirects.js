async function redirects() {
  const homePagePath = '/' + [ process.env.NEXT_PUBLIC_NETWORK_TYPE, process.env.NEXT_PUBLIC_NETWORK_SUBTYPE ].filter(Boolean).join('/');
  return [
    {
      source: '/',
      destination: homePagePath,
      permanent: false,
    },
  ];
}

module.exports = redirects;
