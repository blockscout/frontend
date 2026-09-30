// SPDX-License-Identifier: LicenseRef-Blockscout

import * as yup from 'yup';

import { urlTest } from '../utils';

export default yup.object({
  NEXT_PUBLIC_PROMOTE_BLOCKSCOUT_IN_TITLE: yup.boolean(),
  NEXT_PUBLIC_OG_DESCRIPTION: yup.string(),
  NEXT_PUBLIC_OG_IMAGE_URL: yup.string().test(urlTest),
  NEXT_PUBLIC_OG_ENHANCED_DATA_ENABLED: yup.boolean(),
  NEXT_PUBLIC_SEO_ENHANCED_DATA_ENABLED: yup.boolean(),
});
