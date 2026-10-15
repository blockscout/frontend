import { describe, expect, it } from 'vitest';

import { getIpfsUri } from './utils';

const CID = 'bafybeigdyrztx7ls4mrwlwyfm2p3zjnyxyuhx2qrcdxjr2bnqh6qhvcfsy';

describe('getIpfsUri', () => {
  it.each([
    [ 'ipfs://' + CID + '/1.png', 'ipfs://' + CID + '/1.png' ],
    [ 'ipfs://ipfs/' + CID + '/1.png', 'ipfs://' + CID + '/1.png' ],
  ])('keeps a native URI addressing the content: %s', (url, expected) => {
    expect(getIpfsUri(url)).toBe(expected);
  });

  it.each([
    [ 'https://ipfs.io/ipfs/' + CID, 'ipfs://' + CID ],
    [ 'https://ipfs.io/ipfs/' + CID + '/', 'ipfs://' + CID ],
    [ 'https://gateway.pinata.cloud/ipfs/' + CID + '/images/1.png?filename=1.png', 'ipfs://' + CID + '/images/1.png?filename=1.png' ],
    [ 'http://localhost:8080/ipfs/' + CID + '/1.png', 'ipfs://' + CID + '/1.png' ],
  ])('converts a path gateway URL: %s', (url, expected) => {
    expect(getIpfsUri(url)).toBe(expected);
  });

  it.each([
    [ 'https://' + CID + '.ipfs.dweb.link', 'ipfs://' + CID ],
    [ 'https://' + CID + '.ipfs.w3s.link/images/1.png', 'ipfs://' + CID + '/images/1.png' ],
    [ 'https://' + CID + '.ipfs.dweb.link/1.png?v=2', 'ipfs://' + CID + '/1.png?v=2' ],
  ])('converts a subdomain gateway URL: %s', (url, expected) => {
    expect(getIpfsUri(url)).toBe(expected);
  });

  it.each([
    'ipns://example.eth/1.png',
    'https://ipfs.io/ipns/example.eth/1.png',
    'https://example-eth.ipns.dweb.link/1.png',
  ])('leaves an IPNS name to the HTTP transport: %s', (url) => {
    expect(getIpfsUri(url)).toBeUndefined();
  });

  it.each([
    'https://example.com/images/ipfs.png',
    'https://ipfs.io/',
    'https://ipfs.io/ipfs/',
    'https://' + CID + '.ipfs/1.png',
    'ftp://ipfs.io/ipfs/' + CID,
    'ar://some-arweave-id',
    'not a url ipfs',
  ])('rejects a URL that does not address IPFS content: %s', (url) => {
    expect(getIpfsUri(url)).toBeUndefined();
  });
});
