// SPDX-License-Identifier: LicenseRef-Blockscout

import * as v from 'valibot';

import { envBoolean, envUrl } from '../utils';

export default v.object({
  NEXT_PUBLIC_PROMOTE_BLOCKSCOUT_IN_TITLE: v.optional(envBoolean()),
  NEXT_PUBLIC_OG_DESCRIPTION: v.optional(v.string()),
  NEXT_PUBLIC_OG_IMAGE_URL: v.optional(envUrl()),
  NEXT_PUBLIC_OG_ENHANCED_DATA_ENABLED: v.optional(envBoolean()),
  NEXT_PUBLIC_SEO_ENHANCED_DATA_ENABLED: v.optional(envBoolean()),
});
