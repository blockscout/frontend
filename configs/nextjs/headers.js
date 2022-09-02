const getCspPolicy = require('./getCspPolicy');

async function headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: getCspPolicy(),
        },
      ],
    },
  ];
}

module.exports = headers;
