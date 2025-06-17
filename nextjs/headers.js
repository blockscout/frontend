async function headers() {
  const headers = [
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
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
        {
          key: 'X-DNS-Prefetch-Control',
          value: 'on',
        },
        {
          key: 'Cross-Origin-Opener-Policy',
          value: 'same-origin',
        },
        {
          key: 'Referrer-Policy',
          value: 'origin-when-cross-origin',
        },
      ],
    },
  ];

  // // Add CORS headers only in development
  // if (process.env.NEXT_PUBLIC_APP_ENV === 'development') {
  //   headers[0].headers.push(
  //     {
  //       key: 'Access-Control-Allow-Origin',
  //       value: '*',
  //     },
  //     {
  //       key: 'Access-Control-Allow-Methods',
  //       value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
  //     },
  //     {
  //       key: 'Access-Control-Allow-Headers',
  //       value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
  //     }
  //   );
  // }

  return headers;
}

module.exports = headers;
