const getCspPolicy = require('../../lib/csp/getCspPolicy');

async function headers() {
  return [
    {
      source: '/:path*',
      headers: [
        // security headers from here - https://nextjs.org/docs/advanced-features/security-headers
        {
          key: 'X-Frame-Options',
          value: 'SAMEORIGIN',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'Content-Security-Policy-Report-Only',
          value: getCspPolicy(),
        },
      ],
    },
  ];
}

module.exports = headers;
