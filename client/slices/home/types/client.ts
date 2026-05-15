// SPDX-License-Identifier: LicenseRef-Blockscout

import type React from 'react';
import type { ReactElement } from 'react';

import type { ChainIndicatorId, HomeStatsWidgetId } from 'client/slices/home/types/config';

import type { Props as StatsWidgetProps } from 'ui/shared/stats/StatsWidget';

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

export type HomeStatsComponentItem = { id: HomeStatsWidgetId; component: ReactElement };
export type HomeStatsWidgetItem = StatsWidgetProps & { id: HomeStatsWidgetId; component?: undefined };

export type HomeStatsItem = HomeStatsComponentItem | HomeStatsWidgetItem;
