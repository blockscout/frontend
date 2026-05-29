// SPDX-License-Identifier: LicenseRef-Blockscout

import mixpanel from 'mixpanel-browser';

import config from 'src/config';

export default function reset() {
  if (!config.services.mixpanel.projectToken) {
    return;
  }
  mixpanel.reset();
}
