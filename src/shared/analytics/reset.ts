// SPDX-License-Identifier: LicenseRef-Blockscout

import * as queue from 'src/services/mixpanel/queue';

export default function reset() {
  queue.reset();
}
