// SPDX-License-Identifier: LicenseRef-Blockscout

import * as v from 'valibot';

import { envBoolean, envJson, envUrl, requiredIf, requires } from '../../utils';

const nestedUrlSchema = v.pipe(v.string(), v.url());
const nestedRequiredStringSchema = v.pipe(v.string(), v.nonEmpty());

const marketplaceAppSchema = v.object({
  id: nestedRequiredStringSchema,
  external: v.optional(v.boolean()),
  title: nestedRequiredStringSchema,
  logo: nestedUrlSchema,
  logoDarkMode: v.optional(nestedUrlSchema),
  shortDescription: nestedRequiredStringSchema,
  categories: v.array(nestedRequiredStringSchema),
  url: nestedUrlSchema,
  author: nestedRequiredStringSchema,
  description: nestedRequiredStringSchema,
  site: v.optional(nestedUrlSchema),
  twitter: v.optional(nestedUrlSchema),
  telegram: v.optional(nestedUrlSchema),
  github: v.optional(v.union([ v.array(nestedUrlSchema), nestedUrlSchema ])),
  discord: v.optional(nestedUrlSchema),
  internalWallet: v.optional(v.boolean()),
  priority: v.optional(v.number()),
});

const essentialDappChainsSchema = v.pipe(v.array(nestedRequiredStringSchema), v.minLength(1));

const essentialDappsConfigSchema = v.object({
  swap: v.optional(v.nullable(v.object({
    chains: essentialDappChainsSchema,
    fee: nestedRequiredStringSchema,
    integrator: nestedRequiredStringSchema,
  }))),
  revoke: v.optional(v.nullable(v.object({
    chains: essentialDappChainsSchema,
  }))),
  multisend: v.optional(v.nullable(v.object({
    chains: essentialDappChainsSchema,
    posthogKey: v.optional(v.string()),
    posthogHost: v.optional(nestedUrlSchema),
  }))),
});

const marketplaceTitlesSchema = v.object({
  menu_item: v.optional(v.string()),
  title: v.optional(v.string()),
  subtitle_essential_dapps: v.optional(v.string()),
  subtitle_list: v.optional(v.string()),
});

const dependentOnMarketplaceEnabled = (name: string) => requires(name, 'NEXT_PUBLIC_MARKETPLACE_ENABLED', {
  message: `${ name } cannot not be used without NEXT_PUBLIC_MARKETPLACE_ENABLED`,
});

export const marketplaceSchema = v.pipe(
  v.object({
    NEXT_PUBLIC_MARKETPLACE_ENABLED: v.optional(envBoolean()),
    NEXT_PUBLIC_MARKETPLACE_CONFIG_URL: v.optional(envJson(v.array(marketplaceAppSchema))),
    NEXT_PUBLIC_MARKETPLACE_CATEGORIES_URL: v.optional(envJson(v.array(v.string()))),
    NEXT_PUBLIC_MARKETPLACE_SUBMIT_FORM: v.optional(envUrl()),
    NEXT_PUBLIC_MARKETPLACE_SUGGEST_IDEAS_FORM: v.optional(envUrl()),
    NEXT_PUBLIC_MARKETPLACE_FEATURED_APP: v.optional(v.string()),
    NEXT_PUBLIC_MARKETPLACE_BANNER_CONTENT_URL: v.optional(envUrl()),
    NEXT_PUBLIC_MARKETPLACE_BANNER_LINK_URL: v.optional(envUrl()),
    NEXT_PUBLIC_MARKETPLACE_GRAPH_LINKS_URL: v.optional(v.string()),
    NEXT_PUBLIC_MARKETPLACE_ESSENTIAL_DAPPS_CONFIG: v.optional(envJson(essentialDappsConfigSchema)),
    NEXT_PUBLIC_MARKETPLACE_TITLES: v.optional(envJson(marketplaceTitlesSchema)),
    NEXT_PUBLIC_MARKETPLACE_ESSENTIAL_DAPPS_AD_ENABLED: v.optional(envBoolean()),
  }),
  dependentOnMarketplaceEnabled('NEXT_PUBLIC_MARKETPLACE_CONFIG_URL'),
  dependentOnMarketplaceEnabled('NEXT_PUBLIC_MARKETPLACE_CATEGORIES_URL'),
  dependentOnMarketplaceEnabled('NEXT_PUBLIC_MARKETPLACE_SUBMIT_FORM'),
  requiredIf('NEXT_PUBLIC_MARKETPLACE_SUBMIT_FORM', 'NEXT_PUBLIC_MARKETPLACE_ENABLED'),
  dependentOnMarketplaceEnabled('NEXT_PUBLIC_MARKETPLACE_SUGGEST_IDEAS_FORM'),
  dependentOnMarketplaceEnabled('NEXT_PUBLIC_MARKETPLACE_FEATURED_APP'),
  dependentOnMarketplaceEnabled('NEXT_PUBLIC_MARKETPLACE_BANNER_CONTENT_URL'),
  dependentOnMarketplaceEnabled('NEXT_PUBLIC_MARKETPLACE_BANNER_LINK_URL'),
  dependentOnMarketplaceEnabled('NEXT_PUBLIC_MARKETPLACE_GRAPH_LINKS_URL'),
  dependentOnMarketplaceEnabled('NEXT_PUBLIC_MARKETPLACE_ESSENTIAL_DAPPS_CONFIG'),
  dependentOnMarketplaceEnabled('NEXT_PUBLIC_MARKETPLACE_TITLES'),
  dependentOnMarketplaceEnabled('NEXT_PUBLIC_MARKETPLACE_ESSENTIAL_DAPPS_AD_ENABLED'),
);
