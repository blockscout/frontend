import { describe, expect, it } from 'vitest';

import { parseNodeRef } from './url';

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
