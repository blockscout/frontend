// SPDX-License-Identifier: LicenseRef-Blockscout

import type React from 'react';

import type { ColorModeValue } from 'src/config/types';
import type { ChainIndicatorId } from 'src/slices/home/types/config';

export interface HighlightsBannerConfig {
  title: string;
  description: string;
  title_color?: ColorModeValue;
  description_color?: ColorModeValue;
  background?: ColorModeValue;
  side_img_url?: ColorModeValue;
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
