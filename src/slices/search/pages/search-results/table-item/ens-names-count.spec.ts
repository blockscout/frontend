import { describe, expect, it } from 'vitest';

import { getEnsNamesCountLabel } from './ens-names-count';

describe('getEnsNamesCountLabel', () => {
  it.each([
    [ 0, undefined ],
    [ 1, undefined ],
    [ 2, '+1' ],
    [ 39, '+38' ],
    [ 40, '40+' ],
    [ 100, '40+' ],
  ])('%i names → %s', (namesCount, expected) => {
    expect(getEnsNamesCountLabel(namesCount)).toBe(expected);
  });
});
