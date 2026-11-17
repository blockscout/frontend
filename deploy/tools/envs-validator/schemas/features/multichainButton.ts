// SPDX-License-Identifier: LicenseRef-Blockscout

import * as v from 'valibot';

import { envJson } from '../../utils';

const multichainProviderConfigSchema = v.object({
  name: v.pipe(v.string(), v.nonEmpty()),
  url_template: v.pipe(v.string(), v.nonEmpty()),
  logo: v.pipe(v.string(), v.nonEmpty()),
  dapp_id: v.optional(v.string()),
  view: v.optional(v.picklist([ 'full', 'icon' ])),
});

export const multichainButtonSchema = v.looseObject({
  NEXT_PUBLIC_MULTICHAIN_BALANCE_PROVIDER_CONFIG: v.optional(envJson(v.array(multichainProviderConfigSchema))),
});
