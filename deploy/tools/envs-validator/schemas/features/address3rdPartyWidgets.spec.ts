// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it } from 'vitest';

import { address3rdPartyWidgetsConfig } from '../../mocks/address3rdPartyWidgets';
import { toEnvValue } from '../../test-utils';
import { getValidationErrors } from '../../utils';
import { address3rdPartyWidgetsConfigSchema } from './address3rdPartyWidgets';

const CONFIG = { NEXT_PUBLIC_ADDRESS_3RD_PARTY_WIDGETS_CONFIG_URL: JSON.stringify(address3rdPartyWidgetsConfig) };

describe('address3rdPartyWidgetsConfigSchema', () => {
  it('accepts the widget list together with the downloaded config', () => {
    expect(getValidationErrors(address3rdPartyWidgetsConfigSchema, {
      ...CONFIG,
      NEXT_PUBLIC_ADDRESS_3RD_PARTY_WIDGETS: toEnvValue([ 'widget-1', 'widget-2' ]),
    })).toEqual([]);
  });

  it('accepts the downloaded config alone', () => {
    expect(getValidationErrors(address3rdPartyWidgetsConfigSchema, CONFIG)).toEqual([]);
  });

  it('rejects the widget list without the config', () => {
    expect(getValidationErrors(address3rdPartyWidgetsConfigSchema, {
      NEXT_PUBLIC_ADDRESS_3RD_PARTY_WIDGETS: toEnvValue([ 'widget-1' ]),
    })).toEqual([
      'NEXT_PUBLIC_ADDRESS_3RD_PARTY_WIDGETS cannot not be used if NEXT_PUBLIC_ADDRESS_3RD_PARTY_WIDGETS_CONFIG_URL is not provided',
    ]);
  });

  it('rejects a widget list entry that is not a string', () => {
    expect(getValidationErrors(address3rdPartyWidgetsConfigSchema, {
      ...CONFIG,
      NEXT_PUBLIC_ADDRESS_3RD_PARTY_WIDGETS: toEnvValue([ {} ]),
    })).toEqual([ 'NEXT_PUBLIC_ADDRESS_3RD_PARTY_WIDGETS.0: Invalid type: Expected string but received Object' ]);
  });

  it('rejects a widget config missing a required field', () => {
    const { valuePath, ...widget } = address3rdPartyWidgetsConfig['widget-2'];
    expect(getValidationErrors(address3rdPartyWidgetsConfigSchema, {
      NEXT_PUBLIC_ADDRESS_3RD_PARTY_WIDGETS_CONFIG_URL: JSON.stringify({ 'widget-2': widget }),
    })).toEqual([ 'NEXT_PUBLIC_ADDRESS_3RD_PARTY_WIDGETS_CONFIG_URL.widget-2.valuePath: Invalid key: Expected "valuePath" but received undefined' ]);
  });

  it('rejects a widget config with an unknown page', () => {
    expect(getValidationErrors(address3rdPartyWidgetsConfigSchema, {
      NEXT_PUBLIC_ADDRESS_3RD_PARTY_WIDGETS_CONFIG_URL: JSON.stringify({
        'widget-2': { ...address3rdPartyWidgetsConfig['widget-2'], pages: [ 'block' ] },
      }),
    })).toEqual([
      'NEXT_PUBLIC_ADDRESS_3RD_PARTY_WIDGETS_CONFIG_URL.widget-2.pages.0: Invalid type: Expected ("eoa" | "contract" | "token") but received "block"',
    ]);
  });
});
