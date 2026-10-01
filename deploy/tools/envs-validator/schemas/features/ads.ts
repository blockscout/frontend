// SPDX-License-Identifier: LicenseRef-Blockscout

import * as v from 'valibot';

import { SUPPORTED_AD_BANNER_PROVIDERS, SUPPORTED_AD_BANNER_ADDITIONAL_PROVIDERS } from 'src/features/ads/banner/types/config';
import { SUPPORTED_AD_TEXT_PROVIDERS } from 'src/features/ads/text/types/config';

import { companionRule, envBoolean, envJson, envNumber, requiredIf } from '../../utils';

const SEVIO_ZONES_COUNT = 2;

const adButlerConfigSchema = envJson(v.object({
  id: v.pipe(v.string(), v.nonEmpty()),
  width: v.pipe(envNumber(), v.gtValue(0)),
  height: v.pipe(envNumber(), v.gtValue(0)),
}));

const sevioZonesSchema = envJson(v.array(v.pipe(v.string(), v.nonEmpty())));

const isAdButler = (provider: unknown) => provider === 'adbutler';

export const adsSchema = v.pipe(
  v.object({
    NEXT_PUBLIC_AD_TEXT_PROVIDER: v.optional(v.picklist(SUPPORTED_AD_TEXT_PROVIDERS)),
    NEXT_PUBLIC_AD_BANNER_PROVIDER: v.optional(v.picklist(SUPPORTED_AD_BANNER_PROVIDERS)),
    NEXT_PUBLIC_AD_BANNER_ADDITIONAL_PROVIDER: v.optional(v.picklist(SUPPORTED_AD_BANNER_ADDITIONAL_PROVIDERS)),
    NEXT_PUBLIC_AD_BANNER_SEVIO_ZONES: v.optional(sevioZonesSchema),
    NEXT_PUBLIC_AD_ADBUTLER_CONFIG_DESKTOP: v.optional(adButlerConfigSchema),
    NEXT_PUBLIC_AD_ADBUTLER_CONFIG_MOBILE: v.optional(adButlerConfigSchema),
    NEXT_PUBLIC_AD_BANNER_ENABLE_SPECIFY: v.optional(envBoolean()),
  }),
  requiredIf('NEXT_PUBLIC_AD_ADBUTLER_CONFIG_DESKTOP', 'NEXT_PUBLIC_AD_BANNER_PROVIDER', { when: isAdButler }),
  requiredIf('NEXT_PUBLIC_AD_ADBUTLER_CONFIG_MOBILE', 'NEXT_PUBLIC_AD_BANNER_PROVIDER', { when: isAdButler }),
  requiredIf('NEXT_PUBLIC_AD_ADBUTLER_CONFIG_DESKTOP', 'NEXT_PUBLIC_AD_BANNER_ADDITIONAL_PROVIDER', { when: isAdButler }),
  requiredIf('NEXT_PUBLIC_AD_ADBUTLER_CONFIG_MOBILE', 'NEXT_PUBLIC_AD_BANNER_ADDITIONAL_PROVIDER', { when: isAdButler }),
  companionRule(
    [ 'NEXT_PUBLIC_AD_BANNER_SEVIO_ZONES', 'NEXT_PUBLIC_AD_BANNER_PROVIDER' ],
    ({ NEXT_PUBLIC_AD_BANNER_SEVIO_ZONES: zones, NEXT_PUBLIC_AD_BANNER_PROVIDER: provider }) =>
      provider !== 'sevio' || !Array.isArray(zones) || zones.length === SEVIO_ZONES_COUNT,
    `NEXT_PUBLIC_AD_BANNER_SEVIO_ZONES must have ${ SEVIO_ZONES_COUNT } items`,
  ),
);
