// SPDX-License-Identifier: LicenseRef-Blockscout

import type React from 'react';
import type { ReactElement } from 'react';

import type { ColorModeValue } from 'src/config/types';
import type { ChainIndicatorId, HomeStatsWidgetId } from 'src/slices/home/types/config';

import type { Props as StatsWidgetProps } from 'src/shared/stats/StatsWidget';

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

export type HomeStatsComponentItem = { id: HomeStatsWidgetId; component: ReactElement };
export type HomeStatsWidgetItem = StatsWidgetProps & { id: HomeStatsWidgetId; component?: undefined };

export type HomeStatsItem = HomeStatsComponentItem | HomeStatsWidgetItem;
