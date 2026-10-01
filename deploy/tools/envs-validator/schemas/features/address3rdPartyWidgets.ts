// SPDX-License-Identifier: LicenseRef-Blockscout

import * as v from 'valibot';

import { ADDRESS_3RD_PARTY_WIDGET_PAGES } from 'src/features/address-3rd-party-widgets/types/view';

import { envJson, requires } from '../../utils';

const widgetSchema = v.object({
  name: v.pipe(v.string(), v.nonEmpty()),
  url: v.pipe(v.string(), v.nonEmpty()),
  icon: v.pipe(v.string(), v.nonEmpty()),
  title: v.pipe(v.string(), v.nonEmpty()),
  hint: v.optional(v.string()),
  valuePath: v.pipe(v.string(), v.nonEmpty()),
  valueTitlePath: v.optional(v.string()),
  pages: v.array(v.picklist(ADDRESS_3RD_PARTY_WIDGET_PAGES)),
  chainIds: v.optional(v.record(v.string(), v.string())),
});

export const address3rdPartyWidgetsConfigSchema = v.pipe(
  v.looseObject({
    NEXT_PUBLIC_ADDRESS_3RD_PARTY_WIDGETS_CONFIG_URL: v.optional(envJson(v.record(v.string(), widgetSchema))),
    NEXT_PUBLIC_ADDRESS_3RD_PARTY_WIDGETS: v.optional(envJson(v.array(v.string()))),
  }),
  requires('NEXT_PUBLIC_ADDRESS_3RD_PARTY_WIDGETS', 'NEXT_PUBLIC_ADDRESS_3RD_PARTY_WIDGETS_CONFIG_URL', {
    message: 'NEXT_PUBLIC_ADDRESS_3RD_PARTY_WIDGETS cannot not be used if NEXT_PUBLIC_ADDRESS_3RD_PARTY_WIDGETS_CONFIG_URL is not provided',
  }),
);
