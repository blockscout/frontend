// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it } from 'vitest';

import { extractDocumentedEnvNames, extractEnvNames, parseEnvNames } from './registry';

describe('parseEnvNames', () => {
  it('returns the variable name of every non-empty line', () => {
    const content = 'NEXT_PUBLIC_APP_HOST=localhost\n NEXT_PUBLIC_APP_PORT =3000\n\nNEXT_PUBLIC_FOO=__\n';
    expect(parseEnvNames(content)).toEqual([ 'NEXT_PUBLIC_APP_HOST', 'NEXT_PUBLIC_APP_PORT', 'NEXT_PUBLIC_FOO' ]);
  });

  it('keeps a line without a value', () => {
    expect(parseEnvNames('NEXT_PUBLIC_FOO')).toEqual([ 'NEXT_PUBLIC_FOO' ]);
  });

  it('returns an empty list for empty content', () => {
    expect(parseEnvNames('')).toEqual([]);
  });
});

describe('extractEnvNames', () => {
  it('returns every distinct NEXT_PUBLIC_ name in the text, sorted', () => {
    const markdown = '| NEXT_PUBLIC_B_VAR | uses `NEXT_PUBLIC_A_VAR` |\nsee NEXT_PUBLIC_B_VAR again and NEXT_PUBLIC_C_2';
    expect(extractEnvNames(markdown)).toEqual([ 'NEXT_PUBLIC_A_VAR', 'NEXT_PUBLIC_B_VAR', 'NEXT_PUBLIC_C_2' ]);
  });

  it('stops a name at the first character that is not a word character', () => {
    expect(extractEnvNames('NEXT_PUBLIC_FOO-bar NEXT_PUBLIC_BAZ.')).toEqual([ 'NEXT_PUBLIC_BAZ', 'NEXT_PUBLIC_FOO' ]);
  });

  it('returns an empty list when the text has no names', () => {
    expect(extractEnvNames('nothing here')).toEqual([]);
  });
});

describe('extractDocumentedEnvNames', () => {
  it('returns only the names that open a table row', () => {
    const markdown = [
      '| Variable | Type |',
      '| NEXT_PUBLIC_B_VAR | `string` |',
      '|NEXT_PUBLIC_A_VAR| `boolean` |',
      'The NEXT_PUBLIC_C_VAR variables are described above, see also `NEXT_PUBLIC_A_VAR`.',
    ].join('\n');
    expect(extractDocumentedEnvNames(markdown)).toEqual([ 'NEXT_PUBLIC_A_VAR', 'NEXT_PUBLIC_B_VAR' ]);
  });
});
