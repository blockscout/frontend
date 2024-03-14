import type CspDev from 'csp-dev';

export function boolNetwork(): CspDev.DirectiveDescriptor {
  // we use Inter and Poppins in the app

  return {
    'connect-src': [
      'dev-api.boolscan.com',
      'https://dev-rpc-node-http.bool.network/',
    ],
  };
}
