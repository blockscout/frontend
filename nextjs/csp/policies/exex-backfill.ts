import type CspDev from 'csp-dev';

export function arweaveExexBackfill(): CspDev.DirectiveDescriptor {
  return {
    'connect-src': [ 'arweave-exex-backfill.shuttleapp.rs' ],
  };
}
