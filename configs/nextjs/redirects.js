async function redirects() {
  return [
    {
      source: '/',
      destination: '/poa/core',
      permanent: false,
    },
  ];
}

module.exports = redirects;
