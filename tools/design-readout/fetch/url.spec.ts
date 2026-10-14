import { describe, expect, it } from 'vitest';

import { fileSafeNodeId, parseNodeId, parseNodeRef } from './url';

describe('parseNodeRef', () => {
  it('reads the file key and a dashed node id from a design link', () => {
    expect(parseNodeRef('https://www.figma.com/design/abcDEF0123456789abcDEF/Pages?node-id=22842-174340&t=abc-4'))
      .toEqual({ fileKey: 'abcDEF0123456789abcDEF', nodeId: '22842:174340' });
  });

  it('accepts the canonical colon form of the node id, encoded or not', () => {
    expect(parseNodeRef('https://www.figma.com/design/abcDEF0123456789abcDEF/?node-id=22842:174340')?.nodeId).toBe('22842:174340');
    expect(parseNodeRef('https://www.figma.com/design/abcDEF0123456789abcDEF/?node-id=22842%3A174340')?.nodeId).toBe('22842:174340');
  });

  it('accepts the older file/ path and a link without a file name segment', () => {
    expect(parseNodeRef('https://www.figma.com/file/abcDEF0123456789abcDEF/Pages?node-id=1-2')).toEqual({ fileKey: 'abcDEF0123456789abcDEF', nodeId: '1:2' });
    expect(parseNodeRef('https://figma.com/design/abcDEF0123456789abcDEF?node-id=1-2')).toEqual({ fileKey: 'abcDEF0123456789abcDEF', nodeId: '1:2' });
  });

  it('rejects anything that is not a figma node link', () => {
    expect(parseNodeRef('22842:174340')).toBeUndefined();
    expect(parseNodeRef('https://www.figma.com/design/abcDEF0123456789abcDEF/Pages')).toBeUndefined();
    expect(parseNodeRef('https://www.figma.com/design/abcDEF0123456789abcDEF/Pages?node-id=abc')).toBeUndefined();
    expect(parseNodeRef('https://example.com/design/abcDEF0123456789abcDEF?node-id=1-2')).toBeUndefined();
    expect(parseNodeRef('https://www.figma.com/board/abcDEF0123456789abcDEF?node-id=1-2')).toBeUndefined();
    expect(parseNodeRef('not a url')).toBeUndefined();
  });
});

describe('parseNodeId', () => {
  it('canonicalizes a plain id from either form', () => {
    expect(parseNodeId('22842-174340')).toBe('22842:174340');
    expect(parseNodeId(' 22842:174340 ')).toBe('22842:174340');
  });

  it('keeps the instance path of a nested id and adds the I prefix the REST API keys it by', () => {
    expect(parseNodeId('I21998:159259;20539:210205;20534:197023')).toBe('I21998:159259;20539:210205;20534:197023');
    expect(parseNodeId('I21998-159259;20539-210205')).toBe('I21998:159259;20539:210205');
    expect(parseNodeId('21998-159259;20539-210205')).toBe('I21998:159259;20539:210205');
  });

  it('rejects anything else', () => {
    expect([ 'abc', '1', '1:2;', ';1:2', 'I;1:2', '1:2;x:y', '' ].map(parseNodeId)).toEqual(Array(7).fill(undefined));
  });

  it('reads a nested id from a link', () => {
    expect(parseNodeRef('https://www.figma.com/design/abcDEF0123456789abcDEF/Pages?node-id=I21998-159259%3B20539-210205')?.nodeId)
      .toBe('I21998:159259;20539:210205');
  });
});

describe('fileSafeNodeId', () => {
  it('turns the separators into file-name characters, keeping plain ids as before', () => {
    expect(fileSafeNodeId('22842:174340')).toBe('22842-174340');
    expect(fileSafeNodeId('I21998:159259;20539:210205')).toBe('I21998-159259_20539-210205');
  });
});
