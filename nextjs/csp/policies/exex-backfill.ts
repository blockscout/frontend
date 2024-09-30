import type CspDev from 'csp-dev';

export function arweaveExexBackfill(): CspDev.DirectiveDescriptor {
  return {
    'connect-src': [ 'exex-backfill-api.vercel.app' ],
  };
}
