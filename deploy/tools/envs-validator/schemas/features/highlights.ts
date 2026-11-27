// SPDX-License-Identifier: LicenseRef-Blockscout

import * as v from 'valibot';

import { envJsonFile } from '../../utils';

const colorPairSchema = v.optional(v.pipe(v.array(v.string()), v.maxLength(2)));

const highlightsBannerConfigSchema = v.object({
  title: v.pipe(v.string(), v.nonEmpty()),
  description: v.pipe(v.string(), v.nonEmpty()),
  title_color: colorPairSchema,
  description_color: colorPairSchema,
  background: colorPairSchema,
  side_img_url: colorPairSchema,
  is_pinned: v.optional(v.boolean()),
  page_path: v.optional(v.string()),
  redirect_url: v.optional(v.pipe(v.string(), v.url())),
});

export const highlightsFileSchema = v.pipe(v.array(highlightsBannerConfigSchema), v.minLength(2));

export const highlightsConfigSchema = v.object({
  NEXT_PUBLIC_HOMEPAGE_HIGHLIGHTS_CONFIG: v.optional(envJsonFile(highlightsFileSchema)),
});
