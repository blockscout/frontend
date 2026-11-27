// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import * as cookies from 'src/shared/storage/cookies';

export const useIncludePoorReputationTokens = (): boolean => {
  return React.useMemo(() => cookies.get(cookies.NAMES.SHOW_POOR_REPUTATION_TOKENS) === 'true', []);
};
