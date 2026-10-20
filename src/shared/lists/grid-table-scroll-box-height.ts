// SPDX-License-Identifier: LicenseRef-Blockscout

import { TOP_BAR_HEIGHT } from 'src/shell/layout/utils';
import { ACTION_BAR_HEIGHT_DESKTOP } from 'src/shell/page/action-bar/ActionBar';

export const GRID_TABLE_SCROLL_BOX_OFFSET = TOP_BAR_HEIGHT + ACTION_BAR_HEIGHT_DESKTOP;

export const GRID_TABLE_SCROLL_BOX_HEIGHT = `calc(100vh - ${ GRID_TABLE_SCROLL_BOX_OFFSET }px)`;
