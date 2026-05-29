// SPDX-License-Identifier: LicenseRef-Blockscout

import config from 'src/config';

const maxWidthVerticalNavigation = config.shell.layout.maxContentWidth ? 1_920 : 10_000;
const maxWidthHorizontalNavigation = config.shell.layout.maxContentWidth ? 1_440 : 10_000;

export const CONTENT_MAX_WIDTH = config.shell.navigation.layout === 'horizontal' ? maxWidthHorizontalNavigation : maxWidthVerticalNavigation;
