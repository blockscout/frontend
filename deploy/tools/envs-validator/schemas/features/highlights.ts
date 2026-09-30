// SPDX-License-Identifier: LicenseRef-Blockscout

import * as yup from 'yup';

import type { HighlightsBannerConfig } from 'src/slices/home/types/client';

import { urlTest } from '../../utils';

const highlightsBannerConfigSchema: yup.ObjectSchema<HighlightsBannerConfig> = yup.object({
  title: yup.string().required(),
  description: yup.string().required(),
  title_color: yup.array().max(2).of(yup.string()),
  description_color: yup.array().max(2).of(yup.string()),
  background: yup.array().max(2).of(yup.string()),
  side_img_url: yup.array().max(2).of(yup.string()),
  is_pinned: yup.boolean(),
  page_path: yup.string(),
  redirect_url: yup.string().test(urlTest),
});

export const highlightsConfigSchema = yup
  .object()
  .shape({
    NEXT_PUBLIC_HOMEPAGE_HIGHLIGHTS_CONFIG: yup
      .array()
      .json()
      .of(highlightsBannerConfigSchema)
      .min(2),
  });
