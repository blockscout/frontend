// SPDX-License-Identifier: LicenseRef-Blockscout

import type { MultichainProviderConfig } from 'src/features/multichain-button/types/client';

import { describe, expect, it } from 'vitest';

import { toEnvValue } from '../../test-utils';
import { getValidationErrors } from '../../utils';
import { multichainButtonSchema } from './multichainButton';

const provider: MultichainProviderConfig = {
  name: 'zerion',
  url_template: 'https://app.zerion.io/{address}/overview',
  logo: 'https://example.com/zerion.svg',
};

describe('multichainButtonSchema', () => {
  it('accepts a provider list', () => {
    expect(getValidationErrors(multichainButtonSchema, {
      NEXT_PUBLIC_MULTICHAIN_BALANCE_PROVIDER_CONFIG: toEnvValue([ provider, { ...provider, dapp_id: 'zerion', view: 'icon' } ]),
    })).toEqual([]);
  });

  it('rejects a provider without a URL template', () => {
    expect(getValidationErrors(multichainButtonSchema, {
      NEXT_PUBLIC_MULTICHAIN_BALANCE_PROVIDER_CONFIG: toEnvValue([ { name: provider.name, logo: provider.logo } ]),
    })).toEqual([ 'NEXT_PUBLIC_MULTICHAIN_BALANCE_PROVIDER_CONFIG[0].url_template is a required field' ]);
  });

  it('rejects a provider with an unsupported view', () => {
    expect(getValidationErrors(multichainButtonSchema, {
      NEXT_PUBLIC_MULTICHAIN_BALANCE_PROVIDER_CONFIG: toEnvValue([ { ...provider, view: 'compact' } ]),
    })).toEqual([ 'NEXT_PUBLIC_MULTICHAIN_BALANCE_PROVIDER_CONFIG[0].view must be one of the following values: full, icon' ]);
  });
});
