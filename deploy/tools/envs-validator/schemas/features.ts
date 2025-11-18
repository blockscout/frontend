import * as yup from 'yup';
import { replaceQuotes } from '../../../../configs/app/utils';
import { SUPPORTED_AD_TEXT_PROVIDERS, SUPPORTED_AD_BANNER_PROVIDERS, SUPPORTED_AD_BANNER_ADDITIONAL_PROVIDERS } from '../../../../types/client/adProviders';
import type { AdTextProviders, AdBannerProviders, AdBannerAdditionalProviders } from '../../../../types/client/adProviders';
import type { AdButlerConfig } from '../../../../types/client/adButlerConfig';
import { urlTest } from '../utils';
import { IconName } from '../../../../ui/shared/IconSvg';
import { DeFiDropdownItem } from '../../../../types/client/deFiDropdown';

const adButlerConfigSchema = yup
  .object<AdButlerConfig>()
  .transform(replaceQuotes)
  .json()
  .when('NEXT_PUBLIC_AD_BANNER_PROVIDER', {
    is: (value: AdBannerProviders) => value === 'adbutler',
    then: (schema) => schema
      .shape({
        id: yup.string().required(),
        width: yup.number().positive().required(),
        height: yup.number().positive().required(),
      })
      .required(),
  })
  .when('NEXT_PUBLIC_AD_BANNER_ADDITIONAL_PROVIDER', {
    is: (value: AdBannerProviders) => value === 'adbutler',
    then: (schema) => schema
      .shape({
        id: yup.string().required(),
        width: yup.number().positive().required(),
        height: yup.number().positive().required(),
      })
      .required(),
  });

export const adsSchema = yup.object({
    NEXT_PUBLIC_AD_TEXT_PROVIDER: yup.string<AdTextProviders>().oneOf(SUPPORTED_AD_TEXT_PROVIDERS),
    NEXT_PUBLIC_AD_BANNER_PROVIDER: yup.string<AdBannerProviders>().oneOf(SUPPORTED_AD_BANNER_PROVIDERS),
    NEXT_PUBLIC_AD_BANNER_ADDITIONAL_PROVIDER: yup.string<AdBannerAdditionalProviders>().oneOf(SUPPORTED_AD_BANNER_ADDITIONAL_PROVIDERS),
    NEXT_PUBLIC_AD_ADBUTLER_CONFIG_DESKTOP: adButlerConfigSchema,
    NEXT_PUBLIC_AD_ADBUTLER_CONFIG_MOBILE: adButlerConfigSchema,
    NEXT_PUBLIC_AD_BANNER_ENABLE_SPECIFY: yup.boolean(),
});

export const userOpsSchema = yup
  .object()
  .shape({
    NEXT_PUBLIC_HAS_USER_OPS: yup.boolean(),
    NEXT_PUBLIC_USER_OPS_INDEXER_API_HOST: yup
      .string()
      .test(urlTest)
      .when('NEXT_PUBLIC_HAS_USER_OPS', {
        is: (value: boolean) => value,
        then: (schema) => schema,
        otherwise: (schema) => schema.max(-1, 'NEXT_PUBLIC_USER_OPS_INDEXER_API_HOST can only be used if NEXT_PUBLIC_HAS_USER_OPS is set to \'true\''),
      }),
  });

const deFiDropdownItemSchema: yup.ObjectSchema<DeFiDropdownItem> = yup
  .object({
    text: yup.string().required(),
    icon: yup.string<IconName>(),
    dappId: yup.string(),
    url: yup.string().test(urlTest),
  })
  .test('oneOfRequired', 'NEXT_PUBLIC_DEFI_DROPDOWN_ITEMS: Either dappId or url is required', function(value) {
    return Boolean(value.dappId) || Boolean(value.url);
  }) as yup.ObjectSchema<DeFiDropdownItem>;

export const defiDropdownSchema = yup.object({
    NEXT_PUBLIC_DEFI_DROPDOWN_ITEMS: yup
    .array()
    .transform(replaceQuotes)
    .json()
    .of(deFiDropdownItemSchema),
});