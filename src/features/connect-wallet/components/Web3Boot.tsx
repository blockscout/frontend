// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import { applyThemeMode, startWeb3Runtime } from 'src/features/connect-wallet/utils/runtime';

import { useColorMode } from 'src/toolkit/chakra/color-mode';

// Wallet lifecycle that must run app-wide yet has no UI of its own, kept in a render-nothing component so
// it lives outside the hydration gate and can start work during the first client tick:
//   - kicks off the eager runtime load (reown only — see `startWeb3Runtime`);
//   - keeps the AppKit modal's theme in sync with the app color mode.
// Neither call forces the wallet stack to load, so mounting this stays off the critical path.
const Web3Boot = () => {
  const { colorMode } = useColorMode();

  React.useEffect(() => {
    startWeb3Runtime();
  }, []);

  React.useEffect(() => {
    applyThemeMode(colorMode ?? 'light');
  }, [ colorMode ]);

  return null;
};

export default Web3Boot;
