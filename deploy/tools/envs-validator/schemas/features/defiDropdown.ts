// SPDX-License-Identifier: LicenseRef-Blockscout

import * as v from 'valibot';

import { envJson, requires } from '../../utils';

const MIN_ITEMS_FOR_DROPDOWN = 2;

const deFiDropdownItemSchema = v.pipe(
  v.object({
    text: v.pipe(v.string(), v.nonEmpty()),
    icon: v.optional(v.string()),
    dappId: v.optional(v.string()),
    isEssentialDapp: v.optional(v.boolean()),
    url: v.optional(v.pipe(v.string(), v.url())),
  }),
  v.check((item) => Boolean(item.dappId) || Boolean(item.url), 'Either dappId or url is required'),
);

const deFiDropdownButtonTextSchema = v.object({
  desktop: v.pipe(v.string(), v.nonEmpty()),
  mobile: v.optional(v.string()),
});

export const defiDropdownSchema = v.pipe(
  v.object({
    NEXT_PUBLIC_DEFI_DROPDOWN_ITEMS: v.optional(envJson(v.array(deFiDropdownItemSchema))),
    NEXT_PUBLIC_DEFI_DROPDOWN_BUTTON_TEXT: v.optional(envJson(deFiDropdownButtonTextSchema)),
  }),
  requires('NEXT_PUBLIC_DEFI_DROPDOWN_BUTTON_TEXT', 'NEXT_PUBLIC_DEFI_DROPDOWN_ITEMS', {
    when: (items) => Array.isArray(items) && items.length >= MIN_ITEMS_FOR_DROPDOWN,
    message: `NEXT_PUBLIC_DEFI_DROPDOWN_BUTTON_TEXT can only be used when NEXT_PUBLIC_DEFI_DROPDOWN_ITEMS contains at least ${ MIN_ITEMS_FOR_DROPDOWN } items`,
  }),
);
