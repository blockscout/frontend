import type CspDev from 'csp-dev';

export function arweaveIdApi(): CspDev.DirectiveDescriptor {
  return {
    'connect-src': [ 'arweaveid-api.vercel.app' ],
  };
}
