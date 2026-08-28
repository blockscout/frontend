// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { Props as StatsWidgetProps } from 'src/shared/stats/StatsWidget';
import StatsWidget from 'src/shared/stats/StatsWidget';

const HomeStatsWidget = React.forwardRef<HTMLDivElement, StatsWidgetProps>((props, ref) => {
  return <StatsWidget ref={ ref } _odd={{ _last: { gridColumn: 'span 2' } }} { ...props }/>;
});

export default React.memo(HomeStatsWidget);
