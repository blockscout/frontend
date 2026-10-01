// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it } from 'vitest';

import { adButlerConfigDesktop, adButlerConfigMobile, sevioZones } from '../../mocks/ads';
import { toEnvValue } from '../../test-utils';
import { getValidationErrors } from '../../utils';
import { adsSchema } from './ads';

const ADBUTLER_CONFIGS = {
  NEXT_PUBLIC_AD_ADBUTLER_CONFIG_DESKTOP: toEnvValue(adButlerConfigDesktop),
  NEXT_PUBLIC_AD_ADBUTLER_CONFIG_MOBILE: toEnvValue(adButlerConfigMobile),
};

describe('adsSchema', () => {
  it('accepts the text and banner providers', () => {
    expect(getValidationErrors(adsSchema, {
      NEXT_PUBLIC_AD_TEXT_PROVIDER: 'sevio',
      NEXT_PUBLIC_AD_BANNER_PROVIDER: 'slise',
      NEXT_PUBLIC_AD_BANNER_ENABLE_SPECIFY: 'true',
    })).toEqual([]);
  });

  it('accepts adbutler as the banner provider with both device configs', () => {
    expect(getValidationErrors(adsSchema, { NEXT_PUBLIC_AD_BANNER_PROVIDER: 'adbutler', ...ADBUTLER_CONFIGS })).toEqual([]);
  });

  it('accepts adbutler as the additional banner provider with both device configs', () => {
    expect(getValidationErrors(adsSchema, {
      NEXT_PUBLIC_AD_BANNER_PROVIDER: 'slise',
      NEXT_PUBLIC_AD_BANNER_ADDITIONAL_PROVIDER: 'adbutler',
      ...ADBUTLER_CONFIGS,
    })).toEqual([]);
  });

  it('accepts sevio as the banner provider with two zones', () => {
    expect(getValidationErrors(adsSchema, {
      NEXT_PUBLIC_AD_BANNER_PROVIDER: 'sevio',
      NEXT_PUBLIC_AD_BANNER_SEVIO_ZONES: toEnvValue(sevioZones),
    })).toEqual([]);
  });

  it.each([
    [ 'NEXT_PUBLIC_AD_TEXT_PROVIDER', '("sevio" | "none")' ],
    [ 'NEXT_PUBLIC_AD_BANNER_PROVIDER', '("slise" | "adbutler" | "sevio" | "none")' ],
    [ 'NEXT_PUBLIC_AD_BANNER_ADDITIONAL_PROVIDER', '"adbutler"' ],
  ])('rejects an unsupported %s', (name, values) => {
    expect(getValidationErrors(adsSchema, { [name]: 'unknown' })).toEqual([ `${ name }: Invalid type: Expected ${ values } but received "unknown"` ]);
  });

  it('rejects a malformed specify flag', () => {
    expect(getValidationErrors(adsSchema, { NEXT_PUBLIC_AD_BANNER_ENABLE_SPECIFY: 'yes' })).toEqual([
      'NEXT_PUBLIC_AD_BANNER_ENABLE_SPECIFY: Expected "true" or "false" but received "yes"',
    ]);
  });

  describe.each([
    [ 'NEXT_PUBLIC_AD_BANNER_PROVIDER', {} ],
    [ 'NEXT_PUBLIC_AD_BANNER_ADDITIONAL_PROVIDER', { NEXT_PUBLIC_AD_BANNER_PROVIDER: 'slise' } ],
  ])('adbutler as %s', (name, base) => {
    it('rejects missing device configs', () => {
      expect(getValidationErrors(adsSchema, { ...base, [name]: 'adbutler' })).toEqual([
        `NEXT_PUBLIC_AD_ADBUTLER_CONFIG_DESKTOP is required when ${ name } is set`,
        `NEXT_PUBLIC_AD_ADBUTLER_CONFIG_MOBILE is required when ${ name } is set`,
      ]);
    });

    it('rejects a device config with a non-positive size', () => {
      expect(getValidationErrors(adsSchema, {
        ...base,
        [name]: 'adbutler',
        ...ADBUTLER_CONFIGS,
        NEXT_PUBLIC_AD_ADBUTLER_CONFIG_MOBILE: toEnvValue({ ...adButlerConfigMobile, width: '0' }),
      })).toEqual([ 'NEXT_PUBLIC_AD_ADBUTLER_CONFIG_MOBILE.width: Invalid value: Expected >0 but received 0' ]);
    });

    it('rejects a device config with a non-numeric size', () => {
      expect(getValidationErrors(adsSchema, {
        ...base,
        [name]: 'adbutler',
        ...ADBUTLER_CONFIGS,
        NEXT_PUBLIC_AD_ADBUTLER_CONFIG_DESKTOP: toEnvValue({ ...adButlerConfigDesktop, height: 'tall' }),
      })).toEqual([ 'NEXT_PUBLIC_AD_ADBUTLER_CONFIG_DESKTOP.height: Expected a decimal number but received "tall"' ]);
    });

    it('rejects a device config missing the id', () => {
      const { id, ...config } = adButlerConfigDesktop;
      expect(getValidationErrors(adsSchema, {
        ...base,
        [name]: 'adbutler',
        ...ADBUTLER_CONFIGS,
        NEXT_PUBLIC_AD_ADBUTLER_CONFIG_DESKTOP: toEnvValue(config),
      })).toEqual([ 'NEXT_PUBLIC_AD_ADBUTLER_CONFIG_DESKTOP.id: Invalid key: Expected "id" but received undefined' ]);
    });
  });

  it('rejects sevio zones that are not exactly two', () => {
    expect(getValidationErrors(adsSchema, {
      NEXT_PUBLIC_AD_BANNER_PROVIDER: 'sevio',
      NEXT_PUBLIC_AD_BANNER_SEVIO_ZONES: toEnvValue([ sevioZones[0] ]),
    })).toEqual([ 'NEXT_PUBLIC_AD_BANNER_SEVIO_ZONES must have 2 items' ]);
  });
});
