// SPDX-License-Identifier: LicenseRef-Blockscout

import * as v from 'valibot';

import { IDENTICON_TYPES } from 'src/slices/address/types/config';

import { appSchema, buildTimeSchema, proxySchema } from './schemas/app';
import * as featuresSchemas from './schemas/features';
import servicesSchema from './schemas/services';
import * as uiSchemas from './schemas/ui';
import { composeSchemas, envBoolean, envJson, envRequiredString, envUrl } from './utils';

const chainSchema = v.object({
  NEXT_PUBLIC_NETWORK_NAME: envRequiredString(),
  NEXT_PUBLIC_NETWORK_SHORT_NAME: v.optional(v.string()),
  NEXT_PUBLIC_IS_TESTNET: v.optional(envBoolean()),
});

// Only the view settings that multichain mode actually supports.
const viewsSchema = v.object({
  NEXT_PUBLIC_VIEWS_ADDRESS_IDENTICON_TYPE: v.optional(v.picklist(IDENTICON_TYPES)),
  NEXT_PUBLIC_INTERNAL_TXS_ENABLED: v.optional(envBoolean()),
});

// Not every feature is supported in multichain mode; the ones enabled by default must be turned off
// explicitly, hence the `false`-only flags.
const featuresSchema = v.object({
  NEXT_PUBLIC_OG_DESCRIPTION: v.optional(v.string()),
  NEXT_PUBLIC_OG_IMAGE_URL: v.optional(envUrl()),

  NEXT_PUBLIC_GAS_TRACKER_ENABLED: v.optional(v.pipe(envBoolean(), v.literal(false))),
  NEXT_PUBLIC_ADVANCED_FILTER_ENABLED: v.optional(v.pipe(envBoolean(), v.literal(false))),
  NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED: v.optional(v.pipe(envBoolean(), v.literal(false))),
  NEXT_PUBLIC_API_DOCS_TABS: v.optional(envJson(v.pipe(v.array(v.unknown()), v.maxLength(0)))),
});

const multichainSchema = v.object({
  NEXT_PUBLIC_MULTICHAIN_ENABLED: v.optional(envBoolean()),
  NEXT_PUBLIC_MULTICHAIN_CLUSTER: v.optional(v.string()),
  NEXT_PUBLIC_MULTICHAIN_AGGREGATOR_API_HOST: v.optional(envUrl()),
  NEXT_PUBLIC_MULTICHAIN_STATS_API_HOST: v.optional(envUrl()),
});

const schema = composeSchemas([
  buildTimeSchema,
  appSchema,
  proxySchema,
  chainSchema,
  viewsSchema,
  featuresSchema,
  multichainSchema,
  uiSchemas.homepageSchema,
  uiSchemas.navigationSchema,
  uiSchemas.footerSchema,
  uiSchemas.miscSchema,
  featuresSchemas.adsSchema,
  featuresSchemas.crossChainTxsSchema,
  featuresSchemas.defiDropdownSchema,
  featuresSchemas.multichainButtonSchema,
  featuresSchemas.userOpsSchema,
  servicesSchema,
]);

export default schema;
