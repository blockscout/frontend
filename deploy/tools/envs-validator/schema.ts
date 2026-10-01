// SPDX-License-Identifier: LicenseRef-Blockscout

import * as v from 'valibot';

import type { TxExternalTxsConfig } from 'src/features/external-txs/types/client';
import type { GasRefuelProviderConfig } from 'src/features/get-gas-button/types/client';
import { PROVIDERS as TX_INTERPRETATION_PROVIDERS } from 'src/features/tx-interpretation/common/types/config';
import { VALIDATORS_CHAIN_TYPE } from 'src/features/validators/types/config';
import { SUPPORTED_WALLETS } from 'src/features/web3-wallet/types/config';
import { GAS_UNITS } from 'src/slices/gas/types/config';

import apisSchema from './schemas/apis';
import { appSchema, buildTimeSchema, proxySchema } from './schemas/app';
import chainSchema from './schemas/chain';
import * as featuresSchemas from './schemas/features';
import metaSchema from './schemas/meta';
import servicesSchema from './schemas/services';
import * as uiSchemas from './schemas/ui';
import { composeSchemas, envBoolean, envJson, envUrl, requires } from './utils';

type AddressProfileAPIConfig = {
  api_url_template: string;
  tag_link_template?: string;
  tag_icon?: string;
  tag_bg_color?: string;
  tag_text_color?: string;
};

const gasRefuelProviderConfigSchema: v.GenericSchema<GasRefuelProviderConfig> = v.object({
  name: v.pipe(v.string(), v.nonEmpty()),
  url_template: v.pipe(v.string(), v.nonEmpty()),
  logo: v.optional(v.string()),
  dapp_id: v.optional(v.string()),
});

const addressProfileAPIConfigSchema: v.GenericSchema<AddressProfileAPIConfig> = v.object({
  api_url_template: v.pipe(v.string(), v.nonEmpty()),
  tag_link_template: v.optional(v.string()),
  tag_icon: v.optional(v.string()),
  tag_bg_color: v.optional(v.string()),
  tag_text_color: v.optional(v.string()),
});

const txExternalTxsConfigSchema: v.GenericSchema<TxExternalTxsConfig> = v.object({
  chain_name: v.pipe(v.string(), v.nonEmpty()),
  chain_logo_url: v.pipe(v.string(), v.nonEmpty()),
  explorer_url_template: v.pipe(v.string(), v.nonEmpty()),
});

const usercentricsConfigSchema = v.object({
  settingsId: v.optional(v.string()),
  rulesetId: v.optional(v.string()),
});

// Features that need a single ENV variable live here; multi-variable features get their own file in
// "./schemas/features".
const singleVariableFeaturesSchema = v.pipe(
  v.looseObject({
    NEXT_PUBLIC_WEB3_WALLETS: v.optional(v.union([ v.literal('none'), envJson(v.array(v.picklist(SUPPORTED_WALLETS))) ])),
    NEXT_PUBLIC_WEB3_DISABLE_ADD_TOKEN_TO_WALLET: v.optional(envBoolean()),
    NEXT_PUBLIC_TRANSACTION_INTERPRETATION_PROVIDER: v.optional(v.picklist(TX_INTERPRETATION_PROVIDERS)),
    NEXT_PUBLIC_SAFE_TX_SERVICE_URL: v.optional(envUrl()),
    NEXT_PUBLIC_IS_SUAVE_CHAIN: v.optional(envBoolean()),
    NEXT_PUBLIC_METASUITES_ENABLED: v.optional(envBoolean()),
    NEXT_PUBLIC_GAS_REFUEL_PROVIDER_CONFIG: v.optional(envJson(gasRefuelProviderConfigSchema)),
    NEXT_PUBLIC_VALIDATORS_CHAIN_TYPE: v.optional(v.picklist(VALIDATORS_CHAIN_TYPE)),
    NEXT_PUBLIC_GAS_TRACKER_ENABLED: v.optional(envBoolean()),
    NEXT_PUBLIC_GAS_TRACKER_UNITS: v.optional(envJson(v.array(v.picklist(GAS_UNITS)))),
    NEXT_PUBLIC_DATA_AVAILABILITY_ENABLED: v.optional(envBoolean()),
    NEXT_PUBLIC_ADVANCED_FILTER_ENABLED: v.optional(envBoolean()),
    NEXT_PUBLIC_CELO_ENABLED: v.optional(envBoolean()),
    NEXT_PUBLIC_DEX_POOLS_ENABLED: v.optional(envBoolean()),
    NEXT_PUBLIC_ADDRESS_USERNAME_TAG: v.optional(envJson(addressProfileAPIConfigSchema)),
    NEXT_PUBLIC_XSTAR_SCORE_URL: v.optional(envUrl()),
    NEXT_PUBLIC_GAME_BADGE_CLAIM_LINK: v.optional(envUrl()),
    NEXT_PUBLIC_PUZZLE_GAME_BADGE_CLAIM_LINK: v.optional(envUrl()),
    NEXT_PUBLIC_TX_EXTERNAL_TRANSACTIONS_CONFIG: v.optional(envJson(txExternalTxsConfigSchema)),
    NEXT_PUBLIC_HOT_CONTRACTS_ENABLED: v.optional(envBoolean()),
    NEXT_PUBLIC_USERCENTRICS_CONFIG: v.optional(envJson(usercentricsConfigSchema)),
    NEXT_PUBLIC_USERCENTRICS_DRAFT: v.optional(envBoolean()),
  }),
  requires('NEXT_PUBLIC_DEX_POOLS_ENABLED', 'NEXT_PUBLIC_CONTRACT_INFO_API_HOST'),
  requires('NEXT_PUBLIC_USERCENTRICS_DRAFT', 'NEXT_PUBLIC_USERCENTRICS_CONFIG'),
);

const miscSchema = v.object({
  NEXT_PUBLIC_PRO_API_SUPPORTED: v.optional(envBoolean()),
  NEXT_PUBLIC_API_KEYS_ALERT_MESSAGE: v.optional(v.string()),
  NEXT_PUBLIC_API_DOCS_ALERT_MESSAGE: v.optional(v.string()),
});

const schema = composeSchemas([
  buildTimeSchema,
  appSchema,
  proxySchema,
  singleVariableFeaturesSchema,
  miscSchema,
  apisSchema,
  chainSchema,
  metaSchema,
  uiSchemas.homepageSchema,
  uiSchemas.navigationSchema,
  uiSchemas.footerSchema,
  uiSchemas.miscSchema,
  uiSchemas.viewsSchema,
  featuresSchemas.accountSchema,
  featuresSchemas.address3rdPartyWidgetsConfigSchema,
  featuresSchemas.adsSchema,
  featuresSchemas.apiDocsSchema,
  featuresSchemas.beaconChainSchema,
  featuresSchemas.bridgedTokensSchema,
  featuresSchemas.crossChainTxsSchema,
  featuresSchemas.defiDropdownSchema,
  featuresSchemas.flashblocksSchema,
  featuresSchemas.highlightsConfigSchema,
  featuresSchemas.marketplaceSchema,
  featuresSchemas.megaEthSchema,
  featuresSchemas.multichainButtonSchema,
  featuresSchemas.nameServicesSchema,
  featuresSchemas.rollupSchema,
  featuresSchemas.tacSchema,
  featuresSchemas.userOpsSchema,
  featuresSchemas.zetaChainSchema,
  servicesSchema,
]);

export default schema;
