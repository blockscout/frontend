// SPDX-License-Identifier: LicenseRef-Blockscout

import type React from 'react';

export default function isMetaKey(event: React.KeyboardEvent) {
  return event.metaKey || event.getModifierState('Meta');
}
