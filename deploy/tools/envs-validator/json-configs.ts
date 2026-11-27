// SPDX-License-Identifier: LicenseRef-Blockscout

import type * as v from 'valibot';

import { colorThemeOverridesSchema } from './schemas/colorThemeOverrides';
import {
  address3rdPartyWidgetsFileSchema,
  highlightsFileSchema,
  marketplaceAppsFileSchema,
  marketplaceCategoriesFileSchema,
  marketplaceGraphLinksFileSchema,
} from './schemas/features';
import { featuredNetworksFileSchema, footerLinksFileSchema, heroBannerSchema } from './schemas/ui';
import { getValidationErrors } from './utils';

export const JSON_CONFIG_FILE_SCHEMAS: Readonly<Record<string, v.GenericSchema>> = {
  NEXT_PUBLIC_FEATURED_NETWORKS: featuredNetworksFileSchema,
  NEXT_PUBLIC_MARKETPLACE_CONFIG_URL: marketplaceAppsFileSchema,
  NEXT_PUBLIC_MARKETPLACE_CATEGORIES_URL: marketplaceCategoriesFileSchema,
  NEXT_PUBLIC_MARKETPLACE_GRAPH_LINKS_URL: marketplaceGraphLinksFileSchema,
  NEXT_PUBLIC_FOOTER_LINKS: footerLinksFileSchema,
  NEXT_PUBLIC_ADDRESS_3RD_PARTY_WIDGETS_CONFIG_URL: address3rdPartyWidgetsFileSchema,
  NEXT_PUBLIC_HOMEPAGE_HIGHLIGHTS_CONFIG: highlightsFileSchema,
  NEXT_PUBLIC_HOMEPAGE_HERO_BANNER_CONFIG: heroBannerSchema,
  NEXT_PUBLIC_COLOR_THEME_OVERRIDES: colorThemeOverridesSchema,
};

export function validateJsonConfigFile(schema: v.GenericSchema, content: string): Array<string> {
  let value: unknown;
  try {
    value = JSON.parse(content);
  } catch (error) {
    return [ `Invalid JSON: ${ error instanceof Error ? error.message : String(error) }` ];
  }
  return getValidationErrors(schema, value);
}
