// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextRouter } from 'next/router';

import { ChartResolution } from 'toolkit/components/charts/types';

import getQueryParamString from 'client/shared/router/get-query-param-string';

export const DEFAULT_RESOLUTION = ChartResolution.DAY;

export function getResolutionFromQuery(router: NextRouter): ChartResolution {
  const resolutionFromQuery = getQueryParamString(router.query.resolution) as (keyof typeof ChartResolution | undefined);

  if (!resolutionFromQuery || !ChartResolution[resolutionFromQuery]) {
    return DEFAULT_RESOLUTION;
  }

  return resolutionFromQuery as ChartResolution;
};
