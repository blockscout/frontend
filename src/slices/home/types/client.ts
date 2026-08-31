// SPDX-License-Identifier: LicenseRef-Blockscout

import type React from 'react';

import type { ChainIndicatorId } from 'src/slices/home/types/config';

export interface HighlightsBannerConfig {
  title: string;
  description: string;
  title_color?: Array<string | undefined>;
  description_color?: Array<string | undefined>;
  background?: Array<string | undefined>;
  side_img_url?: Array<string | undefined>;
  is_pinned?: boolean;
  page_path?: string;
  redirect_url?: string;
}

export interface TChainIndicator {
  id: ChainIndicatorId;
  title: string;
  titleShort?: string;
  value: string;
  valueDiff?: number;
  icon: React.ReactNode;
  hint?: string;
}
