import { beforeEach, describe, expect, it } from 'vitest';

import { TOKEN_ENV } from '../config';
import { entryOf, fetchNodes, rootOf } from './figma';

const REF = { fileKey: 'abcDEF0123456789abcDEF', nodeId: '22842:174340' };

describe('fetchNodes', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('fails without a token, naming no other source, and never calls Figma', async() => {
    await expect(fetchNodes(REF, {})).rejects.toThrow('No Figma token');
    await expect(fetchNodes(REF, { [TOKEN_ENV]: '  ' })).rejects.toThrow('No Figma token');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('reports a rejected token as the reason and mentions the 90-day expiry', async() => {
    fetchMock.mockResponseOnce('', { status: 403 });
    await expect(fetchNodes(REF, { [TOKEN_ENV]: 'expired' })).rejects
      .toThrow('Figma rejected the token (HTTP 403); personal access tokens expire after at most 90 days.');
    fetchMock.mockResponseOnce('', { status: 401 });
    await expect(fetchNodes(REF, { [TOKEN_ENV]: 'expired' })).rejects
      .toThrow('Figma rejected the token (HTTP 401); personal access tokens expire after at most 90 days.');
  });

  it('tells a missing file apart from any other failure, keeping the status', async() => {
    fetchMock.mockResponseOnce('', { status: 404 });
    await expect(fetchNodes(REF, { [TOKEN_ENV]: 'personal-token' })).rejects
      .toThrow('Figma returned 404: the file key is wrong or the token has no access to the file.');
    fetchMock.mockResponseOnce('', { status: 500 });
    await expect(fetchNodes(REF, { [TOKEN_ENV]: 'personal-token' })).rejects.toThrow('Figma nodes request failed with HTTP 500.');
  });

  it('asks the nodes endpoint for the one node with the token in the header', async() => {
    const document = { id: '22842:174340', name: 'n', type: 'FRAME' };
    fetchMock.mockResponseOnce(JSON.stringify({ name: 'f', lastModified: 'm', version: 'v', nodes: { '22842:174340': { document } } }));
    const payload = await fetchNodes(REF, { [TOKEN_ENV]: 'personal-token' });
    expect(fetchMock.mock.calls[0][0]).toBe('https://api.figma.com/v1/files/abcDEF0123456789abcDEF/nodes?ids=22842%3A174340');
    expect(fetchMock.mock.calls[0][1]).toEqual({ headers: { 'X-Figma-Token': 'personal-token' } });
    expect(rootOf(payload, '22842:174340').name).toBe('n');
  });

  it('names the node when the file does not contain it, whether the entry is null or absent', () => {
    expect(() => rootOf({ name: 'f', lastModified: 'm', version: 'v', nodes: { '1:2': null } }, '1:2')).toThrow('Node 1:2 is not in file "f".');
    expect(() => entryOf({ name: 'f', lastModified: 'm', version: 'v', nodes: {} }, '1:2')).toThrow('Node 1:2 is not in file "f".');
  });
});
