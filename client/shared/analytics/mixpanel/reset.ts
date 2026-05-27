// SPDX-License-Identifier: LicenseRef-Blockscout

import config from 'client/config';
import mixpanel from 'mixpanel-browser';

export default function reset() {
  if (!config.features.mixpanel.isEnabled) {
    return;
  }
  mixpanel.reset();
}
